import express from "express";
import 'dotenv/config';
import connectDB from "./config/db.js";
import products from "./data/products.js";
const PORT = process.env.PORT || 8000;

connectDB(); // Connect to MongoDB

const app = express();

app.get("/", (req,res)=>{
  res.send("Api is running..")
});

app.get("/api/products", (req, res)=>{
  res.json(products)
});

app.get("/api/products/:id", (req, res)=>{
  const product = products.find( p => p._id === req.params.id);
  res.json(product)
});


app.listen(PORT, ()=>console.log(`Server is runnning on port ${PORT}.`))









// console.log("Server is set up.");