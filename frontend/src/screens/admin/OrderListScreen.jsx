import React from 'react'
import { Link } from "react-router-dom"
import { Table } from "react-bootstrap"
import { FaInfoCircle, FaTimes } from "react-icons/fa"
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
                <th>Order ID</th>
                <th>User</th>
                <th>Ordered Date</th>
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
                    <Link to={`/order/${order._id}`}>
                      <FaInfoCircle size={20} title="Order Details" />
                    </Link>
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
