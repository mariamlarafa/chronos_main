import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllLeaves, createLeave, updateLeave, deleteLeave } from "../../store/api/leave.api";

const initialState = {
  leaves: [],
  status: "idle", // Possible statuses: idle, loading, succeeded, failed
  error: null,
  
};

export const fetchLeaves = createAsyncThunk("leaves/fetchLeaves", async () => {
  const response = await getAllLeaves(); // Implement this API function
  return response.leaves;
});

export const addLeave = createAsyncThunk("leaves/addLeave", async (newLeaveData) => {
  const response = await createLeave(newLeaveData); // Implement this API function
  return response.leave;
});

export const updateOneLeave = createAsyncThunk("leaves/updateOneLeave", async ({ leaveId, updatedData }) => {
  const response = await updateLeave(leaveId, updatedData); // Implement this API function
  return response.leave;
});

export const deleteOneLeave = createAsyncThunk("leaves/deleteOneLeave", async (leaveId) => {
  await deleteLeave(leaveId); // Implement this API function
  return leaveId;
});

const leaveSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaves = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addLeave.fulfilled, (state, action) => {
        state.leaves.push(action.payload);
      })
      .addCase(updateOneLeave.fulfilled, (state, action) => {
        state.leaves = state.leaves.map((leave) =>
          leave.id === action.payload.id ? action.payload : leave
        );
      })
      .addCase(deleteOneLeave.fulfilled, (state, action) => {
        state.leaves = state.leaves.filter((leave) => leave.id !== action.payload);
      });
  },
});

export const selectAllLeaves = (state) => state.leaves.leaves;
export const selectLeavesStatus = (state) => state.leaves.status;
export const selectLeavesError = (state) => state.leaves.error;

export default leaveSlice.reducer;
