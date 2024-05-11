export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export const updateCart = (state) => {
  //Calculate item price
  state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
  //Calculate shipping price (if applicable)
  state.shippingPrice = addDecimals(state.itemsPrice >= 500 ? 0 : 80)
  //Calculate tax price (19% gst)
  state.taxPrice = addDecimals(Number((0.19 * state.itemsPrice).toFixed(2)))
  //Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2)

  localStorage.setItem("cart", JSON.stringify(state))

  return state
}