import { api } from "./apiBase";

export const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.mutation({
      query: (projectID) => ({
        url: `/tasks/project/${projectID}/all`,
        method: "GET"
      })
    }),
    getDailyLogTasks: builder.mutation({
      query: (date) => ({
        url: `tasks/daily/all?history=${date}`,
        method: "GET"
      })
    }),
    getTasksForUser: builder.mutation({
      query: (data) => ({
        url: `tasks/tasksforuser`,
        method: "POST",
        data : data
      }),
    }),
    getTaskPotentialIntervenants: builder.mutation({
      query: ({ projectID, taskID }) => ({
        url: `tasks/project/${projectID}/potential/task/intervenants/list`,
        method: "PATCH",
        data: { taskID: taskID }
      })
    }),
    addIntervenantToTask: builder.mutation({
      query: ({ body, projectID }) => ({
        url: `tasks/project/${projectID}/associate/intervenants`,
        method: "PATCH",
        data: body
      })
    }),
    createTask: builder.mutation({
      query: ({ body, projectID }) => ({
        url: `tasks/project/${projectID}/create`,
        method: "POST",
        data: body
      })
    }),
    associateToTask: builder.mutation({
      query: ({ body, projectID }) => ({
        url: `tasks/project/${projectID}/associate/intervenants`,
        method: "PATCH",
        data: body
      })
    }),
    assignHoursInTask: builder.mutation({
      query: (body) => ({
        url: `tasks/project/bulk/intervenant/working/hours`,
        method: "PATCH",
        data: body
      })
    }),
    updateTask: builder.mutation({
      query: ({ body, taskID, projectID }) => ({
        url: `tasks/update_details/project/${projectID}/task/${taskID}`,
        method: "PATCH",
        data: body
      })
    }),
    uploadFileToTask: builder.mutation({
      query: ({ body, taskID, projectID }) => ({
        url: `tasks/update/project/${projectID}/task/${taskID}/upload/file`,
        method: "PATCH",
        data: body
      })
    }),
    deleteFileFromTask: builder.mutation({
      query: ({ body, taskID, projectID }) => ({
        url: `tasks/update/project/${projectID}/task/${taskID}/delete/file`,
        method: "PATCH",
        data: body
      })
    }),
    downloadTaskFile: builder.mutation({
      query: ({ url }) => ({
        url: url,
        method: "GET",
        headers: {
          "response-type": "blob"
        }
      })
    }),
    filterProjectsTasksByDates: builder.mutation({
      query: (data) => ({
        url: `tasks/filter/bulk/projects/start_end/dates`,
        method: "POST",
        data: data
      })
    })
  })
});

export const {
  useGetProjectTasksMutation,
  useGetTaskPotentialIntervenantsMutation,
  useAddIntervenantToTaskMutation,
  useCreateTaskMutation,
  useAssociateToTaskMutation,
  useAssignHoursInTaskMutation,
  useUpdateTaskMutation,
  useGetDailyLogTasksMutation,
  useDownloadTaskFileMutation,
  useUploadFileToTaskMutation,
  useFilterProjectsTasksByDatesMutation,
  useDeleteFileFromTaskMutation,
  useGetTasksForUserMutation
} = taskApi;
