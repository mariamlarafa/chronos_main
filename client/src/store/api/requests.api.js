import { api } from "./apiBase";

export const requestApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectRequest: builder.mutation({
      query: (projectID) => ({
        url: `/requests/get/project/${projectID}/requests`,
        method: "GET",

      })
    }),
    createProjectRequest: builder.mutation({
      query: (data) => ({
        url: `/requests/project/request/create`,
        method: "POST",
        data: data,
        headers:{
          'Content-Type': 'multipart/form-data',
        }

      })
    }),
    updateProjectRequest: builder.mutation({
      query: ({body,projectID,requestID}) => ({
        url: `/requests/project/${projectID}/request/${requestID}/change`,
        method: "PATCH",
        data: body

      })
    }),
    deleteProjectRequest: builder.mutation({
      query: ({projectID,requestID}) => ({
        url: `/requests/project/${projectID}/request/${requestID}/delete`,
        method: "DELETE",
        // data: body

      })
    }),
    uploadFileToProjectRequest: builder.mutation({
      query: ({projectID,requestID,body}) => ({
        url: `/requests/update/project/${projectID}/task/${requestID}/upload/file`,
        method: "PATCH",
        // data: body
        data: body

      })
    }),
    deleteFileFromRequestOrTasks: builder.mutation({
      query: ({projectID,requestID,body}) => ({
        url: `/requests/update/project/${projectID}/task/${requestID}/delete/file`,
        method: "PATCH",
        // data: body
        data: body

      })
    }),


  })
});

export const {
 useGetProjectRequestMutation,
 useCreateProjectRequestMutation,
 useUpdateProjectRequestMutation,
 useDeleteProjectRequestMutation,
 useUploadFileToProjectRequestMutation,
 useDeleteFileFromRequestOrTasksMutation
} = requestApi;
