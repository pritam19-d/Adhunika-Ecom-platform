import React from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import FormContainer from "../../components/FormContainer"
import { toast } from "react-toastify"
import { useUpdateUserMutation, useGetUserDetailQuery } from "../../slicers/usersApiSlice"

const UserEditScreen = () => {
  const { id: userId } = useParams()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  const { data: user, isLoading, refetch, error } = useGetUserDetailQuery(userId)
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [user])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await updateUser({ userId, name, email, password, isAdmin }).unwrap();
      toast.success('User Details updated');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">Go back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
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
              </Form.Group>
              <Form.Group controlId="password" className="my-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Need to create a autometic generate password button and apply that with the setPassword */}
              </Form.Group>
              <Form.Group controlId="isAdmin" className="my-2">
                <Form.Label>Set Admin</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Is Admin?"
                  checked={isAdmin}
                  onChange={ e => setIsAdmin(e.target.checked) }
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
