import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Col, Row, Image, ListGroup, Card, Button } from "react-bootstrap";
import { FaArrowCircleLeft } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slicers/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Meta from "../components/Meta.jsx";
import { addToCart } from "../slicers/cartSlice.js";
import { toast } from "react-toastify"

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
  const { userInfo } = useSelector((state) => state.auth)
  const [createReview, { isLoading: isReviewLoading }] = useCreateReviewMutation()

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate("/cart")
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      await createReview({
        productId,
        rating,
        comment
      }).unwrap()
      refetch()
      toast.success("Review Submitted!")
      setRating(0)
      setComment("")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/"><FaArrowCircleLeft /> Back</Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
        <Meta 
          title={`Adhunika | ${product.name}`}
          description={product.description}
        />
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
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}>
                            {[...Array(product.countInStock).keys()].map((n) => (
                              <option key={n + 1} value={n + 1}>{n + 1}</option>
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
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No reviewes on this product yet.</Message>}
              <ListGroup variant="flush">
                {product.reviews.map(review => (
                  <ListGroup.Item key={review._id}>
                    <b>{review.name}</b>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                  <ListGroup.Item>
                    {isReviewLoading && <Loader />}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="rating" className="my-2">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={e => (setRating(Number(e.target.value)))}
                          >
                            <option value="">Select</option>
                            <option value="1">1 Star - Poor</option>
                            <option value="2">2 Star - Fair</option>
                            <option value="3">3 Star - Good</option>
                            <option value="4">4 Star - Very Good</option>
                            <option value="5">5 Star - Excellent Product</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="comment" className="my-2">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </Form.Group>
                        <Button
                          disabled={isReviewLoading}
                          type="submit"
                          variant="dark"
                        >Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        You need to <Link to="/login">Sign in</Link> first, to write a review.
                      </Message>
                    )}
                  </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
