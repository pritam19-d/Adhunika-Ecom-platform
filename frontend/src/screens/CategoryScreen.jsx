import React from 'react'
import Product from "../components/Product"
import { Row, Col } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Meta from "../components/Meta.jsx"
import { useGetCategorisedProductQuery } from "../slicers/productApiSlice"

const CategoryScreen = () => {
  const { category } = useParams()

  const { data, isLoading, error } = useGetCategorisedProductQuery(category)
  console.log("data", data);

  return (
    <>
      <Meta title={`Adhunika | ${category}`} />
      <h1>Category Screen</h1>
      <Link to="/" className="btn btn-light mb-4">Go Back</Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          {data.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default CategoryScreen
