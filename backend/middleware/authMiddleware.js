import jwt from 'jsonwebtoken'
import asyncHandler from "./asyncHandler.js"
import User from "../models/userModel.js"

//Protect Routes
const protect = asyncHandler(async (req, res, next)=>{
  let token = req.token.jwt
  if (token){
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select("-password")
      next()
    } catch (error) {
      res.status(401);
      throw new Error("Not authorised, token failed")
    }
  } else {
    res.status(401);
    throw new Error("Not authorised, no token")
  }
})

// Admin routes
const admin  = (req, res, )=>{
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401);
    throw new Error("Not authorised as admin")
  }
}

export { protect, admin }