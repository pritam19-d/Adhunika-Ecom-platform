import { Row, Col } from "react-bootstrap"
import { Link, useParams } from "react-router-dom";
import Product from "../components/Product";
import Message from "../components/Message.jsx";
import Paginate from "../components/Paginate.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
import Meta from "../components/Meta.jsx"
import { useGetProductsQuery } from "../slicers/productApiSlice.js";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams()
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber })

  return (
    <>
      <Meta title={"Adhunika"} />
      {!keyword ? <ProductCarousel /> :
        <Link to="/" className="btn btn-light mb-4">Go Back</Link>
      }
      {isLoading ? (
        <h2>Please Wait...</h2>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : <>
        <h1>Latest Products</h1>
        <Row>
          {data.products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ""} />
        <Row className="row-category">
          <h3 className="text-center">Categories</h3>
          <hr />
          {data.products.map((product) => (
            <Col key={product.category} sm={4} md={3} lg={2} xl={2} style={{ textAlign: "center" }}>
              <Link className="btn btn-outline-dark my-3 px-2 rounded fixed-height link-category" to={`/category/${product.category}`}>
                <h4 className="my-2">{product.category}</h4>
              </Link>
            </Col>
          ))}
          <hr />
        </Row>
      </>}
    </>
  )
}

export default HomeScreen
