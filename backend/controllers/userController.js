import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc   Auth user & get the token
//@route  POST /api/users/login
//@access Public
const authUser = asyncHandler (async (req, res)=>{
  const { email, password }= req.body;
  const user = await User.findOne({ email })

  if (user && (await user.checkPwd(password)) ){
    generateToken(res, user._id)

    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
  // res.send("Auth user.")
})

//@desc   Register user
//@route  POST /api/users
//@access Public
const registerUser = asyncHandler (async (req, res)=>{
  const { name, email, password } = req.body
  
  const userExists = await User.findOne({ email })
  if (userExists){
    res.status(400)
    throw new Error("User Already Exists")
  }
  const user = await User.create({
    name,
    email,
    password
  })
  if(user){
    generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(400)
    throw new Error("Invald User data")
  }
  // res.send("Register user.")
})

//@desc   Logout user /clear cookie
//@route  POST/api/users/logout
//@access Private
const logoutUser = asyncHandler (async (req, res)=>{
  res.cookie("jwt", "",{
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "Logged out Successfully!"})
  // res.send("Logout user.")
})

//@desc   GET user profile
//@route  GET/api/users/profile
//@access Private
const getUserProfile = asyncHandler (async (req, res)=>{
  // res.send("Get user Profile.")
  const user = await User.findById(req.user._id)

  if(user){
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404)
    throw new Error("User not found.")
  }
})

//@desc   Update user profile
//@route  PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler (async (req, res)=>{
  const user = await User.findById(req.user._id)

  if(user){
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if(req.body.password){
      user.password = req.body.password
    }
    
    const updateUser = await user.save()
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin
    })
  } else{
      res.status(404)
      throw new Error("User not found")
  }})

//@desc   GET Users
//@route  GET/api/users/
//@access Private/Admin
const getUsers = asyncHandler (async (req, res)=>{
  res.send("Get users.")
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