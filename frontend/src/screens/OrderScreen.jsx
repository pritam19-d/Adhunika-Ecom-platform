import React, { useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Meta from "../components/Meta.jsx"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from "../slicers/orderApiSlices"

const OrderScreen = () => {
  const { id: orderId } = useParams()

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation()
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery()

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD"
          }
        })
        paypalDispatch({ type: "setLoadingStatus", value: "pending" })
      }
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript()
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details })
        refetch();
        toast.success("Payment Successful!")
      } catch (err) {
        toast.error(err.data.message || err.error)
      }
    })
  }
  async function onApprovePayment() {
    await payOrder({orderId, details: { payer: {} }}).unwrap()
    refetch();
    toast.success("Payment Successful!")
  }
  function onError(err) {
    toast.error(err.message)
  }
  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice
          }
        }
      ]
    }).then((orderId) => {
      return orderId
    })
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap()
      refetch()
      toast.success("Order Delivered")
    } catch (err) {
      toast.error(err?.data?.message || err.message)
    }
  }

  return (
    isLoading ? (<Loader />) :
      error ? (<Message variant="danger" />) :
        (
          <>
            <Meta title={`Adhunika | Checkout-${order._id}`} />
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
                      (<Message variant="success">Delivered on {order.deliveredDate.substring(0, 10)}</Message>) :
                      (<Message variant="danger">Yet to be deliver.</Message>)
                    }
                    </p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p><b>Method: </b>{order.paymentMethod}</p>
                    {order.isPaid ? (
                      <Message variant="success">Paid on {order.paidAt.substring(0, 10)}</Message>
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
                    {!order.isPaid && order.paymentMethod !== "COD" ? (
                      <ListGroup.Item>
                        {loadingPay && <Loader />}
                        {isPending ? <Loader /> : (
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        )}
                      </ListGroup.Item>
                    ) : userInfo && userInfo.isAdmin && !order.isPaid && !order.isDelivered &&
                      <Button onClick={onApprovePayment} style={{ marginBottom: "10px" }} variant="dark">
                        Payment Received
                      </Button>
                    }
                    {loadingDeliver && <Loader />}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                      <ListGroup.Item>
                        <Button className="btn-secondary" onClick={deliverOrderHandler}>Mark As Delivered</Button>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </>
        )
  )
}

export default OrderScreen
