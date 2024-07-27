import React from 'react'
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from "react-bootstrap"
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Meta from "../../components/Meta"
import { toast } from "react-toastify"
import { useGetUsersQuery, useDeleteAnUserMutation } from "../../slicers/usersApiSlice"

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery()
  const [deleteAnUser, { isLoading: loadingDelete }] = useDeleteAnUserMutation()
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete the user?")) {
      try {
        await deleteAnUser(id)
        toast.success("Successfully deleted the user from database.")
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }
  return (
    <>
      <Meta title={"Admin | List of Users | Adhunika"} />
      <h1>Users</h1>
      {loadingDelete && <Loader />}
      {isLoading ? <Loader /> :
        error ? (<Message variant="danger">{error.message}</Message>) :
          (<Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No.</th>
                <th>Admin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td><a href={`mailto:${user.email}`} style={{ textDecoration: "none" }}>{user.email}</a></td>
                  <td><a href={`tel:+91${user.mobileNo}`} style={{ textDecoration: "none" }}>+91 {user.mobileNo.substring(0, 5)} {user.mobileNo.substring(5, 10)}</a></td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : <FaTimes style={{ color: "red" }} />}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm mx-2" style={{ "color": "white" }} onClick={() => deleteHandler(user._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr></tr>
            </tbody>
          </Table>)
      }
    </>
  )
}

export default UserListScreen
