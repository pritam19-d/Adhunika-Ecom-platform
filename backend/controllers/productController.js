import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc   Fetch all Products
//@route  Get /api/products
//@access Public
const getProducts = asyncHandler (async (req, res)=>{
  const products = await Product.find({});
  res.json(products)
})

//@desc   Fetch a single Product
//@route  Get /api/products/:id
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

export { getProducts, getProductById, createProduct };