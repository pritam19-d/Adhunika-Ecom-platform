import { PRODUCTS_URL, UPLOAD_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    getProducts : builder.query({
      query : ({ keyword, pageNumber })=> ({
        url : PRODUCTS_URL,
        params: {
          keyword,
          pageNumber
        }
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
      invalidatesTags: ["Products"]
    }),
    uploadProductImage: builder.mutation({
      query: (data)=>({
        url: UPLOAD_URL,
        method: "POST",
        body: data
      })
    }),
    deleteAnyProduct: builder.mutation({
      query: (productId)=>({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE"
      })
    }),
    createReview: builder.mutation({
      query: (data)=>({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Product"]
    }),
    getTopProducts: builder.query({
      query : ()=> ({
        url : `${PRODUCTS_URL}/top`
      }),
      keepUnusedDataFor:5
    }),
    getCategorisedProduct: builder.query({
      query : (category) =>({
        url : `${PRODUCTS_URL}/category/${category}`,
        method : "GET"
      })
    })
  })
})

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateAnyProductMutation, useUploadProductImageMutation, useDeleteAnyProductMutation, useCreateReviewMutation, useGetTopProductsQuery, useGetCategorisedProductQuery } = productApiSlice