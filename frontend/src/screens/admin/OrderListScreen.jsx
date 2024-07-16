import React from 'react'
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from "react-bootstrap"
import { FaTimes } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useGetOrdersQuery } from "../../slicers/orderApiSlices"

const OrderListScreen = () => {
  const {data: orders, isLoading, error} = useGetOrdersQuery()

  console.log(error)

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? <Loader />: 
        error ? ( <Message variant="danger">{error.message}</Message> ):
        (<Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>
        </Table>)
      }
    </>
  )
}

export default OrderListScreen
