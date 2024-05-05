import { createSlice } from "@reduxjs/toolkit"
import { stat } from "fs"

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) :{cartItems: []}

const addDecimals = (num) =>{
  return (Math.round(num*100)/100).toFixed(2);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers:{
    addToCart: (state, action)=>{
      const item = action.payload
      const existItem = state.cartItems.find((i)=> i._id === item._id)

      if(existItem){
        state.cartItems = state.cartItems.map((j)=> j.id === existItem._id ? item : j) 
      } else {
        state.cartItems = [...state.cartItems, item]
      }
      //Calculate item price
      state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item)=>acc + item.price * item.qty, 0))
      //Calculate shipping price (if applicable)
      state.shippingPrice = addDecimals(state.itemsPrice >= 500 ? 0 : 80)
      //Calculate tax price (19% gst)
      state.taxPrice = addDecimals(Number((0.19 * state.itemsPrice).toFixed(2)))
      //Calculate total price
      state.totalPrice = (
        Number(state.itemsPrice)+
        Number(state.shippingPrice)+
        Number(state.taxPrice)
      ).toFixed(2)

      localStorage.setItem("cart", JSON.stringify(state))

    }
  }
})

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer