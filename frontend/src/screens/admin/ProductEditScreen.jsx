import React from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import FormContainer from "../../components/FormContainer"
import { toast } from "react-toastify"
import { useUpdateAnyProductMutation, useGetProductDetailsQuery } from "../../slicers/productApiSlice"

const ProductEditScreen = () => {
  const {id: productId } = useParams()

  const [name, setName] = useState("")
  const [price, setPrice] = useState()
  const [category, setCategory] = useState("")
  const [countInStock, setStockCount] = useState()
  const [description, setDescription] = useState("")
  // const [image, setImage] = useState("")

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
  const [updateAnyProduct, {isLoading: loadingUpdate}] = useUpdateAnyProductMutation()
  const navigate = useNavigate()

  const submitHandler = async (e)=>{
    e.preventDefault()
    console.log(productId);

    const updatedProduct = {productId, name, price, category, countInStock, description}
    const result = await updateAnyProduct(updatedProduct)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Product Updated")
      navigate("/admin/productlist")
    }
  }

  useEffect(()=>{
    if(product){
      setName(product.name)
      setPrice(product.price)
      setCategory(product.category)
      setStockCount(product.countInStock)
      setDescription(product.description)
      // setImage(product.image)
    }
  },[product, productId])

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">Go back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? <Loader />: 
        error ? <Message variant="danger">{error}</Message>:(
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2" >
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price" className="my-2">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
              />
            </Form.Group>
            {/* IMAGE INPUT PLACEHOLDER */}
            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Category"
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="stock" className="my-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Product Stock Count"
                value={countInStock}
                onChange={(e)=>setStockCount(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description" className="my-2">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="dark"
              className="my-2"
              
            >Update</Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
