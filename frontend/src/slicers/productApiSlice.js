import { PRODUCTS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    getProducts : builder.query({
      query : ()=> ({
        url : PRODUCTS_URL
      }),
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
    })
  })
})

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation } = productApiSlice