import React from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { FaCopy, FaCheck, FaBroom } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Meta from "../../components/Meta"
import FormContainer from "../../components/FormContainer"
import { toast } from "react-toastify"
import { useUpdateUserMutation, useGetUserDetailQuery } from "../../slicers/usersApiSlice"

const UserEditScreen = () => {
  const { id: userId } = useParams()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobileNo, setMobileNo] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [passLen, setPassLen] = useState(10)
  const [isCopied, setIsCopied] = useState(false)

  const { data: user, isLoading, refetch, error } = useGetUserDetailQuery(userId)
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setMobileNo(user.mobileNo)
      setIsAdmin(user.isAdmin)
    }
  }, [user])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (mobileNo.length < 10) {
      toast.warning("Please re-check your mobile number")
    } else {
      try {
        await updateUser({ userId, name, email, mobileNo, password, isAdmin }).unwrap();
        toast.success('User Details Updated Successfully.');
        refetch();
        navigate('/admin/userlist');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const generateHandler = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-';
    let generatedPassword = ""
    for (let i = 1, n = charset.length; i <= passLen; ++i) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(generatedPassword)
  }
  const copyHandler = () => {
    try {
      navigator.clipboard.writeText(password)
      toast.success("Passowrd Copied to Clipboard Successfully")
      setIsCopied(true)
    } catch (err) {
      toast.error("Failed to copy the text")
    }
    setTimeout(() => {
      setIsCopied(false)
    }, 6000);
  }

  return (
    <>
        <Meta title={"Admin | Edit User | Adhunika"}/>
      <Link to="/admin/userlist" className="btn btn-light my-3">Go back</Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? <Loader /> :
          error ? <Message variant="danger">{error}</Message> : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2" >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter New User Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="email" className="my-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter New Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Group controlId="mobileNo" className="my-3">
                  <Form.Label className="my-2">Mobile number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234567890"
                    value={mobileNo}
                    onChange={(e) => {
                      e.target.value.length > 10 ? toast.warn("Mobile number should be 10 digits long") :
                        setMobileNo(e.target.value)
                    }}
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="password" className="my-2">
                <Form.Label>Password</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    placeholder="Click on Generate Button to Generate a New Passowrd & Update"
                    value={password}
                    readOnly
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FaBroom
                    onClick={() => setPassword("")}
                    style={{
                      position: "absolute",
                      right: "8%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <span
                    onClick={copyHandler}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      pointerEvents: isCopied ? "none" : "auto"
                    }}
                  >{isCopied ? <FaCheck /> : <FaCopy />}</span>
                </div>
                <Form.Label>Set Password Length</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="number"
                    placeholder="Enter Password Length"
                    value={passLen}
                    onChange={(e) => {
                      e.target.value <= 5 ? toast.warn("Password should not be less than 6 characters.") :
                        e.target.value > 25 ? toast.warn("Password should not be more than 25 characters.") :
                          setPassLen(Math.abs(e.target.value))
                    }}
                  />
                  <Button
                    onClick={generateHandler}
                    className="btn-sm btn-outline-success"
                    variant="btn-outline"
                    style={{
                      position: "absolute",
                      right: "6%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}>Generate</Button>
                </div>
              </Form.Group>
              <Form.Group controlId="isAdmin" className="my-2">
                <Form.Label>Set Admin</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Is Admin?"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="dark"
                className="my-2"
              >Update</Button>
            </Form>
          )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
