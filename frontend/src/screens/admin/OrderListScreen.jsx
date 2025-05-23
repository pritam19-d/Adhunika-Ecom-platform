import React from 'react'
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from "react-bootstrap"
import { FaTimes } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Meta from "../../components/Meta"
import { useGetOrdersQuery } from "../../slicers/orderApiSlices"
import { dateFormatting } from "../../constants"

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery()

  return (
    <>
        <Meta title={"Adhunika | Admin | Order List"}/>
      <h1>Orders</h1>
      {isLoading ? <Loader /> :
        error ? (<Message variant="danger">{error.message}</Message>) :
          (<Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Sl no.</th>
                <th>ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{++index}.</td>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{dateFormatting(order.createdAt).substring(0,10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      dateFormatting(order.paidAt).substring(0,10)
                    ) : <FaTimes style={{ color: "red" }} />}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      dateFormatting(order.deliveredDate).substring(0,10)
                    ) : <FaTimes style={{ color: "red" }} />}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="outline-info" className="btn btn-sm">Details</Button>
                    </LinkContainer>
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

export default OrderListScreen
