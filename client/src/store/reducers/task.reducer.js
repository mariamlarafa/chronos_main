import { createSlice } from "@reduxjs/toolkit";
import { DAILY_HOURS_VALUE } from "../../constants/constants";
import {  calculateTotalValuesForChangedItems, getPorjectAndTasksKeys, getUnChangedItems } from "./lib";

const initialState = {
  projectTasks: [],
  taskPotentielIntervenants: [],
  // userDailyTasks:[],
  userPotentialTasks: [],
  userGeneralTasks: [],
  dailyLogDevisions: {
    tasks: {},
    projects: {},
    rest: 0,
  },
  dailyProjectManager: [],
  dailyProjectManagerWithoutOngoingTasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setProjectTask: (state, action) => {
      state.projectTasks = action.payload;
    },
    clearProjectTasks: (state, action) => {
      state.projectTasks = [];
      state.taskPotentielIntervenants = [];
    },
    updateProjectTask: (state, action) => {
      state.projectTasks.push(action.payload);
    },
    setTaskCreationPotentielIntervenants: (state, action) => {
      state.taskPotentielIntervenants = action.payload;
    },
    setUserDailyTasks: (state, action) => {
      state.userGeneralTasks = action.payload.allTasks;
      state.userPotentialTasks = action.payload.joinableTasks;
      // set the initial value of the dailyLog devision
      state.dailyProjectManager = action.payload.dailyProjectManager;
      state.dailyProjectManagerWithoutOngoingTasks =
        action.payload.managedProjectsWithoutOngoingTasks;
      // state.dailyLogDevisions.projects = action.payload.managedProjectHours;

      // we need to check if the user has submitted somehours today or not

      const nbOfEntries =
        action.payload.allTasks.length +
        action.payload.dailyProjectManager.length;

      //sum of total hours between tasks and projects
      const sumTasksHours = action.payload.allTasks.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.nbHours;
        },
        0
      );
      const sumProjectHours = Object.values(
        action.payload.managedProjectHours
      ).reduce((hours, projectHours) => {
        return hours + projectHours;
      }, 0);

      const hours = sumTasksHours + sumProjectHours;

      let empty = true;
      if (hours > 0) {
        empty = false;
      }
      action.payload.allTasks.forEach((task) => {
        let objTVal = {
          value: !empty ? task.nbHours * 60 : DAILY_HOURS_VALUE / nbOfEntries,
          changed: !empty ? true : false,
          projectID: task.projectID,
          taskID: task.taskID,
        };
        state.dailyLogDevisions.tasks[task.id] = objTVal;
      });
      Object.keys(action.payload.managedProjectHours).forEach((key) => {
        let objTVal = {
          value: !empty
            ? action.payload.managedProjectHours[key] * 60
            : DAILY_HOURS_VALUE / nbOfEntries,
          changed: !empty ? true : false,
          projectID: key,
        };

        state.dailyLogDevisions.projects[key] = objTVal;
      });
    },
    updateDailyHours: (state, action) => {
      try {
         //extraction of data from payload

      const { id, type, percent } = action.payload;

      const hours = Math.round((percent * DAILY_HOURS_VALUE) / 100);
      let { taskKeys, projectKeys } = getPorjectAndTasksKeys(
        state.dailyLogDevisions.projects,
        state.dailyLogDevisions.tasks,
        type,
        id
      );
      // total of changed values meaining that i'm searching for the list of projects or tasks that have been changed to be  bale to calcule the rest
      let projectsTotalChangedValues = calculateTotalValuesForChangedItems(projectKeys,state.dailyLogDevisions.projects);
      let tasksTotalChangedValues = calculateTotalValuesForChangedItems(taskKeys,state.dailyLogDevisions.tasks);
      // calculating rest
      let rest = DAILY_HOURS_VALUE - (hours + projectsTotalChangedValues + tasksTotalChangedValues);


      const nbOfEntries = projectKeys.length + taskKeys.length; // one them doens't contain the selected line
      // let negativeRest = 0;
      getUnChangedItems(taskKeys,state.dailyLogDevisions.tasks).forEach((key) => {
          state.dailyLogDevisions.tasks[key].value = rest <= 0
            ? 0
            : Math.round(rest / nbOfEntries);
        });
        getUnChangedItems(projectKeys,state.dailyLogDevisions.projects)
        .forEach((key) => {
          state.dailyLogDevisions.projects[key].value = rest <= 0
            ? 0
            : Math.round(rest / nbOfEntries);
        });

      // state.dailyLogDevisions[type][id].changed = hours > 0 ? true : false;
      state.dailyLogDevisions[type][id].changed = true;
      state.dailyLogDevisions[type][id].value = rest <=0 ? hours + rest : hours;
      state.dailyLogDevisions.rest = rest;
      } catch (error) {
          console.log(error);
      }
    },

    hideDailyTask: (state, action) => {
      const task = state.userGeneralTasks.filter(
        (task) => task.id === action.payload.id
      )[0];

      state.userGeneralTasks = state.userGeneralTasks.filter(
        (task) => task.id !== action.payload.id
      );

      state.userPotentialTasks.push(task);
      const oldDailyValue = state.dailyLogDevisions.tasks[action.payload.id].value
      const taskLength = Object.keys(state.dailyLogDevisions.tasks).length - 1;
      // const projectLength = Object.keys(
      //   state.dailyLogDevisions.projects
      // ).length;
      const projectLength = Object.keys(state.dailyLogDevisions.projects).length;
      const nbOfEntries = projectLength + taskLength;
      // const portion =
      //   DAILY_HOURS_VALUE / (nbOfEntries - 1) - DAILY_HOURS_VALUE / nbOfEntries;
      const portion = oldDailyValue / nbOfEntries;
      delete state.dailyLogDevisions.tasks[action.payload.id];
      Object.keys(state.dailyLogDevisions.tasks).map(
        (key) =>
          // (state.dailyLogDevisions.tasks[key].value = Math.floor(portion))
          (state.dailyLogDevisions.tasks[key].value = state.dailyLogDevisions.tasks[key].value+ portion)
      );
      Object.keys(state.dailyLogDevisions.projects).map(
        (key) =>
          // (state.dailyLogDevisions.projects[key].value = Math.floor(portion))
          (state.dailyLogDevisions.projects[key].value = state.dailyLogDevisions.projects[key].value + portion)
      );
    },

    hideDailyProject: (state, action) => {
      const project = state.dailyProjectManager.filter(
        (p) => p.id === action.payload
      )[0];


      //removng project from ongoig list to the nongoing
      state.dailyProjectManagerWithoutOngoingTasks.push(project);

      state.dailyProjectManager = state.dailyProjectManager.filter(
        (p) => p.id !== action.payload
      );
        //start the calculation
        // getting the old values for the input :
      const oldDailyValue = state.dailyLogDevisions.projects[action.payload].value

      const taskLength = Object.keys(state.dailyLogDevisions.tasks).length;
      // const projectLength = Object.keys(
      //   state.dailyLogDevisions.projects
      // ).length;
      const projectLength = Object.keys(state.dailyLogDevisions.projects).length  -1 ;

      const nbOfEntries = projectLength + taskLength;
      // const portion =
      //   DAILY_HOURS_VALUE / nbOfEntries - DAILY_HOURS_VALUE / nbOfEntries;
      // const portion = DAILY_HOURS_VALUE / nbOfEntries;
      const portion = oldDailyValue / nbOfEntries;

      delete state.dailyLogDevisions.projects[action.payload];

      Object.keys(state.dailyLogDevisions.tasks).map(
        (key) =>
          // (state.dailyLogDevisions.tasks[key].value = Math.floor(portion))
          (state.dailyLogDevisions.tasks[key].value = state.dailyLogDevisions.tasks[key].value +portion)
      );
      Object.keys(state.dailyLogDevisions.projects).map(
        (key) =>
          // (state.dailyLogDevisions.projects[key].value = Math.floor(portion))
          (state.dailyLogDevisions.projects[key].value = state.dailyLogDevisions.projects[key].value +portion)
      );
    },
    updateDaiyProjects: (state, action) => {
      const id = action.payload;
      //clearing up the list
      const project = state.dailyProjectManagerWithoutOngoingTasks.filter(
        (p) => p.id === id
      )[0];

      state.dailyProjectManager.push(project);
      state.dailyProjectManagerWithoutOngoingTasks =
        state.dailyProjectManagerWithoutOngoingTasks.filter((p) => p.id !== id);
      // creating the dailylog devision so the user can manager the hours directly without refreshing the page
      //check if all  the tasks and projects are chanegd
      let changed = true;

      Object.keys(state.dailyLogDevisions).forEach((key) => {
        Object.keys(state.dailyLogDevisions[key]).forEach((subKey) => {
          if (!state.dailyLogDevisions[key][subKey].changed) {
            changed = false;
          }
        });
      });

      let value = 0;
      if (!changed) {
        // recalculate the rest
        let nbOfEntries =
          Object.keys(state.dailyLogDevisions.tasks).length +
          Object.keys(state.dailyLogDevisions.projects).length;

        const portion = DAILY_HOURS_VALUE / (nbOfEntries + 1);
        console.log("new rest will be ", portion);
        Object.keys(state.dailyLogDevisions).forEach((key) => {
          Object.keys(state.dailyLogDevisions[key]).forEach((subKey) => {
            return (state.dailyLogDevisions[key][subKey].value = portion);
          });
        });
        // console.log("nb of entries ",nbOfEntries);
        value = portion;
        console.log("value of portion after calculating");
      }

      state.dailyLogDevisions.projects[id] = {
        changed: false,
        projectID: id,
        value: value,
      };
    },

    updateUserPotentialTasks: (state, action) => {
      const task = state.userPotentialTasks.filter(
        (t) => t.taskID === action.payload
      );

      state.userGeneralTasks.push(task[0]);
      state.userPotentialTasks = state.userPotentialTasks.filter(
        (t) => t.taskID !== action.payload
      );
    },
    updateUserGeneralTasksHours: (state, action) => {
      state.userGeneralTasks = state.userGeneralTasks.map((task) => {
        if (task.id === action.payload.id) {
          task.nbHours = action.payload.hours;
        }
        return task;
      });
    },
    updateSpecificTaskAttribute: (state, action) => {
      const taskIdx = state.projectTasks
        .map((task) => task.id)
        .indexOf(parseInt(action.payload.taskID));

      state.projectTasks[taskIdx][action.payload.attribute] =
        action.payload.value;
    },
    updateInterventionUploadedFile: (state, action) => {
      try {
        const taskIdx = state.projectTasks
          .map((task) => task.id)
          .indexOf(parseInt(action.payload.taskID));

        const intervIdx = state.projectTasks[taskIdx].intervenants
          .map((interv) => interv.id)
          .indexOf(action.payload.intervenantID);

        let obj = state.projectTasks[taskIdx].intervenants[intervIdx].file
          ? JSON.parse(state.projectTasks[taskIdx].intervenants[intervIdx].file)
          : [];

        if (action.payload.upload) {
          obj.push(action.payload.file);
        } else {
          obj = obj.filter((file) => file !== action.payload.file);
        }
        state.projectTasks[taskIdx].intervenants[intervIdx].file =
          JSON.stringify(obj);
      } catch (error) {
        console.log(error);
      }
    },
    // setUserPotentialTasks: (state, action) => {
    // }
  },
});

export const {
  setProjectTask,
  setTaskCreationPotentielIntervenants,
  updateProjectTask,
  clearProjectTasks,
  setUserDailyTasks,
  updateUserGeneralTasksHours,
  updateUserPotentialTasks,
  updateSpecificTaskAttribute,
  updateInterventionUploadedFile,
  updateDailyHours,
  hideDailyTask,
  hideDailyProject,
  updateDaiyProjects,
  // setUserGeneralTasks,
  // setUserPotentialTasks
} = taskSlice.actions;

export default taskSlice.reducer;
