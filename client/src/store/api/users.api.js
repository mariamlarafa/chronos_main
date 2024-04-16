import { api } from "./apiBase";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuthenticatedUserInfo: builder.mutation({
      query: (data) => ({
        url: "/users/user_info",
        method: "POST",
        data: data
      })
    }),
    getUserById: builder.mutation({
      query: (id) => ({
        url: `/users/user-info/${id}`,
        method: "GET",
      })
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `/users/profile/change`,
        method: "PATCH",
        data: data
      })
    }),
    updateUserProfilePicture: builder.mutation({
      query: (data) => ({
        url: `/users/profile/image/change`,
        method: "PATCH",
        data: data
      })
    }),
    getUserList: builder.mutation({
      query: () => ({
        url: "/users/list",
        method: "GET"
      })
    }),
    addNewUser:builder.mutation({
      query:(data)=>({
        url: `/users/add`,
        method: "POST",
        data: data
      })
    }),
    verifyTokenConfirmation:builder.mutation({
      query:(token)=>({
        url:`/users/confirmation/auth/1.0/token=${token}`,
        method: 'GET'
      })
    }),
    banUser:builder.mutation({
      query:(data)=>({
        url:`/users/ban/user/deactivate`,
        method: 'PATCH',
        data:data
      })
    }),
    unBanUser:builder.mutation({
      query:(data)=>({
        url:`/users/ban/user/activate`,
        method: 'PATCH',
        data:data
      })
    }),
    changeRole:builder.mutation({
      query:(data)=>({
        url:`/users/change/user/role`,
        method: 'PATCH',
        data:data
      })
    }),
  })
});

export const {
  useGetAuthenticatedUserInfoMutation,
  useUpdateUserProfileMutation,
  useUpdateUserProfilePictureMutation,
  useGetUserListMutation,
  useAddNewUserMutation,
  useVerifyTokenConfirmationMutation,
  useBanUserMutation,
  useUnBanUserMutation,
  useChangeRoleMutation,
  useGetUserByIdMutation
} = userApi;
