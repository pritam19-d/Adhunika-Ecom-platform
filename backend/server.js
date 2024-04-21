import express from "express";
import 'dotenv/config';
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js"
const PORT = process.env.PORT || 8000;

connectDB(); // Connect to MongoDB

const app = express();

app.get("/", (req,res)=>{
  res.send("Api is running..")
});

app.use("/api/products", productRoutes)

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, ()=>console.log(`Server is runnning on port ${PORT}.`))
