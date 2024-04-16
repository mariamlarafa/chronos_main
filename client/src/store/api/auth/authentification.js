import { api } from "../apiBase";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data: data
      })
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change/password/v/1.0",
        method: "POST",
        data: data
      })
    }),
    checkCurrentPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password/reset/check-current",
        method: "POST",
        data: data
      })
    }),
    resetUserPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password/reset/v/1.0",
        method: "POST",
        data: data
      })
    }),
    requestResetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password/reset/email/send/token/v/1.0",
        method: "POST",
        data: data
      })
    }),
    verifyResetPasswordToken: builder.mutation({
      query: (token) => (

        {
        url: `/auth/password/reset/email/verify/token/v/1.0/token=${token}`,
        method: "GET",

      })
    }),
    resetPasswordWithToken: builder.mutation({
      query: (data) => (
        {
        url: `/auth/password/reset/token/1.0/token=${data.token}`,
        method: "POST",
        data:data
      })
    }),
    resetUserEmail: builder.mutation({
      query: (data) => (
        {
        url: `/auth//change/email`,
        method: "POST",
        data:data
      })
    }),
  })
});

export const {
  useLoginUserMutation,
  useChangePasswordMutation,
  useCheckCurrentPasswordMutation,
  useResetUserPasswordMutation,
  useRequestResetPasswordMutation,
  useVerifyResetPasswordTokenMutation,
  useResetPasswordWithTokenMutation,
  useResetUserEmailMutation
} = authApi;
