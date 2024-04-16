import "../db/relations.js";

import moment from "moment";
import {
  Intervenant,
  Lot,
  Project,
  ProjectLots,
  Task,
  User,
  UserProfile
} from "../db/relations.js";
// prettier-ignore
// import userDb from "./users.db.json"  with { type: "json" };
import {
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE,
  STATE_ABANDONED,
  STATE_BLOCKED,
  STATE_DOING,
  STATE_DONE
} from "../constants/constants.js";
import {
  encryptPassword,
  getUserByEmail,
  serializeProfile
} from "../controllers/users/lib.js";
import { config } from "../environment.config.js";

import { readFile } from "fs/promises";

import Leave from "../models/Leave.js";
var db = [];
var userDb = [];

function getTableByName(tableName) {
  return db.filter(
    (table) => table.name.toLowerCase() === tableName && table.type === "table"
  )[0];
}

function resetTime(dateString) {
  if (dateString) {
    return moment(dateString).startOf("day").toDate();
  }
  return null;
}

function extractProjectCode(orgCode) {
  if (orgCode.length < 5) return orgCode;
  return orgCode.slice(0, orgCode.length - 1);
}

function determineProjectState(state) {
  if (!state) return 1;
  switch (parseInt(state)) {
    case 1:
      return STATE_DOING;
    case 2:
      return STATE_DONE;
    case 3:
      return STATE_ABANDONED;
    default:
      return STATE_DOING;
  }
}

function determineIfCodeCustomized(code, customID) {
  let codePortion = customID.split("-")[0];
  if (codePortion !== code) {
    return true;
  }
  return false;
}

async function runLotMigration(createdProjectsList, verbose) {
  if (verbose) {
    console.info("Projects created now creating the projectLots list");
  }
  try {
    const projectsTable = getTableByName("projet");
    let listToBulk = [];
    for (const idx in projectsTable.data) {
      let project = projectsTable.data[idx];
      if (project.lots) {
        let lots = project.lots.split(";");
        let createdProject = createdProjectsList.filter(
          (p) =>
            p.customId === project.designation.replace("-", "_") &&
            p.code === extractProjectCode(project.code)
        )[0];

        for (const lIdx in lots) {
          let lotData = await Lot.findOne({
            where: { name: lots[lIdx] }
          });
          listToBulk.push({
            projectID: createdProject.id,
            lotID: lotData?.id
          });
        }
      }
    }

    await ProjectLots.bulkCreate(listToBulk);
    // console.log("lots list to created",listToBulk);
  } catch (error) {
    console.error(`migration lots failed: ${error}`);
  }
}

function determineTaskState(status) {
  switch (parseInt(status)) {
    case 1:
      return STATE_DOING;
    case 2:
      return STATE_DONE;
    case 3:
      return STATE_BLOCKED;
    case 4:
      return STATE_DONE;
    default:
      return STATE_ABANDONED;
  }
}
async function runTaskMigration(createdProjectList, verbose) {
  try {
    let taskTable = getTableByName("tacheprojet").data;
    let projectTable = getTableByName("projet").data;
    //gather all the tasks of that project
    let tasksBulk=[]


    for (const idx in createdProjectList) {
      const createdProject = createdProjectList[idx];
      const originalProjectId = projectTable.filter(
        (p) =>
          p.designation.replace("-", "_") === createdProject.customId &&
          extractProjectCode(p.code) === createdProject.code
      )[0]?.Oid;

      let projectTasks = taskTable.filter(
        (task) => task.projet === originalProjectId
      );

      for (const tIdx in projectTasks){
      let taskEntry = projectTasks[tIdx];
      let task = {
        name: taskEntry.libelle,
        startDate: resetTime(taskEntry.datesDebut),
        dueDate: resetTime(taskEntry.datesEcheance),
        blockedDate:
          parseInt(taskEntry.etatTache) === 4
            ? resetTime(taskEntry.datesFin)
            : null,
        doneDate:
          determineTaskState(taskEntry.etatTache) === STATE_DONE
            ? resetTime(taskEntry.datesFin)
            : null,
        isVerified: parseInt(taskEntry.etatTache) === 2 ? true : false,
        totalHours: 0,
        state: determineTaskState(taskEntry.etatTache),
        meta:JSON.stringify({
          projectID: createdProject.id,
        taskID: taskEntry.Oid,
        intervenantID: await searchForUserId(taskEntry.utilisateur, null)
        })
      };
      tasksBulk.push(task);

    }

  }
  let intervenantBulk =[]
  const createdTasks = await Task.bulkCreate(tasksBulk)
  for (const ctIdx in createdTasks){
    let task = createdTasks[ctIdx]
    let intervenant = JSON.parse(task.meta)
    intervenant.taskID =  task.id
    intervenantBulk.push(intervenant)

  }
    await Intervenant.bulkCreate(intervenantBulk)
    return;
  } catch (error) {
    console.error(`migration task failed: ${error}`);
  }
}

async function searchForUserId(userUUID, defaultID) {
  try {
    if (!userUUID) return defaultID;
    const userTable = getTableByName("utilisateur")?.data;
    // finding the user with uuid
    const user = userTable.filter((entry) => entry.Oid === userUUID)[0];
    if (!user?.email) return defaultID;

    const searched = await getUserByEmail(user?.email);
    if (!searched) return defaultID;
    return searched.id;
  } catch (error) {
    console.error(`we couldn't identify the user id because f  ${error}`);
    return defaultID;
  }
}

async function runProjectsMigration(verbose) {
  try {
    if (!verbose) {
      console.info("this script will be running silently");
    }

    const projectsTable = getTableByName("projet");

    const admin = await User.findOne({ where: { email: config.admin_email } }); //
    let instance = {};
    let manager = null;
    let projectsList = [];
    let prevPhaseList = [];
    for (const idx in projectsTable?.data) {
      let project = projectsTable?.data[idx];

      manager = await searchForUserId(project.utilisateur, admin.id);
      instance = {
        code: extractProjectCode(project.code),
        customId: project.designation.replace("-", "_"),
        name: project.libelle,
        startDate: resetTime(project.datesDebut),
        dueDate: resetTime(project.datesFin),
        priority: 1, //TODO: figure out which column represents the priority
        createdBy: admin.id,
        manager: manager,
        managerHours: 0,
        state: determineProjectState(project.etatProjet),
        phaseID: parseInt(project.natureProjet) + 1,

        isCodeCustomized: determineIfCodeCustomized(
          project.code,
          project.designation
        )
      };
      // let projectInstance = Project.build({...instance})

      if (project.phaseP) {
        const prevPhaseInfo = projectsTable?.data.filter(
          (p) => p.Oid === project.phaseP
        )[0];
        let obj = {
          code: extractProjectCode(prevPhaseInfo.code),
          customId: prevPhaseInfo.designation.replace("-", "_")
        };
        instance.prevPhaseTmp = JSON.stringify(obj);
        prevPhaseList.push({ project: project.Oid, phaseP: project.phaseP });
      }
      projectsList.push({ ...instance });
    }
    // BULK creation
    const createdList = await Project.bulkCreate(projectsList);
    // console.log(createdList,"createdList");

    //Previous Phase CODE will be handled as a hook in the model instance
    runLotMigration(createdList, verbose);
    //running TASK migrations along side the intervenant migration

    runTaskMigration(createdList, verbose);

    console.info("Migration finished successfully");
  } catch (error) {
    console.log(`migration projects failed: ${error}`);
  }
}

// USER MIGRATION SECTION
function determineUserRole(entryRole) {
  if (!entryRole) return INTERVENANT_ROLE;
  switch (entryRole) {
    case "Chef de projet":
      return PROJECT_MANAGER_ROLE;
    case "intervenant":
      return INTERVENANT_ROLE;
    case "Administrateur":
      return SUPERUSER_ROLE;
    default:
      return INTERVENANT_ROLE;
  }
}

async function creatingUserProfile(user, userInfo, verbose) {
  if (verbose) {
    console.info(`creating the user  ${user.email} profile`);
  }
  try {
    //search the user name and last to determine the user exists already
    const isNameLastNameExists = await UserProfile.findOne({
      where: { name: userInfo.name, lastName: userInfo.lastName }
    });

    if (isNameLastNameExists) {
      await user.destroy();
      if (verbose) {
        console.info(
          `${user.email} destroyed because the user ${userInfo.name} and ${userInfo.lastName} exists}`
        );
      }
      return;
    }
    //serializing the data : getting ready for inserting
    const profile = serializeProfile(userInfo, user.id);
    if (!profile) {
      console.error(`something went wrong: in serialization profile`);
    }
    //creating the profile
    const newProfile = await UserProfile.create({ ...profile });
    if (verbose) {
      console.info(`profile created for user ${user.email}`);
    }

    return newProfile.dataValues;
  } catch (error) {
    console.error(`creating user profile failed: ${error}`);
    return;
  }
}

async function runUserMMigration(verbose) {
  try {
    let entry = {};

    for (const idx in userDb) {
      entry = userDb[idx];
      const user = await getUserByEmail(entry.email);
      if (user) {
        if (verbose) {
          console.info(`skipping the user: ${user.email}: already exists`);
        }
        continue;
      }
      //check for password
      if (verbose) {
        console.info(
          `the user ${entry.email} doesn't exist we will proceed with the migration`
        );
        console.info("encrypting password");
      }
      let encryptedPassword = await encryptPassword(
        !entry.password ? config.defaultPassword : entry.password
      );

      let newUser = {
        ...entry,
        password: encryptedPassword,
        role: determineUserRole(entry.role),
        isSuperUser: entry.role === "Administrateur" ? true : false,
        active: true
      };
      const createdUser = await User.create({ ...newUser });
      if (verbose) {
        console.info(`the user ${createdUser.email} created successfully`);
      }

      creatingUserProfile(createdUser, entry, verbose);

      console.log("User migrated successfully");
    }
  } catch (error) {
    console.error(`user migration failed: ${error}`);
  }
}

async function importJSON(filePath) {
  try {
    const jsonData = await readFile(filePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(
      `Error importing JSON file from ${filePath}: ${error.message}`
    );
    throw error;
  }
}

// console.info(process.argv[3]);
const switcher = process.argv[3];
const filePath = process.argv[4];

const verboseOptionIndex = process.argv.indexOf("--verbose");
const helpOptionIndex = process.argv.indexOf("--help");

// console.log(switcher)

if (helpOptionIndex !== -1) {
  console.log("welcome to the migration script");
  console.log(
    "Usage: npm run migrate-data-v2 [db|users] file path -- [--verbose]"
  );
} else {
  switch (switcher) {
    case "db":
      if (filePath && filePath !== "--") {
        try {
          const data = await importJSON(filePath);
          //setting the database to db variable for general access
          db = data;
          console.log(`Running projects migration `);
          runProjectsMigration(verboseOptionIndex !== -1 ? true : false);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("File doesn't exist");
      }
      break;
    case "users":
      try {
        const data = await importJSON(filePath);
        //setting the database to db variable for general access
        userDb = data;
        console.log(`Running users migration`);
        runUserMMigration(verboseOptionIndex !== -1 ? true : false);
      } catch (error) {
        console.error(error);
      }

      break;
    default:
      console.error("invalid action ");
  }


  async function runLeaveMigration(verbose) {
    try {
      const leaveData = await importJSON(filePath); // Assuming leave data is provided in a JSON file
  
      if (verbose) {
        console.info("Migrating leave data...");
      }
  
      // Process leave data and insert into the database
      await Leave.bulkCreate(leaveData);
  
      if (verbose) {
        console.info("Leave data migrated successfully");
      }
    } catch (error) {
      console.error(`Leave migration failed: ${error}`);
    }
  }
  
  // Modify the CLI switch statement to include leave migration option
  switch (switcher) {
    case "db":
      if (filePath && filePath !== "--") {
        try {
          const data = await importJSON(filePath);
          db = data;
          console.log(`Running projects migration`);
          runProjectsMigration(verboseOptionIndex !== -1 ? true : false);
          
          // Call leave migration function after project migration
          console.log(`Running leave migration`);
          runLeaveMigration(verboseOptionIndex !== -1 ? true : false);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("File doesn't exist");
      }
      break;
    case "users":
      try {
        const data = await importJSON(filePath);
        userDb = data;
        console.log(`Running users migration`);
        runUserMMigration(verboseOptionIndex !== -1 ? true : false);
      } catch (error) {
        console.error(error);
      }
  
      break;
    case "leave": // Add leave migration case
      try {
        const data = await importJSON(filePath);
        console.log(`Running leave migration`);
        runLeaveMigration(verboseOptionIndex !== -1 ? true : false);
      } catch (error) {
        console.error(error);
      }
      break;
    default:
      console.error("Invalid action");
  }

}
