import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc   Fetch all Products
//@route  GET /api/products
//@access Public
const getProducts = asyncHandler (async (req, res)=>{
  const pageSize = 4;
  const page = Number(req.query.pageNumber);
  const keyword = req.query.keyword ? {name: {$regex: req.query.keyword, $options: "i" }} : {}

  const count = await Product.countDocuments({...keyword})
  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));
  
  res.json({products, page, pages: Math.ceil(count/pageSize)})
})

//@desc   Fetch a single Product
//@route  GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res)=>{
  const product = await Product.findById(req.params.id);
  
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Resource Not Found")
    }
})

//@desc   Create a Product
//@route  POST /api/products
//@access Private/Admin
const createProduct = asyncHandler (async (req, res)=>{
  const products = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description"
  });
  const createdProduct = await products.save()
  res.status(201).json(createdProduct)
})

//@desc   update a Product
//@route  PUT /api/products
//@access Private/Admin
const updateProduct = asyncHandler (async (req, res)=>{
  const { name, price, category, countInStock, description, image } = req.body
  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.image = image
    product.category = category
    product.countInStock = countInStock
    product.description = description

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404);
    throw new Error("Resource Not Found")
  }
})

//@desc   Delete a Product
//@route  DELETE /api/products
//@access Private/Admin
const deleteProduct = asyncHandler (async (req, res)=>{
  const product = await Product.findById(req.params.id)
  
  if (product) {
    await Product.deleteOne({_id: product._id})
    res.status(200).json({message: "Product Deleted Successfully"})
  } else {
    res.status(404);
    throw new Error("Resource Not Found")
  }
})

//@desc   Create a new Review
//@route  POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler (async (req, res)=>{
  const { rating, comment} =req.body
  const product = await Product.findById(req.params.id)
  
  if (product) {
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) {
      res.status(400)
      throw new Error("Product Already Reviewed")
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }
    product.reviews.push(review)
    product.numReviews = product.reviews.length

    product.rating = product.reviews.reduce((acc, review)=> acc + review.rating, 0)

    await product.save()
    res.status(201).json({message: "Reviewed the product successfully!"})
  } else {
    res.status(404);
    throw new Error("Resource Not Found")
  }
})

//@desc   Get top rated Product
//@route  GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res)=>{
  const products = await Product.find({}).sort({rating:-1}).limit(4);
  res.status(200).json(products)
})

//@desc   Fetch Product based on category
//@route  GET /api/products/category/:category
//@access Public
const getCategorisedProducts = asyncHandler(async (req, res)=>{
  const products = await Product.find({category : req.params.category})
  res.status(200).json(products)
})

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts, getCategorisedProducts };