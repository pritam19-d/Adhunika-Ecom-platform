import { USERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    login : builder.mutation({
      query : (data)=> ({
        url : `${USERS_URL}/auth`,
        method: "POST",
        body: data
      }),
      keepUnusedDataFor: 5
    }),
    logout : builder.mutation({
      query : ()=>({
        url: `${USERS_URL}/logout`,
        method: "POST"
      })
    })
  })
})

export const { useLoginMutation, useLogoutMutation } = usersApiSlice