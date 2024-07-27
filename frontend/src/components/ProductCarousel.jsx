import React from 'react'
import { Link } from "react-router-dom"
import { Carousel, Image } from "react-bootstrap"
import Loader from "./Loader"
import Message from "./Message"
import { useGetTopProductsQuery } from "../slicers/productApiSlice"

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery()

  return (
    isLoading ? <Loader /> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> :
      <Carousel pause="hover" className="bg-dark mb-4" interval={3500}>
        {products.map(product => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <div className="d-inline-flex justify-content-between pr-2">
                <Image src={product.image} alt={product.name} style={{ height: "75vh", objectFit: "cover" }} fluid />
                <h4 style={{ textAlign: "right", textDecoration: "none" }} className="my-auto d-none d-md-block" >{product.description}</h4>
              </div>
              <Carousel.Caption className="carousol-caption">
                <h2>{product.name} at only <b>₹{product.price}</b></h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
  )
}

export default ProductCarousel
