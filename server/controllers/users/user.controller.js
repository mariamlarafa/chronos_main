import { Op } from "sequelize";
import { createMediaUrl } from "../../Utils/FileManager.js";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter,
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import {
  CLIENT_ROLE,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE,
} from "../../constants/constants.js";
import { UserProfile } from "../../db/relations.js";
import { config } from "../../environment.config.js";
import { UnauthorizedError } from "../../errors/http.js";
import logger from "../../log/config.js";
import { send } from "../../mails/config.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";
import User from "../../models/users/User.model.js";
import {
  createPasswordSetToken,
  encryptPassword,
  getUserByEmail,
  serializeProfile,
  serializeUser,
} from "./lib.js";
import { messages } from "../../i18n/messages.js";

/*
admin api to list all the users
*/
export const getAll = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: [
      "id",
      "email",
      "role",
      "isSuperUser",
      "isBanned",
      "active",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: UserProfile,
        attributes: [
          "name",
          "lastName",
          "poste",
          "phone",
          "address",
          "hireDate",
        ],
      },
    ],
  });
  // console.log(users);
  const simplifiedUsers = users.map((user) => {
    const {
      id,
      email,
      role,
      isSuperUser,
      createdAt,
      updatedAt,
      isBanned,
      active,
    } = user.toJSON();
    const userProfile = user.UserProfile ? user.UserProfile.toJSON() : null;
    const { name, lastName, poste, phone, address, hireDate } =
      userProfile || "";
    return {
      id,
      email,
      role,
      isSuperUser,
      createdAt,
      updatedAt,
      name,
      lastName,
      isBanned,
      active,
      poste,
      phone,
      address,
      hireDate,
    };
  });

  return res.json({ users: simplifiedUsers });
});

export const getPotentielProjectManager = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      isBanned: false,
      [Op.or]: [{ role: SUPERUSER_ROLE }, { role: PROJECT_MANAGER_ROLE }],
    },
    attributes: ["id", "email"],
    include: [
      {
        model: UserProfile,
        attributes: ["name", "lastName", "image", "poste"],
      },
    ],
  });
  // console.log(users);
  const simplifiedUsers = users.map((user) => {
    const { id, email } = user.toJSON();
    const userProfile = user.UserProfile ? user.UserProfile.toJSON() : null;
    const { name, lastName, image, poste } = userProfile || "";
    return {
      id,
      email,
      lastName,
      name,
      image,
      poste,
    };
  });

  return res.json({ users: simplifiedUsers });
});

export const getPotentielIntervenants = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const simplifiedUsers = await projectPotentialIntervenants(projectID);
  return res.json({ users: simplifiedUsers });
});

export const projectPotentialIntervenants = async (projectID) => {
  const objectQuery = {
    isBanned: false,
    role: { [Op.ne]: CLIENT_ROLE },
  };
  const existingIntervenants = await Intervenant.findAll({
    where: { projectID: projectID, intervenantID: { [Op.not]: null } },
    attributes: ["intervenantID"],
  });

  if (existingIntervenants) {
    let list = [];
    existingIntervenants.forEach((inter) => {
      list.push(inter.intervenantID);
    });
    objectQuery.id = {
      [Op.notIn]: list,
    };
  }

  const users = await User.findAll({
    where: objectQuery,
    attributes: ["id", "email"],
    include: [
      {
        model: UserProfile,
        attributes: ["name", "lastName", "image", "poste"],
      },
    ],
  });
  const simplifiedUsers = users.map((user) => {
    const { id, email } = user.toJSON();
    const userProfile = user.UserProfile ? user.UserProfile.toJSON() : null;
    const { name, lastName, image, poste } = userProfile || "";
    return {
      id,
      email,
      lastName,
      name,
      image,
      poste,
    };
  });

  return simplifiedUsers;
};

export const addUser = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data || !data.account) {
    logger.error("there is no data in the request: ADMIN REQUESTED");
    return res
      .status(500)
      .json({ message: messages.something_went_wrong});
  }

  const newUser = data.account;

  const isUserExist = await getUserByEmail(newUser.email);
  if (isUserExist) {
    logger.error(`a user with the email " ${newUser.email} " already exists`);
    return res.status(403).json({ message: "utilisateur déjà existant" });
    // next(new AppError("user already exists", 403));
  }
  // password encryption
  if (newUser.password) {
    const encrypted = await encryptPassword(newUser.password);
    newUser.password = encrypted;
  } else {
    //generate authentication token
    const token = await createPasswordSetToken();

    newUser.token = token;
  }
  //check role

  newUser.isSuperUser = newUser.role === SUPERUSER_ROLE;

  const user = await User.create({ ...newUser });
  if (!user)
    return next(
      new AppError("quelque chose n'a pas fonctionné when creation", 500)
    );

  // const { dataValues: user } = isUserCreated;

  logger.info(`user ${user.id} created successfully`);

  //creating a profile for the user created

  let userProfile;
  if (Object.keys(data?.profile).length) {
    userProfile = await createUserProfile(data.profile, user, next);
    if (!userProfile)
      return next(
        new AppError("Something wrong with the profile creation", 500)
      );
    logger.info(`userProfile ${userProfile.id} created successfully`);
  }
  if (user.token) {
    logger.info(`sending email confirmation for user ${user.id}`);
    const url = `http://${config.lms_host}/auth/account/confirmation/${user.token}`;
    try {
      await send({
        template: "account_verification_token",
        to: user.email,
        subject: `Account Verification Link (valid for ${
          config.verify_token_expires_in / 60000
        } min)`,
        args: { url },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const createdUSer = serializeUser(user);
  if (userProfile) {
    createdUSer.id = user.id;
    createdUSer.name = userProfile.name;
    createdUSer.lastName = userProfile.lastName;
  }

  return res
    .status(200)
    .json({ message: "utilisateur créé avec succès", createdUSer });
});

export const createUserProfile = async (info, user, next) => {
  if (!user || !info) return null;
  const isNameLastNameExists = await UserProfile.findOne({
    where: { name: info.name, lastName: info.lastName },
  });
  if (isNameLastNameExists) {
    await user.destroy();
    return next(
      new AppError("Un utilisateur existant a le même nom et prénom")
    );
  }
  const profile = serializeProfile(info, user.id);
  //  check if name and lastName exists together
  if (!profile) return null;
  const newProfile = await UserProfile.create({ ...profile });

  if (!newProfile) return null;

  return newProfile.dataValues;
};

export const getUserInfo = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("un email doit être fourni", 500));

  const user = await getUserByEmail(email);
  if (!user) {
    const msg = `il n'y a pas d'utilisateur détenant cet email : ${email} `;
    logger.error(msg);
    return next(new ElementNotFound(msg));
  }

  return res.status(200).json({
    status: "success",
    user: serializeUser(user),
    profile: serializeProfile(user.UserProfile),
  });
});

/*
 *  get user By id : return the user if found or null
 * @param {*} id
 * @returns
 */
export const getUserByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return null;
  const queryOptions = {
    where: { id : id }
  };

  // Conditionally include the UserProfile relation based on includeProfile parameter
    queryOptions.include = UserProfile;

  const user = await User.findOne(queryOptions);
  if (!user) return null;
  return res.status(200).json({
    status: "success",
    user: serializeUser(user),
    profile: serializeProfile(user.UserProfile),
  });
});

/**
 update user profile : accepts all the fields of the user
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  // const { userId } = req.params;

  const newProfile = req.body;

  const user = await User.findOne({
    where: { email: newProfile.email || req.user.email },
  });
  if (!user) {
    const errorMsg = `the user : ${newProfile.email} is not found`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }

  const userProfile = await UserProfile.findOne({ where: { userId: user.id } });
  if (!userProfile) {
    const errorMsg = `le profile de l'utlisateur ${newProfile.email} est introuvable`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }
  await userProfile.update({ ...newProfile });
  await userProfile.save();
  return res.status(200).json({
    status: "success",
    message: "le profil de l'utilisateur a été mis à jour avec succès",
  });
});
/**
 update user image  : this is a standalone api  to lighten up the request
 */
export const updateProfileImage = catchAsync(async (req, res, next) => {
  if (!req.user.isSuperUser) {
    if (req.body.email !== req.user.email) return next(new UnauthorizedError());
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    const errorMsg = `l'utlisateur : ${req.body.email} est inrouvable`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }
  const userProfile = await UserProfile.findOne({ where: { userId: user.id } });
  if (!userProfile) {
    const errorMsg = `le  profile de l'utilisateur ${newProfile.email} est inrouvable`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }
  let url;
  // console.log(req.file,req.files);
  if (!req.files[0])
    return next(new AppError("aucun fichier n'a été fourni", 500));

  // console.log("request file size",req.file.size,"is above 5mo",req.file.size > 5 * 1024 * 1024);

  if (req.files[0].size > 5 * 1024 * 1024)
    return next(new AppError("le fichier dépasse la limite de 5MB", 400));
  if (
    req.files[0].mimetype !== "image/jpeg" &&
    req.files[0].mimetype !== "image/png"
  ) {
    removeTmp(req.file.tempFilePath);
    return res.status(400).json({ msg: "Le format du fichier est incorrect." });
  }
  url = createMediaUrl(req.files[0]);
  userProfile.image = url;
  userProfile.save();
  return res.status(200).json({
    status: "success",
    message: "l'image de profil a été mise à jour avec succès",
    url,
  });
});

export const authenticateUserWithToken = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) return next(new ElementNotFound("Le jeton n'a pas été fo"));
  //check if  token is valid : 16 bytes and HEX format
  const isValidToken = /^[a-zA-Z0-9+/]+={0,2}$/.test(token);

  if (!isValidToken)
    return next(new MalformedObjectId("le jeton est peut-être mal formé "));

  //we need to decrypt the public token to match the private token

  const user = await User.findOne({
    where: {
      token: token,
      active: false,
      isBanned: false,
      password: null,
    },
  });

  if (!user) return next(new ElementNotFound("aucun utilisateur de ce type"));
  //validate the token and erase it
  res
    .status(200)
    .json({ message: "jeton validé : Bienvenue", email: user.email });
});

/**
 * this api is to change the user role
 * accepts  email and role
 */
export const changeUserRole = catchAsync(async (req, res, next) => {
  const { email, role } = req.body;
  if ((!email, !role))
    return next(
      new MissingParameter(
        "l'adresse électronique et le rôle sont obligatoires"
      )
    );
  //check if role exists : for now the list of roles is hardcode in server/constant
  if (
    ![
      SUPERUSER_ROLE,
      INTERVENANT_ROLE,
      PROJECT_MANAGER_ROLE,
      CLIENT_ROLE,
    ].includes(role)
  )
    return next(new ElementNotFound("le rôle n'existent pas"));

  const user = await getUserByEmail(email);
  if (!user) return next(new ElementNotFound("Utilisateur non trouvé"));

  if (role === SUPERUSER_ROLE) {
    user.isSuperUser = true;
  } else {
    user.isSuperUser = false;
  }
  user.role = role;

  user.save();

  return res.status(200).json({
    status: "success",
    message: messages["user_role_updated_successfully"],
  });
});

/**
 * ban user api : this api will deactivate the user if it's active  otherwise a  404 will returned
 * if the user is not found  || the user is already banned
 */
export const banUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new MissingParameter("L'e-mail est obligatoire"));

  const user = await getUserByEmail(email, false, false);
  if (!user) return next(new ElementNotFound(messages["user_not_found"]));
  user.isBanned = true;
  user.save();

  return res
    .status(200)
    .json({ state: "success", message: `l'utilisateur ${email} a été banni` });
});

/**
 * un ban user api : this api will activate the user if it's banned otherwise a  404 will returned
 * if the user is not found  || the user is already active
 */
export const unBanUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new MissingParameter("L'e-mail est obligatoire"));

  const user = await getUserByEmail(email, false, true);
  if (!user)
    return next(new ElementNotFound("Utilisateur introuvable ou déjà banni"));
  user.isBanned = false;
  user.save();

  return res.status(200).json({
    state: "success",
    message: `l'utilisateur ${email} a été débanni`,
  });
});
