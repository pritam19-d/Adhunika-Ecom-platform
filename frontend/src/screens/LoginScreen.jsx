import React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col, Card } from "react-bootstrap"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer.jsx"
import Loader from "../components/Loader.jsx"
import Meta from "../components/Meta.jsx"
import { useLoginMutation } from "../slicers/usersApiSlice.js"
import { setCredentials } from "../slicers/authSlice.js"
import { toast } from "react-toastify"

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation()

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
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      navigate(redirect)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card>
    <Meta title={"Adhunika | Login"}/>
      <FormContainer>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <div style={{ position: "relative"}}>
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
          <Button type="submit" variant="dark" className="mt-2" disabled={isLoading}>
            Sign In
          </Button>
          {isLoading && <Loader />}
        </Form>
        <Row className="py-3">
          <Col>
            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register Here</Link>
          </Col>
        </Row>
      </FormContainer>
    </Card>
  )
}

export default LoginScreen
