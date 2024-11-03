import React from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import FormContainer from "../../components/FormContainer"
import Meta from "../../components/Meta"
import { toast } from "react-toastify"
import { useUpdateAnyProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from "../../slicers/productApiSlice"
import { FaCheck, FaCopy } from "react-icons/fa"

const ProductEditScreen = () => {
  const {id: productId } = useParams()

  const [name, setName] = useState("")
  const [price, setPrice] = useState()
  const [category, setCategory] = useState("")
  const [countInStock, setStockCount] = useState()
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
  const [updateAnyProduct, {isLoading: loadingUpdate}] = useUpdateAnyProductMutation()
  const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation()
  const navigate = useNavigate()

  const submitHandler = async (e)=>{
    e.preventDefault()
    try {
      await updateAnyProduct({productId, name, price, category, countInStock, description, image}).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(()=>{
    if(product){
      setName(product.name)
      setPrice(product.price)
      setCategory(product.category)
      setStockCount(product.countInStock)
      setDescription(product.description)
      setImage(product.image)
    }
  },[product, productId])

  const uploadFileHandler = async (e)=>{
    const formData = new FormData()
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap()
      toast.success(res.message)
      setImage(res.secure_url)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const copyHandler = () => {
    try {
      navigator.clipboard.writeText(image)
      toast.success("URL Copied to Clipboard Successfully")
      setIsCopied(true)
    } catch (err) {
      toast.error("Failed to copy the text")
    }
    setTimeout(() => {
      setIsCopied(false)
    }, 6000);
  }

  return (
    <>
    <Meta title={`Admin | ${name} | Adhunika`}/>
      <Link to="/admin/productlist" className="btn btn-light my-3">Go back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {loadingUpload && <Loader />}
        {isLoading ? <Loader />: 
        error ? <Message variant="danger">{error}</Message>:(
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-3" >
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price" className="my-3">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e)=>setPrice(Math.abs(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="image" className="my-3">
              <Form.Label>Product Image URL</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  placeholder="Image url"
                  value={image}
                  readOnly
                  onChange={(e)=>setImage()}
                />
                <span
                  onClick={copyHandler}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: isCopied ? "none" : "auto"
                  }}
                >{isCopied ? <FaCheck /> : <FaCopy />}</span>
              </div>
              <Form.Control
                type="file"
                label="Upload File"
                onChange={uploadFileHandler}
              />
            </Form.Group>
            <Form.Group controlId="category" className="my-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Category"
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="stock" className="my-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Product Stock Count"
                value={countInStock}
                onChange={(e)=>setStockCount(Math.abs(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="description" className="my-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea" 
                rows={3}
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
