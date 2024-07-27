import React from 'react'
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button, Row, Col } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Paginate from "../../components/Paginate"
import Meta from "../../components/Meta"
import { toast } from "react-toastify"
import { useGetProductsQuery, useCreateProductMutation, useDeleteAnyProductMutation } from "../../slicers/productApiSlice"

const ProductListScreen = () => {
  const { pageNumber } = useParams()
  const { userInfo } = useSelector((state) => state.auth)

  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber })
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation()
  const [deleteAnyProduct, { isLoading: loadingDelete }] = useDeleteAnyProductMutation()

  const createProductHandler = async () => {
    if (window.confirm("Are you sure to create a new product?")) {
      try {
        await createProduct()
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete the product?")) {
      try {
        await deleteAnyProduct(id)
        toast.success("Successfully deleted the product from your database.")
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <div>
      <Meta title={"Admin | Product List | Adhunika"} />
      <Row className="align-items-center">
        <Col>
          <h1>All Products</h1>
        </Col>
        {userInfo && userInfo.isAdmin && (
          <Col className="text-end">
            <Button className="btn-sm btn-dark m-3" onClick={createProductHandler}>
              <FaEdit /> Create Product
            </Button>
          </Col>
        )}
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>STOCK COUNT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <a href={`/product/${product._id}`}>{product._id}</a>
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.countInStock}</td>
                  {userInfo && userInfo.isAdmin && (
                    <td>
                      <LinkContainer to={`/admin/products/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button variant="light" className="btn-sm mx-2" style={{ "color": "black" }} onClick={() => deleteHandler(product._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </div>
  )
}

export default ProductListScreen
