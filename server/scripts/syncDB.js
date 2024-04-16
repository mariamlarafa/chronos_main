import "../db/relations.js";
import excel from "exceljs";
import { Intervenant, Lot, Phase, Project, ProjectLots, Task } from "../db/relations.js";
import {
  STATE_ABANDONED,
  STATE_BLOCKED,
  STATE_DOING,
  STATE_DONE
} from "../constants/constants.js";
import moment from "moment";

const determineProjectState = (stateNB) => {
  switch (stateNB) {
    case 1:
      return STATE_DOING;
    case 2:
      return STATE_DONE;

    default:
      return STATE_ABANDONED;
  }
};
const determineTaskState = (stateNB) => {
  switch (stateNB) {
    case 1:
      return STATE_DOING;

    case 3:
      return STATE_BLOCKED;
    case 4:
      return STATE_DONE;
    case 5:
      return STATE_ABANDONED;

    default:
      return STATE_DOING;
  }
};

const getProjectPhase = async ( code) => {
  const abbrv = code.at(-1);
  if (!abbrv)  return null
  try {

    const phase = await Phase.findOne({ where: { abbreviation: abbrv } });

    return phase?.id;
  } catch (error) {
    console.log(error);
    return 1;
  }
};

const determineProjectPhase = async ( code) => {
  const idPhase = await getProjectPhase( code);

  return idPhase;
};

function resetTime(dateString) {
  if (dateString) {
      return moment(dateString).startOf('day').toDate();
  }
  return null;
}


async function syncDataBaseFromXL(excelFilePath) {
  console.log(`Starting data migration from Excel file: ${excelFilePath}`);

  try {
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    const worksheet = workbook.getWorksheet(1);

    const projects = [];
    //structuring data

    console.log(`Starting data structuring for Excel file: ${excelFilePath}`);
    for (let idx = 2; idx <= worksheet.actualRowCount; idx++) {
      const row = worksheet.getRow(idx);

      // console.log("code :",code);
      const tache = {
        name: row.getCell(33).value,
        startDate: resetTime(row.getCell(31).value),
        dueDate: resetTime(row.getCell(32).value),
        blockedDate: null,
        doneDate: resetTime(row.getCell(37).value),
        isVerified: false,
        totalHours: 0,
        state: determineTaskState(row.getCell(34).value)
      };

      const indexProject = projects
        .map((item) => item.project.code)
        .indexOf(row.getCell(5).value);

      if (indexProject > -1) {
        projects[indexProject].tasks.push(tache);
      } else {
        const phaseID = await determineProjectPhase(
          // row.getCell(8).value,
          row.getCell(5).value
        );
        const entry = {
          project: {
            code:row.getCell(5).value,
            customId: row.getCell(7).value.replace("-", "_"),
            name: row.getCell(6).value,
            startDate: row.getCell(9).value,
            dueDate: row.getCell(10).value,
            priority: row.getCell(14).value,
            createdBy: 2,
            manager: 2,
            managerHours: row.getCell(1).value,
            state: determineProjectState(row.getCell(16).value),
            phaseID: phaseID
          },
          tasks: [tache],
          lots: row.getCell(15).value?row.getCell(15).value.split(";"):[]
        };

        projects.push(entry);
      }
    }
    console.log(`Starting data insertion for Excel file: ${excelFilePath}`);

    // Now, the projects array should be correctly populated therefore it's time to insert
    for (const idx in projects) {
      //create the project
      let data  = { ...projects[idx].project}
      data.code = data.code.slice(0, data.code.length - 1);
      console.log(`creating project ${data.code} and phase ${projects[idx].project.phaseID} `);
      const project = await Project.create({...data});

      // creating projects Lots
      let lot
      for (const lIdx in projects[idx].lots) {
         lot = await Lot.findOne({
          where: { name: projects[idx].lots[lIdx] }
        });
        await ProjectLots.create({
          projectID: project?.id,
          lotID: lot?.id
        });
      }
      console.log(`creating  tasks for project ${projects[idx].project.code}`);

      ; // creating tasks
      console.log(projects[idx].tasks);
      for (const tIdx in projects[idx].tasks) {
        const task = await Task.create({ ...projects[idx].tasks[tIdx] });
        await Intervenant.create({
          projectID: project.id,
          taskID: task.id
        })
      }
    }
    // console.log(projects);
    console.log(`data migration is done  from the inside`)
  } catch (error) {
    console.error("Error during data migration:", error);
  }
}

// Run the data migration with the provided Excel file
const excelFilePath = process.argv[2];
if (excelFilePath) {
  syncDataBaseFromXL(excelFilePath);
  console.log(`data migration is done `)
} else {
  console.error("Please provide the path to the Excel file.");
}
