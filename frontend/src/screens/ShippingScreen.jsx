import React from 'react'
import { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import FormContainer from "../components/FormContainer"
import Meta from "../components/Meta.jsx"
import { saveShippingAddress } from "../slicers/cartSlice"
import CheckoutSteps from "../components/CheckoutSteps"
import stateData from "../assetes/statesAndDistricts.json"
import { toast } from "react-toastify"

const ShippingScreen = () => {
  // console.log(stateData.);
  
  const cart = useSelector((state)=> state.cart)
  const { shippingAddress } = cart
  
    const [address, setAddress] = useState(shippingAddress?.address || "")
    const [city, setCity] = useState(shippingAddress?.city || "")
    const [district, setDistrict] = useState(shippingAddress?.district || "")
    const [state, setState] = useState(shippingAddress?.state || "")
    const [pinCode, setPincode] = useState(shippingAddress?.pinCode || "")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
      const submitHandler = (e) => {
        e.preventDefault()
        if (address.length < 10) {
          toast.error("Please re-check your address, it must be 10 characters atleast")
          return;
        } 
        if (city.length < 4) {
          toast.error("Please re-check your city name, it must be 4 characters atleast")
          return;
        } 
        if (pinCode.length !== 6) {
          toast.error("Pin code must be 6 digits")
          return;
        }
        dispatch(saveShippingAddress({address, city, district, state, pinCode}))
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
            as="select"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
          {state ?
            <>
              <option value="">Select District</option>
              {stateData[state].map((dist) => <option key={dist} value={dist}>{dist}</option>)}
            </>
           : <option value="">Please select a state first</option>
          }
          </Form.Control>
          <Form.Label>State</Form.Label>
          <Form.Control
            as ="select"
            value={state}
            onChange={(e) => {setState(e.target.value); setDistrict("")}}
          >
            <option value="">Select State</option>
              {Object.keys(stateData).map((stateName) => (
              <option key={stateName} value={stateName}>{stateName}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="pinCode" className="my-2">
          <Form.Label>Pin Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your area postal code"
            value={pinCode}
            onChange={(e)=> /^\d*$/.test(e.target.value) && setPincode(e.target.value.slice(0, 6))}
          ></Form.Control>
        </Form.Group>
        <Button 
          type="submit" 
          variant="dark" 
          className="my-2"
          disabled={!address || !city || !district || !state || !pinCode}
        >Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
