import React from 'react'
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button, Row, Col } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"
import { useGetProductsQuery, useCreateProductMutation, useDeleteAnyProductMutation } from "../../slicers/productApiSlice"

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery()
  const [createProduct, { isLoading: loadingCreate}] = useCreateProductMutation()
  const [deleteAnyProduct, { isLoading: loadingDelete }] = useDeleteAnyProductMutation()

  const createProductHandler = async()=>{
    if(window.confirm("Are you sure to create a new product?")){
      try {
        await createProduct()
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const deleteHandler = async (id)=>{
    if(window.confirm("Are you sure to delete the product?")){
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
      <Row className="align-items-center">
        <Col>
          <h1>All Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm btn-dark m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
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
              {products.map((product)=>(
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <LinkContainer to={`/admin/products/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button variant="light" className="btn-sm mx-2" style={{"color":"black"}} onClick={()=>deleteHandler(product._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  )
}

export default ProductListScreen
