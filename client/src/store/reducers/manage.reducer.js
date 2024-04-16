import { createSlice } from "@reduxjs/toolkit";

const filtersInit = [
  { type: "manager.fullName", active: false },
  { type: "lots", active: false },
  { type: "activePhase", active: false },
  { type: "state", active: false },
  { type: "taskState", active: false },
];

const initialState = {
  userList: [],
  projectsList: [],
  projectsTaskList: [],
  projectsTaskListFiltered: [],

  addProject: {
    existantProjects: [],
    code: "",
    customCode: "",
    phases: [],
    lots: [],
    managers: [],
    linkingProject: false,
    linkedProject: {},
    linkedProjectID: "",
    projectsListFiltered: [],
    isFiltering: false,
    filterType: [],
  },
  filters: filtersInit,
  projectsTaskFilters: [],
  projectListDailyFilter: true,
  projectsTaskFiltersDates: {
    start: "",
    end: "",
  },
};

const manageSlice = createSlice({
  name: "manage",
  initialState,
  reducers: {
    setUsersList: (state, action) => {
      state.userList = action.payload;
    },
    updateUserInList: (state, action) => {
      const idx = state.userList.findIndex(
        (user) => user.email === action.payload.email
      );
      if (Object.keys(action.payload).includes("ban")) {
        state.userList[idx].isBanned = action.payload.ban;
      }

      if (action.payload.role) {
        state.userList[idx].role = action.payload.role;
      }
    },
    addNewUSerToList: (state, action) => {
      state.userList.push(action.payload);
    },
    setProjectList: (state, action) => {
      state.projectsList = action?.payload.projects;
      state.projectsTaskList = action?.payload.tasks;
      // launch dailyLogFilter
    },
    setProjectTaskListFiltered: (state, action) => {
      state.projectsTaskListFiltered = action?.payload;
    },

    updateProjectList: (state, action) => {
      state.projectsList.push(action.payload);
    },

    clearManageList: (state, action) => {
      state = initialState;
    },
    clearAddProjectState: (state, action) => {
      state.addProject = initialState.addProject;
    },
    setAddProjectCode: (state, action) => {
      if (action.payload.validCode) {
        state.addProject.code = action.payload.validCode;
        state.addProject.customCode = action.payload.validCode;
      }
      if (action.payload.existantProjects) {
        state.addProject.existantProjects = action.payload.existantProjects;
      }
    },

    setPhases: (state, action) => {
      state.addProject.phases = action.payload;
    },
    setLot: (state, action) => {
      state.addProject.lots = action.payload.filter((elem) => elem.name);

      // state.addProject.lots = action.payload
    },
    setPotentielManagers: (state, action) => {
      state.addProject.managers = action.payload;
    },
    setLinkingProject: (state, action) => {
      state.addProject.linkingProject = action.payload;
    },
    setLinkedProject: (state, action) => {
      state.addProject.linkedProjectID = action.payload;
      if (action.payload) {
        state.addProject.linkedProject = state.projectsList.filter(
          (projet) => projet.id === parseInt(action.payload)
        )[0].projectCustomId;
      }
    },
    applyDailyFilter: (state, action) => {},
    // to do the filter
    filterProjectsList: (state, action) => {
      /**
       * accepts  three paramters :
       * attribute : the name of the filter (state,lots, manager.fullname etcc...)
       * value : the value of the desired filter
       * flag:  to indicate if the filter is active or not so we can pop the filter out from the list
       */
      //checking is there is already a filter with same attribute
      const isFilteredBy = state.addProject.filterType.filter(
        ({ type }) => type === action.payload.attribute
      )[0];
      let indxOfFilter = -1;

      // if the filter is new
      if (!isFilteredBy) {
        state.addProject.filterType.push({
          type: action.payload.attribute,
          value: [action.payload.value],
        });

        indxOfFilter = state.addProject.filterType.length - 1;
      } else {
        // if the filter is old : this serves the multi value filtering for each key
        // position of the filter in the filterType
        indxOfFilter = state.addProject.filterType
          .map(({ type }) => type)
          .indexOf(action.payload.attribute);

        if (
          !state.addProject.filterType[indxOfFilter]?.value.includes(
            action.payload.value
          )
        ) {
          // special case for the projectCustomId
          if (action.payload.attribute === "projectCustomId") {
            if (action.payload.value === "" && action.payload.popFilter) {
              state.addProject.filterType = state.addProject.filterType.filter(
                (filter) => filter.type !== "projectCustomId"
              );
            } else {
              state.addProject.filterType[indxOfFilter].value = [
                action.payload.value,
              ];
            }
          } else {
            state.addProject.filterType[indxOfFilter].value.push(
              action.payload.value
            );
          }
        } else {
          if (!action.payload.flag || action.payload.popFilter) {
            state.addProject.filterType[indxOfFilter].value =
              state.addProject.filterType[indxOfFilter].value.filter(
                (value) => value !== action.payload.value
              );
          }
        }
      }

      //actually starting filtering based on the value of the of each key in  the  filterType array
      if (action.payload.value && isFilteredBy && indxOfFilter > -1) {
        // check if the value is an empty array
        if (!state.addProject.filterType[indxOfFilter].value.length)
          state.addProject.filterType = state.addProject.filterType.filter(
            (elem) => elem.type !== action.payload.attribute
          );
      }

      if (!state.addProject.filterType.length) {
        state.addProject.isFiltering = false;
      } else {
        state.addProject.isFiltering = action.payload.flag;
      }

      if (!state.addProject.isFiltering) {
        state.addProject.filterType = [];
      }
      // Now, filter the projects based on the filterType array
      state.addProject.projectsListFiltered = state.projectsList.filter(
        (project) => {
          return state.addProject.filterType.every((filterAttribute) => {
            const nestedProperty = filterAttribute.type.split(".");
            //nested value is the value of filter type from the project
            const nestedValue = nestedProperty.reduce(
              (obj, key) => (obj && obj[key] ? obj[key] : null),
              project
            );

            // console.log(nestedValue,nestedProperty);
            if (Array.isArray(filterAttribute.value)) {
              // If filter value is an array, check if any element matches
              //inserting here lots CONTAINS_ONLY
              if (filterAttribute.type === "lots") {
                let matchWithoutOr = false;
                let matchWith = false;
                if (filterAttribute.value.includes("GO&CM")) {
                  matchWith =
                    JSON.stringify(nestedValue.sort()) ===
                    JSON.stringify(["GO", "CM"].sort());
                }
                matchWithoutOr = filterAttribute.value
                  .filter((val) => val !== "GO&CM")
                  .some(
                    (val) =>
                      nestedValue.includes(val) &&
                      filterAttribute.value.filter((val) => val !== "GO&CM")
                        .length === nestedValue.length
                  );

                return matchWithoutOr || matchWith;
              } else {
                return filterAttribute.value.some((filterVal) => {
                  const regex = new RegExp(filterVal, "i");
                  return regex.test(nestedValue);
                });
              }
            } else {
              // If filter value is a string, perform the original case-insensitive search
              const regex = new RegExp(filterAttribute.value, "i");
              return regex.test(nestedValue);
            }
          });
        }
      );
    },

    // remove filter from  list
    undoFilterType: (state, action) => {
      state.addProject.filterType = state.addProject.filterType.filter(
        (ft) => ft.type !== action.payload
      );
      // Now, filter the projects based on the filterType array
      state.addProject.projectsListFiltered = state.projectsList.filter(
        (project) => {
          return state.addProject.filterType.every((filterAttribute) => {
            const nestedProperty = filterAttribute.type.split(".");

            const nestedValue = nestedProperty.reduce(
              (obj, key) => (obj && obj[key] ? obj[key] : null),
              project
            );
            const valueToMatch = Array.isArray(filterAttribute.value)
              ? filterAttribute.value
                  .map((val) => val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                  .join("|")
              : filterAttribute.value;

            // Create a regular expression that matches any of the values in the array
            const regex = new RegExp(valueToMatch, "i");

            return regex.test(nestedValue);
          });

          // return list;
        }
      );
    },
    // to disable the filtering
    setIsFiltering: (state, action) => {
      state.addProject.isFiltering = action.payload;
    },

    // to enable the filtering just display
    showFilterForType: (state, action) => {
      state.filters = state.filters.map((ft) => {
        if (ft.type === action.payload) {
          ft.active = true;
        } else {
          ft.active = false;
        }
        return ft;
      });
    },
    hideFilterForType: (state, action) => {
      state.filters = state.filters.map((ft) => {
        ft.active = false;
        return ft;
      });
    },
    filterByTaskStatus: (state, action) => {
      if (!state.projectsTaskFilters.includes(action.payload)) {
        state.projectsTaskFilters.push(action.payload);
      }
    },
    popTaskStateFromFilter: (state, action) => {
      state.projectsTaskFilters = state.projectsTaskFilters.filter(
        (filter) => filter !== action.payload
      );
    },
    setProjectTasksDateFilter: (state, action) => {
      state.projectsTaskFiltersDates.start = action.payload.start;
      state.projectsTaskFiltersDates.end = action.payload.end;
    },
    clearProjectTasksDateFilter: (state, action) => {
      state.projectsTaskFiltersDates.start = null;
      state.projectsTaskFiltersDates.end = null;
    },
    changeDailyFilter: (state, action) => {
      state.projectListDailyFilter = action.payload;
    },
  },
});

export const {
  setUsersList,
  addNewUSerToList,
  clearManageList,
  setProjectList,
  updateProjectList,
  setAddProjectCode,
  setPhases,
  setLot,
  clearAddProjectState,
  setPotentielManagers,
  setLinkingProject,
  setLinkedProject,
  filterProjectsList,
  updateUserInList,
  showFilterForType,
  hideFilterForType,
  undoFilterType,
  filterByTaskStatus,
  popTaskStateFromFilter,
  setProjectTaskListFiltered,
  setProjectTasksDateFilter,
  clearProjectTasksDateFilter,
  changeDailyFilter,
  applyDailyFilter,
} = manageSlice.actions;

export default manageSlice.reducer;
