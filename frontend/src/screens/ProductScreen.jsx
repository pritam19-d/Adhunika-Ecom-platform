import { Link, useParams } from "react-router-dom"
import { Col, Row, Image, ListGroup, Card, Button } from "react-bootstrap"
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slicers/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

const ProductScreen = () => {

  const { id: productId } = useParams()
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)

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
      )}
    </div>
  )
}

export default ProductScreen
