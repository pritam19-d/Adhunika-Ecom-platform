import { PRODUCTS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    getProducts : builder.query({
      query : ()=> ({
        url : PRODUCTS_URL
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5
    }),
    getProductDetails: builder.query({
      query : (productId)=> ({
        url : `${PRODUCTS_URL}/${productId}`
      }),
      keepUnusedDataFor:4
    }),
    createProduct: builder.mutation({
      query : ()=>({
        url : PRODUCTS_URL,
        method : "POST"
      }),
      invalidatesTags: ["Product"]
    }),
    updateAnyProduct: builder.mutation({
      query: (data)=>({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Product"]
    })
  })
})

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateAnyProductMutation } = productApiSlice