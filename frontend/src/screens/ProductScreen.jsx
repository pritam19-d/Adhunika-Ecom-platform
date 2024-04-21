import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { Col, Row, Image, ListGroup, Card, Button } from "react-bootstrap"
import Rating from "../components/Rating"
import axios from "axios";

const ProductScreen = () => {
  const [product, setProduct ] = useState({})

  const { id: productId } = useParams()

  useEffect(()=>{
    const fetchProducts = async()=>{
      const { data } = await axios.get(`/api/products/${productId}`)
      setProduct(data)
    };

    fetchProducts()
  }, [productId])

  return (
    <div>
      <Link className="btn btn-light my-3" to="/">Back</Link>
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
              <ListGroup.Item>
                <Button
                  className="btn btn-dark"
                  type="button"
                  disabled={product.countInStock === 0}
                >Add to Cart</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProductScreen
