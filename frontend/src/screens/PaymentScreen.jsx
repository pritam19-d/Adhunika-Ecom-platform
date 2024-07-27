import React from 'react'
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Form, Button, Col } from "react-bootstrap"
import FormContainer from "../components/FormContainer"
import CheckoutSteps from "../components/CheckoutSteps"
import Meta from "../components/Meta.jsx"
import { savePaymentMethod } from "../slicers/cartSlice"

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping")
    }
  }, [shippingAddress, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate("/placeorder")
  }

  return (
    <FormContainer>
      <Meta title={"Adhunika | Payment"} />
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <hr />
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal"
              id="PayPal"
              value="PayPal"
              checked={"PayPal" === paymentMethod}
              onClick={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type="radio"
              className="my-2"
              label="Cash on Delivary (For orders less than ₹10000)"
              id="COD"
              value="COD"
              checked={"COD" === paymentMethod}
              onClick={(e) => setPaymentMethod(e.target.value)}
              disabled={cart.totalPrice - cart.taxPrice > 10000}
            />
          </Col>
        </Form.Group>
        <Button type="submit" variant="dark">Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
