// leaveApi.js

import { api } from "./apiBase";

export const leaveApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeaves: builder.mutation({
      query: () => ({
        url: "/leaves",
        method: "GET",
      }),
    }),
    getAllLeavesByEmail: builder.mutation({
      query: (email) => ({
        url: `/leaves/user`,
        method: "POST",
        data: email
      }),
    }),
    createLeave: builder.mutation({
      query: (data) => ({
        url: "/leaves",
        method: "POST",
        data: data,
      }),
    }),
    updateLeave: builder.mutation({
      query: (data) => ({
        url: `/leaves/${data?.id}`,
        method: "PUT",
        data: data,
      }),
    }),
    deleteLeave: builder.mutation({
      query: (leaveId) => ({
        url: `/leaves/${leaveId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllLeavesMutation,
  useGetAllLeavesByEmailMutation, // New mutation hook for fetching leaves by user ID
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leaveApi;
