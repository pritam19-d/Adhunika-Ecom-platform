import React from 'react'
import { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import FormContainer from "../components/FormContainer"
import Meta from "../components/Meta.jsx"
import { saveShippingAddress } from "../slicers/cartSlice"
import CheckoutSteps from "../components/CheckoutSteps"

const ShippingScreen = () => {

  const cart = useSelector((state)=> state.cart)
  const { shippingAddress } = cart
  
    const [address, setAddress] = useState(shippingAddress?.address || "")
    const [city, setCity] = useState(shippingAddress?.city || "")
    const [district, setDistrict] = useState(shippingAddress?.district || "")
    const [pinCode, setPincode] = useState(shippingAddress?.pinCode || "")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
      const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, district, pinCode}))
        navigate("/payment")
      }
    
  return (
    <FormContainer>
          <Meta title={"Adhunika | Shipping"}/>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <hr />
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter shipping city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="district" className="my-2">
          <Form.Label>District</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter shipping district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="pinCode" className="my-2">
          <Form.Label>Pin Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your area postal code"
            value={pinCode}
            onChange={(e)=> setPincode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="dark" className="my-2">Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
