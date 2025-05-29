import React from 'react'
import { useState, useEffect } from "react"
import { Table, Form, Button, Row, Col } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Meta from "../components/Meta.jsx"
import VerifyOTPModal from "../components/VerifyOTPModal.jsx"
import { FaTimes, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa"
import { useProfileMutation, useSendOtpMutation, useVerifyOtpMutation } from "../slicers/usersApiSlice"
import { logout, setCredentials } from "../slicers/authSlice"
import { useGetMyOrdersQuery } from "../slicers/orderApiSlices"
import { dateFormatting } from "../constants.js"

const ProfileScreen = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobileNo, setMobileNo] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isverified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation()
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [sendOtp, {isLoading: sendingOtp}] = useSendOtpMutation();
  const [verifyOtp, {isLoading: verifyingOtp}] = useVerifyOtpMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
      setMobileNo(userInfo.mobileNo)
    }
  }, [userInfo, userInfo.name, userInfo.email])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Retype the Password correctly")
    } else if (password && (password.length < 6)){
      toast.error("Your password must contains atleast 6 characters")
    } else if (mobileNo.length < 10){
      toast.warning("Please re-check your mobile number")
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, mobileNo, password }).unwrap()
        !password && !email ? dispatch(setCredentials({ ...res })) :dispatch(logout())
        toast.success(`Profile Updated Successfully.\n${(password || email) && `Please login again with your new ${password ? "password" : "email"}`}`)
      } catch (err) {
        toast.error(err?.data?.message || err?.error)
      }
    }
  }

  const handleOTPSubmit = async (otp) => {
      try {
        if (!otp || otp.length !== 6) {
          toast.error("Please enter a valid 6-digit OTP");
          return;
        }
        const res = await verifyOtp({ email, otp, reqType: "register" }).unwrap();
        if (res.success) {
          setIsVerified(true);
          res?.data?.email && setEmail(res.data.email);
          toast.success("Email verified successfully!");
          setShowOTPModal(false);
        } else {
          toast.error(res.data.message || "OTP verification failed");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || "Failed to verify OTP");
      }
    }

  const handleSendOtp = async () => {
    if (!email ) {
      toast.error("Please enter your email address to verify")
      return;
    }
    try {
      const res = await sendOtp({ email, reqType: "register" }).unwrap();
      if (res.success) {
        toast.success(res.message);
        setShowOTPModal(true);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message || "Failed to send OTP");
    }
  }

  return (
    <Row>
          <Meta title={`Adhunika | ${userInfo.name}`}/>
      <Col md={3}>
        <h2>Profile</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address*</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => !isverified && setEmail(e.target.value)}
                readOnly={isverified}
              />
              <span style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}>
                {isverified ? <FaCheck /> : 
                  sendingOtp ? <div className="spinner-border" role="status" /> :
                  userInfo?.email !== email && <button
                    className="btn btn-outline-dark border-0 btn-sm"
                    onClick={()=>handleSendOtp}
                    disabled={!email || !email.includes("@") || !email.includes(".") || isverified || sendingOtp}
                  ><b>Verify</b></button>
                }
              </span>
            </div>
          </Form.Group>
          <Form.Group controlId="mobileNo" className="my-3">
            <Form.Label>Mobile number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234567890"
              value={mobileNo}
              onChange={(e) => {
                e.target.value.length > 10 ? toast.warn("Mobile number should be 10 characters") :
                setMobileNo(e.target.value)
              }}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  e.target.value.length > 25 ? toast.info("Password should not be more than 25 characters") :
                  setPassword(e.target.value)}}
              />
              <span
                onClick={()=>setShowPassword(!showPassword)}
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
          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="dark" className="my-2">Update</Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ?
          <Loader />
          : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>Sl no.</th>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{++index}.</td>
                    <td>{order._id}</td>
                    <td>{dateFormatting(order.createdAt).substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        dateFormatting(order.paidAt).substring(0, 10)
                      ) : <FaTimes style={{ color: "red" }} />}
                    </td>
                    <td>
                      {order.isDelivered ? (
                          dateFormatting(order.deliveredDate).substring(0, 10)
                      ) : <FaTimes style={{ color: "red" }} />}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="dark" className="btn btn-dark btn-sm">Details</Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
      </Col>
      <VerifyOTPModal
        show={showOTPModal}
        handleClose={() => setShowOTPModal(false)}
        handleVerify={handleOTPSubmit}
        isVerifying = {verifyingOtp}
      />
    </Row>
  )
}

export default ProfileScreen
