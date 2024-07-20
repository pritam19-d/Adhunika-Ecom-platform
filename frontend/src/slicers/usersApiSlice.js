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
    register : builder.mutation({
      query : (data)=> ({
        url : USERS_URL,
        method: "POST",
        body: data
      }),
      keepUnusedDataFor: 2
    }),
    logout : builder.mutation({
      query : ()=>({
        url: `${USERS_URL}/logout`,
        method: "POST"
      })
    }),
    profile : builder.mutation({
      query : (data)=>({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data
      })
    }),
    getUsers : builder.query({
      query: ()=>({
        url: USERS_URL,
        method: "GET"
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 5
    }),
    deleteAnUser: builder.mutation({
      query: (userId)=>({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE"
      })
    })
  })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation, useGetUsersQuery, useDeleteAnUserMutation } = usersApiSlice