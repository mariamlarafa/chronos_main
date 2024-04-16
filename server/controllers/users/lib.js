import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getRSAPublicKey } from "../../Utils/utils.js";
import { User, UserProfile } from "../../db/relations.js";
import { config } from "../../environment.config.js";
import { PROJECT_MANAGER_ROLE, SUPERUSER_ROLE } from "../../constants/constants.js";

//static routes

// const currentFilePath = new URL(import.meta.url).pathname;

export const encryptPassword = async (password) => {
  const hashed = await bcrypt.hash(
    password,
    parseInt(config.salt_rounds_bcrypt)
  );
  return hashed;
};

export const serializeUser = (user) => {
  return {
    email: user.email,
    role: user.role,
    isSuperUser: user.isSuperUser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};


export const serializeSimpleUserObject = (user)=>{
  let fullName =""
  if (user?.UserProfile.name)
    fullName+=user?.UserProfile.name
  if (user?.UserProfile.lastName)
    fullName+=` ${user?.UserProfile.lastName}`


   return {
    email: user.email,
    image:user?.UserProfile?.image,
    fullName
   }
}


export const serializeProfile = (userInfo, userId) => {
  return {
    name: userInfo.name,
    lastName: userInfo.lastName,
    poste: userInfo.poste,
    phone: userInfo.phone,
    image: userInfo.image,
    address:userInfo.address?userInfo.address:"",
    // city: userInfo.city ? userInfo.city : "",
    // street: userInfo.street ? userInfo.street : "",
    // region: userInfo.region ? userInfo.region : "",

    hireDate: userInfo.hireDate,
    userID: userId
  };
};

export const generateToken = async (userID) => {
  return jwt.sign({ userID }, config.jwt_secret, {
    expiresIn: config.jwt_expires_in
  });
};

export const createPasswordSetToken = async () => {
  /* @ DESC:: creating to double edge tokens one to send  and one to save
   */
  //accessing the key pairs
  const publicKey = await getRSAPublicKey();
  //creating  a random bytes to  generate send token
  const tokenToSend = crypto.randomBytes(32).toString("hex");

  // Encrypt the token ,using the public key (for tokenToSave)
  const encryptedToken = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    tokenToSend
  );

  // Convert the encrypted token to a hexadecimal string
  const tokenToSave = encryptedToken.toString("hex");

  // const passwords = { tokenToSend, tokenToSave };
  return tokenToSave.substring(0, 128);
};

/**
 * returns the user by email
 */

/*
 *  get user By id : return the user if found or null
 * @param {*} id
 * @returns
 */
export const getUserByEmail = async (
  email,
  includeProfile = true,
  withBanned = false
) => {
  if (!email) return null;

  const queryOptions = {
    where: { email: email, isBanned: withBanned }
  };

  // Conditionally include the UserProfile relation based on includeProfile parameter
  if (includeProfile) {
    queryOptions.include = UserProfile;
  }

  const user = await User.findOne(queryOptions);

  if (user) return user;

  return null;
};


/**
 * this will detemrine if the user is either a superuser or project Manager
 */
export function  isUserManagement (user){
    return ((user.isSuperUser && user.role === SUPERUSER_ROLE )|| user.role === PROJECT_MANAGER_ROLE) ;
}