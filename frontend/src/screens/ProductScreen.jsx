import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Col, Row, Image, ListGroup, Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slicers/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import { addToCart } from "../slicers/cartSlice.js";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] =useState(1);
  
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)
  
  const addToCartHandler = ()=>{
    dispatch(addToCart({ ...product, qty }))
    navigate("/cart")
  }
  return (
    <div>
      <Link className="btn btn-light my-3" to="/">Back</Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <Rating value={product.rating} text={`${product.numReviews} Person(s) have rated this product`} />
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                Price : ₹ {product.price}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              Description : {product.description}
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col><strong>₹ {product.price}</strong></Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col><strong>{product.countInStock > 0 ? "In Stock" : "Out Of Stock"}</strong></Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock >0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e)=> setQty(Number(e.target.value))}>
                          {[...Array(product.countInStock).keys()].map((n)=>(
                            <option key= {n+1} value={n+1}>{n}</option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    className="btn btn-dark"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >Add to Cart</Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default ProductScreen
