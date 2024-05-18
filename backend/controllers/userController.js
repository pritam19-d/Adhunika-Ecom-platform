import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

//@desc   Auth user & get the token
//@route  POST /api/users/login
//@access Public
const authUser = asyncHandler (async (req, res)=>{
  const { email, password }= req.body;

  const user = await User.findOne({ email })
  if (user && (await user.checkPwd(password)) ){
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
  res.send("Auth user.")
})

//@desc   Register user
//@route  POST /api/users
//@access Public
const registerUser = asyncHandler (async (req, res)=>{
  res.send("Register user.")
})

//@desc   Logout user /clear cookie
//@route  POST/api/users/logout
//@access Private
const logoutUser = asyncHandler (async (req, res)=>{
  res.send("Logout user.")
})

//@desc   GET user profile
//@route  GET/api/users/profile
//@access Private
const getUserProfile = asyncHandler (async (req, res)=>{
  res.send("Get user Profile.")
})

//@desc   Update user profile
//@route  PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler (async (req, res)=>{
  res.send("Update user Profile.")
})

//@desc   GET Users
//@route  GET/api/users/
//@access Private/Admin
const getUsers = asyncHandler (async (req, res)=>{
  res.send("Get users")
})

//@desc   GET Users by ID
//@route  GET/api/users/:id
//@access Private/Admin
const getUsersByID = asyncHandler (async (req, res)=>{
  res.send("Get user by ID")
})

//@desc   Delete Users
//@route  DLEETE/api/users/:id
//@access Private/Admin
const deleteUser = asyncHandler (async (req, res)=>{
  res.send("Delete user")
})

//@desc   Update Users by ID
//@route  PUT/api/users/:id
//@access Private/Admin
const updateUsersByID = asyncHandler (async (req, res)=>{
  res.send("Update user by id")
})

export { authUser, 
  registerUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile, 
  getUsers, 
  getUsersByID, 
  deleteUser, 
  updateUsersByID
};