import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectDetails: {},
  projectAccess: {
    isProjectEditable: false,
    isUserEligibleToEdit: false,
    isUserAnIntervenant: false,
    isUserAClient: false,
  },
  projectRequest: [],
  edit: false,
  twoWeeksList: [],
  twoWeeksListFiltered: [],
  projectLog: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {

      state.projectDetails = action.payload.project;
      state.projectAccess = {
        isProjectEditable: action.payload.isProjectEditable,
        isUserEligibleToEdit: action.payload.isUserEligibleToEdit,
        isUserAnIntervenant: action.payload.isUserAnIntervenant,
        isUserAClient:action.payload.isUserAClient

      };
    },
    setEditProject: (state, action) => {
      state.edit = action.payload;
    },
    setProjectPriority: (state, action) => {
      state.projectDetails.priority = action.payload;
    },
    setTwoWeeksDatesList: (state, action) => {
      state.twoWeeksList = action.payload;
    },
    setTwoWeeksDatesListFiltered: (state, action) => {
      state.twoWeeksListFiltered = action.payload;
    },
    setProjectRequests: (state, action) => {
      state.projectRequest = action.payload;
    },
    updateRequestList: (state, action) => {
      state.projectRequest.push(action.payload);
    },
    removeRequestFromList: (state, action) => {
      state.projectRequest = state.projectRequest.filter(
        (request) => request.id !== action.payload
      );
    },
    updateProjectState: (state, action) => {
      state.projectDetails.state = action.payload;
    },
    setProjectLog: (state, action) => {
      state.projectLog = action.payload;
    },
    updateFileRequestList: (state, action) => {
      const requestIdx = state.projectRequest
        .map((request) => request.id)
        .indexOf(parseInt(action.payload.requestID));
      if (action.payload.upload) {
        state.projectRequest[requestIdx].file = action.payload.urls;
      } else {
        state.projectRequest[requestIdx].file = state.projectRequest[
          requestIdx
        ].file.filter((file) => file !== action.payload.file);
      }
    },
  },
});

export const {
  setProject,
  setEditProject,
  setProjectPriority,
  setTwoWeeksDatesList,
  setProjectRequests,
  updateRequestList,
  removeRequestFromList,
  updateProjectState,
  setProjectLog,
  updateFileRequestList,
  setTwoWeeksDatesListFiltered,
} = projectSlice.actions;

export default projectSlice.reducer;
