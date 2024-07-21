import React from 'react'
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col, Card } from "react-bootstrap"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer.jsx"
import Loader from "../components/Loader.jsx"
import { useRegisterMutation } from "../slicers/usersApiSlice.js"
import { setCredentials } from "../slicers/authSlice.js"
import { toast } from "react-toastify"

const RegisterScreen = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()

  const { userInfo } = useSelector((state) => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get("redirect") || "/"

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {

    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Please retype the 'Confirm Password' correctly")
    } else {
      try {
        const res = await register({ name, email, password }).unwrap()
        dispatch(setCredentials({ ...res }))
        navigate(redirect)
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card>
      <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Enter Your Full Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Enter Your Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Enter Password</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={toggleShowPassword}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
          </Form.Group>
          <Form.Group controlId="confirmpassword" className="my-3">
            <Form.Label>Retype Your Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="dark" className="mt-2" disabled={isLoading}>
            Register
          </Button>
          {isLoading && <Loader />}
        </Form>
        <Row className="py-3">
          <Col>
            Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login here</Link>
          </Col>
        </Row>
      </FormContainer>
    </Card>
  )
}

export default RegisterScreen
