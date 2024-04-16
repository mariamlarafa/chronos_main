// import { createApi } from '@reduxjs/toolkit/query/react'
import {
  createApi
} from '@reduxjs/toolkit/query/react'
import axios from './base'

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params ,headers }) => {
    try {

      const result = await axios({ url: baseUrl + url, method, data, params ,headers })
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }


export const api = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({}),
})
// const customCreateApi = buildCreateApi(
//   coreModule(),
//   reactHooksModule({ useDispatch: createDispatchHook(MyContext) }),

// )
