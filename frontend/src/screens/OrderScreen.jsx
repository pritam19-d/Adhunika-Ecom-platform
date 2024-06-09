import React from 'react'
import { Link, useParams } from "react-router-dom"
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useGetOrderDetailsQuery } from "../slicers/orderApiSlices"

const OrderScreen = () => {
  const { id: orderId } = useParams()

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)
  console.log(order);

  return (
    isLoading ? (<Loader />) :
      error ? (<Message variant="danger" />) :
        (
          <>
            <h1>Order: {order._id}</h1>
            <Row>
              <Col md={8}>
                <ListGroup>
                  <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                      <b>Name: </b>{order.user.name}
                    </p>
                    <p>
                      <b>Email: </b>{order.user.email}
                    </p>
                    <p>
                      <b>Address: </b>{order.shippingAddress.address}, {order.shippingAddress.city}. Dist- {order.shippingAddress.district}, PIN- {order.shippingAddress.pinCode}
                    </p>
                    <p>{order.isDelivered ?
                      (<Message variant="success">Delivered on {order.deliveredAt}</Message>) :
                      (<Message variant="danger">Yet to be deliver.</Message>)
                    }
                    </p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p><b>Method: </b>{order.paymentMethod}</p>
                    {order.isPaid ? (
                      <Message variant="success">Paid on {order.paidAt}</Message>
                    ) : (
                      <Message variant="danger">Payment not received yet</Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            ₹{item.price} × {item.qty} = ₹{item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4}>
                <Card>
                  <ListGroup>
                    <ListGroup.Item>Order Summary</ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>₹{order.itemsPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>₹{order.shippingPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Tax</Col>
                        <Col>₹{order.taxPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Total</Col>
                        <Col>₹{order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    {/* PAY ORDER PLACEHOLDER */}
                    {/* MARK AS DELIVERED PLACEHOLDER */}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </>
        )
  )
}

export default OrderScreen
