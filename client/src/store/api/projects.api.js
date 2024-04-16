import { api } from "./apiBase";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectList: builder.mutation({
      query: () => ({
        url: "projects/all",
        method: "GET"
      })
    }),
    generateProjectCode: builder.mutation({
      query: () => ({
        url: `projects/generate/code`,
        method: "GET"
      })
    }),
    verifyProjectCode: builder.mutation({
      query: (data) => ({
        url: "projects/verify/code",
        method: "POST",
        data: data
      })
    }),
    getPhases: builder.mutation({
      query: () => ({
        url: "phases/all",
        method: "GET"
      })
    }),
    getLots: builder.mutation({
      query: () => ({
        url: "lots/all",
        method: "GET"
      })
    }),
    getPotentielManagers: builder.mutation({
      query: () => ({
        url: "users/potentiel/manger/list",
        method: "GET"
      })
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "projects/add",
        method: "POST",
        data: data
      })
    }),
    getChoiceForProjectCreation: builder.mutation({
      query: () => ({
        url: "projects/creation/choice",
        method: "GET"
      })
    }),
    getProjectByID: builder.mutation({
      query: (projectID) => ({
        url: `projects/get/project/${projectID}`,
        method: "GET"
      })
    }),
    updateProject: builder.mutation({
      query: ({ body, projectID }) => ({
        url: `projects/change/${projectID}`,
        method: "PATCH",
        data: body
      })
    }),
    addIntervenants: builder.mutation({
      query: ({ body, projectID }) => ({
        url: `projects/intervenants/${projectID}/add`,
        method: "POST",
        data: body
      })
    }),
    getPotentielIntervenants: builder.mutation({
      query: (projectID) => ({
        url: `users/potentiel/intervenants/${projectID}/list`,
        method: "GET"
      })
    }),
    getProjectIntervenants: builder.mutation({
      query: (projectID) => ({
        url: `projects/intervenants/${projectID}`,
        method: "GET"
      })
    }),
    removeIntervenantFromProject: builder.mutation({
      query: ({ body, projectID }) => ({
        url: `projects/intervenants/${projectID}/remove`,
        method: "DELETE",
        data: body
      })
    }),
    assignManagerHoursBulk: builder.mutation({
      query: (body) => ({
        url: `projects/change/manager/assign/hours/bulk`,
        method: "PATCH",
        data: body
      })
    }),
    abandonProject: builder.mutation({
      query: ({body, projectID }) => ({
        url: `projects/abandon/project/${projectID}`,
        method: "PATCH",
        data: body
      })
    }),
    projectGetLog: builder.mutation({
      query: (projectID) => ({
        url: `projects/get/project/${projectID}/tracking`,
        method: "GET",

      })
    }),
  })
});

export const {
  useGetProjectListMutation,
  useGenerateProjectCodeMutation,
  useVerifyProjectCodeMutation,
  useGetPhasesMutation,
  useGetLotsMutation,
  useGetPotentielManagersMutation,
  useCreateProjectMutation,
  useGetChoiceForProjectCreationMutation,
  useGetProjectByIDMutation,
  useUpdateProjectMutation,
  useAddIntervenantsMutation,
  useGetPotentielIntervenantsMutation,
  useGetProjectIntervenantsMutation,
  useRemoveIntervenantFromProjectMutation,
  useAssignManagerHoursBulkMutation,
  useAbandonProjectMutation,
  useProjectGetLogMutation

} = projectApi;
