import moment from "moment";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter,
  UnknownError
} from "../../../Utils/appError.js";
import { catchAsync } from "../../../Utils/catchAsync.js";
import {
  PROJECT_MANAGER_ROLE,
  PROJECT_PHASE_STATUS_IN_PROGRESS,
  SUPERUSER_ROLE
} from "../../../constants/constants.js";
import {
  Lot,
  Phase,
  ProjectLots,
  Task,
  User,
  UserProfile
} from "../../../db/relations.js";
import logger from "../../../log/config.js";
import Project from "../../../models/project/Project.model.js";
import {
  calculateDates,
  generateProjectCustomID,
  isCodeValid,
  serializeProject
} from "./../lib.js";
import { isLotsValid } from "./../lot.controller.js";
import { getPhaseByName } from "./../phase.controller.js";
import Intervenant from "../../../models/tasks/Intervenant.model.js";
import { Op } from "sequelize";

/**
 * Get all the project that exists and in which phase is the project in
 *
 */
export const getAllProjects = catchAsync(async (req, res, next) => {
  let projects = [];
  const objectQuery = {};
  if (req.user.role === PROJECT_MANAGER_ROLE) {
    // objectQuery.manager = req.user.id;
    objectQuery[Op.or] = [{ manager: req.user.id }];
  }
  if (
    req.user.role === PROJECT_MANAGER_ROLE ||
    (req.user.role !== SUPERUSER_ROLE && !req.user.isSuperUser)
  ) {
    let interventions = await Intervenant.findAll({
      where: { intervenantID: req.user.id },
      attributes: ["projectID"]
    });
    let projectIds = [];
    interventions.forEach((project) => {
      projectIds.push({ id: project.projectID });
    });

    if (objectQuery[Op.or]) {
      projectIds.forEach((ids) => {
        objectQuery[Op.or].push(ids);
      });
      // objectQuery[Op.or].push(projectIds)
    } else {
      objectQuery[Op.or] = projectIds;
    }
  }



  projects = await Project.findAll({
    where: objectQuery,
    include: [
      {
        model: ProjectLots,
        include: [Lot]
      },
      {
        model: User,
        as: 'managerDetails',
        attributes: ['email'],
        include: [
          {
            model: UserProfile,
            attributes: ['image', 'name', 'lastName']
          }
        ]
      },
      {
        model: Phase
      }
    ],
  });

  // console.log(projects[0].phase);
  const projectsList = serializeProject(projects);
  projectsList.sort((a, b) => b.code - a.code);

  const dates =  calculateDates(2)
  let tasks=[]
 for (const projIdx in projectsList){
      let projectTasks= await Task.findAll({
        attributes:["id","name","name","startDate","dueDate"],
        include:[{
          model:Intervenant,
          attributes:["id"],
          where:{
            projectID:projectsList[projIdx].id
          }
        }
        ]
      })
      console.log("project id is ",projectsList[projIdx].id," project tasks are ",projectTasks)
      if (projectTasks){
        tasks.push({
          projectID:projectsList[projIdx].id,
          tasks:projectTasks
        })
      }

  }

  res.status(200).json({ status: "success", projects: projectsList , dates:dates , tasks:tasks});
});

/**
 * add a project
 */
export const addProject = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data.name || !data.startDate || !data.manager || !data.code)
    return next(
      new MissingParameter("name or start date or manager or code is missing")
    );
  // checking the code:

  if (data.code.toString().length !== 5)
    return next(new MalformedObjectId("code is not valid"));

  const isValidCode = await isCodeValid(data.code, data.phase);

  if (!isValidCode)
    return next(
      new MalformedObjectId(
        "Project already exists with that code: did you mean to create a phase?"
      )
    );

  // const projectNameValid = await Project.findOne({
  //   where: { name: data.name }
  // });
  // console.log("SEARCHED PROJECT WITH SIM NAME ", projectNameValid);
  // if (projectNameValid)
  //   return next(new MalformedObjectId("Project already exists with that name"));

  if (!data.phase || !data.lot.length)
    return next(new MalformedObjectId("lots and phase are mandatory"));

  // create pure project instance to use
  let project = { ...data };

  project.createdBy = req.user.id;
  project.overAllStatus = PROJECT_PHASE_STATUS_IN_PROGRESS;

  delete project.phase;
  delete project.lot;
  delete project.linked;

  // check for phase:
  const phase = await getPhaseByName(data.phase);

  if (!phase) return next(new ElementNotFound("we couldn't find phase"));

  project.phaseID = phase.id;

  // generating a custom id for the project to use
  const customID = generateProjectCustomID(
    project.code,
    project.name,
    phase.abbreviation
  );
  try {
    const newProject = await Project.create({ ...project, customId: customID });

    // const projectLot = await createProjectLot(newProject.id, data.lot);
    const isAllLotsValid = await isLotsValid(data.lot);
    if (!isAllLotsValid) {
      return next(new ElementNotFound("we couldn't find all the lots"));
    }

    for (const lotID in isAllLotsValid) {
      const isProjectLotExists = await ProjectLots.findOne({
        where: {
          projectID: newProject.id,
          lotID: lotID
        }
      });
      if (!isProjectLotExists) {
        await ProjectLots.create({
          projectID: newProject.id,
          lotID: isAllLotsValid[lotID]
        });
      }
    }
    return res.status(200).json({
      status: "success",
      message: "project created successfully",
      projectPhase: newProject
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    // await transaction.rollback();
    return next(new UnknownError("Internal server error "));
  }
});

export const updateProjectDetails = catchAsync(async (req, res, next) => {
  const details = req.body;
  console.log(details);
  if (!details || !Object.keys(details).length)
    return next(new MissingParameter("Des paramètres manquants"));
  let phase;
  if (details.phase || details.code) {
    const objectQuery = {
      // id:req.params.projectID
    };
    if (details.phase) {
      phase = await Phase.findOne({ where: { name: details.phase } });
      objectQuery.phaseID = phase.id;
    }
    if (details.code) {
      objectQuery.code = details.code;
    }
    const projectWithPhase = await Project.findOne({ where: objectQuery  });

    if (projectWithPhase)
      return next(
        new AppError("un projet avec ce code et cette phase existe déjà", 403)
      );
  }

  const project = await Project.findByPk(req.params.projectID,{include:[Phase]});
  console.log("----------- project details",project.phase.abbreviation);
  if (!project) return next(new ElementNotFound("Projet introuvable"));
  logger.info("attempting to update the project info");
  if (details.code && details.code.toString()?.length !== 5)
    return next(
      new AppError("le code du projet doit contenir 5 caractères", 401)
    );

  if (details.phase) {
    details.phaseID = phase.id;
  }


  details.customId = generateProjectCustomID(
    details.code || project.code,
    details.name || project.name,
    phase?.abbreviation || project.phase.abbreviation

  );

  if (details.startDate)
    details.startDate = moment(details.startDate, "DD/MM/YYYY");

  await project.update({ ...details });

  const queryObjectPL = {};
  queryObjectPL.projectID = req.params.projectID;

  // creation of new projects lots
  for (const lotIdx in details.lots) {
    const lt = await Lot.findOne({ where: { name: details.lots[lotIdx] } });
    queryObjectPL.lotID = lt.id;

    const [lot, created] = await ProjectLots.findOrCreate({
      // where:  { lotID: lt.id, projectID: req.params.projectID }})
      where: queryObjectPL
    });
  }

  // destruction of existing  projects lots
  // if (!phase) {
  const projectLots = await ProjectLots.findAll({
    where: { projectID: req.params.projectID },
    attributes: ["lotID", "projectID"],
    include: [
      {
        model: Lot,
        attributes: ["name"]
      }
    ]
  });
  projectLots.forEach(async (pl) => {
    if (!details.lots.includes(pl.lot.name)) {
      await pl.destroy();
    }
  });
  // }

  return res.status(200).json({
    status: "success",
    message: "Les détails des projets ont été mis à jour"
  });
});

export const generateProjectCode = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const date = new Date();
  const currentYear = date.getFullYear();

  if (currentYear.toString().length !== 4)
    return next(new UnknownError("quelque chose n'a pas fonctionné"));
  var code = undefined;
  if (type !== "old") {
    const latestProjectCode = await Project.max("code");
    if (!latestProjectCode) {
      code = (parseInt(currentYear) % 1000) * 1000;
    } else {
      code = latestProjectCode + 1;
    }
  }
  //get the latest project code which is not customized

  //projects List

  const projectList = await Project.findAll({
    attributes: ["id", "code", "name", "customId"]
  });

  // convert projects List :
  projectList.forEach((project) => {
    project.code = project.code.toString();
  });

  return res.status(200).json({
    status: "success",
    validCode: code,
    existantProjects: projectList
  });
});

export const checkProjectCode = catchAsync(async (req, res, next) => {
  const code = req.body.code;

  if (!code) return next(new MissingParameter("code is mandatory parameter"));

  if (`${code}`.length !== 5)
    return res.status(400).json({
      status: "failed",
      message: "code is not valid",
      isValid: false,
      code
    });

  return res
    .status(200)
    .json({ status: "succuss", message: "code is valid", isValid: true, code });
});

// export const changeProjectPhase = catchAsync(async (req, res, next) => {
//   const customID = req.params.custom_name;

//   if (!customID || !req.body.phase)
//     return next(
//       new MissingParameter("project custom ID and phase name is mandatory")
//     );
//   const project = await Project.findOne({
//     where: { customID: customID },
//   });
//   // console.log(project.projectPhases);
//   if (!project)
//     return next(new ElementNotFound("there is no project with this custom id"));

//   const phaseAbb = await Phase.findOne({ where: { name: req.body.phase } });

//   if (!phaseAbb)
//     return next(new ElementNotFound("there is no phase with this name"));

//   const projectPhase = await getProjectPhaseFromOldPhases(
//     project.projectPhases,
//     phaseAbb
//   );
//   if (projectPhase < 0) {
//     // await ProjectPhase.create({
//     //   activePhase: true,
//     //   phaseID: phaseAbb.id,
//     //   projectID: project.id
//     // });
//     //deactivate other phases
//     project.projectPhases.forEach((element) => {
//       element.activePhase = false;
//       element.save();
//     });

//     //updating customID
//     project.customId = generateProjectCustomID(
//       project.code,
//       project.name,
//       phaseAbb.abbreviation
//     );
//     project.save();

//     return res.status(200).json({
//       success: "success",
//       message: `project is now in phase ${phaseAbb.name}`,
//       created: true,
//       updated: false
//     });
//   }
//   logger.info("checking if the provided phase is the same as the current one");
//   if (project.projectPhases[projectPhase].activePhase == true) {
//     logger.info("nothing to do the provided phase is already active");
//     return next(new NothingChanged("Phase is already active"));
//   }

//   logger.info(
//     "setting the new phase that already exist  to  active and disabling the other ones"
//   );
//   //update project to old phases
//   project.projectPhases[projectPhase].activePhase = true;
//   project.projectPhases[projectPhase].save();
//   //deactivate other phases
//   project.projectPhases.forEach(async (element) => {
//     if (element.phaseID !== phaseAbb.id) {
//       element.activePhase = false;
//       element.save();
//     }
//   });
//   //updating customID
//   project.customId = generateProjectCustomID(
//     project.code,
//     project.name,
//     phaseAbb.abbreviation
//   );
//   project.save();
//   return res.status(200).json({
//     success: "success",
//     message: `project is now in phase ${phaseAbb.name}`,
//     created: false,
//     updated: true
//   });
// });

export const getProjectsInPhase = catchAsync(async (req, res, next) => {
  const { phase } = req.query;
  if (!phase) return res.status(200).json({ status: "success", projects: [] });
  //verify if phase is exists
  const phaseDetails = await Phase.findOne({ where: { name: phase } });
  if (!phaseDetails)
    return next(new ElementNotFound("phase does't not exists"));
  //get all the projects that are active in that phase
  const projects = await Project.findAll({
    include: [
      {
        // model: ProjectPhase,
        where: { phaseID: phaseDetails.id }
      }
    ]
  });
  if (!projects.length)
    return res.status(200).json({
      status: "info",
      message: `there is no active projects in the phase ${phase}`,
      projects: []
    });

  return res.status(200).json({
    status: "info",
    message: `the list of projects in the ${phase} has been updated`,
    projects
  });
});

export const checkProjectLinking = catchAsync(async (req, res, next) => {
  const nbProjects = await Project.count();

  if (nbProjects > 0)
    return res.status(200).json({ state: "success", isLinkingPossible: true });
  return res.status(200).json({ state: "success", isLinkingPossible: false });
});

export const getProjectById = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;

  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID, {
    include: [
      {
        model: ProjectLots,
        attributes: ["lotID"],
        include: [{ model: Lot, attributes: ["name"] }]
      },
      {
        model: Project,
        attributes: ["name"],
        include: [
          {
            model: Phase,
            attributes: ["name"]
          }
        ]
      },
      {
        model: User,
        as: "managerDetails",
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["name", "lastName", "image"]
          }
        ]
      },
      {
        model: User,
        as: "creatorDetails",
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["name", "lastName", "image"]
          }
        ]
      },
      {
        model: Phase,
        attributes: ["name", "abbreviation"]
      }
    ]
  });

  if (!project) return next(new ElementNotFound(`Project was not found`));

  res.status(200).json({ state: "success", project });
});
