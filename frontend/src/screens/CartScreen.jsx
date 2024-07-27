import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col, Row, Image, ListGroup, Card, Button } from "react-bootstrap";
import { FaTrash } from 'react-icons/fa';
import Message from "../components/Message";
import Meta from "../components/Meta.jsx";
import { addToCart, removeFromCart } from "../slicers/cartSlice.js";

const CartScreen = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  return (
    <Row>
      <Meta
        title={"Adhunika | Cart"}
      />
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        <hr />
        {cartItems.length === 0 ? (
          <Message>
            Your Cart is empty, <Link to={"/"}>Back to Shop</Link>.
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>
                      <b>{item.name}</b>
                    </Link>
                  </Col>
                  <Col md={2}>
                    ₹ {item.price}
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>{n + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    ><FaTrash /></Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal of <b>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</b> item(s).</h2>
              ₹ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block btn-dark"
                disabled={cartItems.length === 0}
                onClick={() => navigate("/login?redirect=/shipping")}
              >Proceed To Checkout</Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
