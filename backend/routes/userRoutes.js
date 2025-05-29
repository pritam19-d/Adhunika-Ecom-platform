import express from "express";
const router = express.Router();
import { authUser,
  registerUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile, 
  getUsers, 
  getUsersByID, 
  deleteUser, 
  updateUsersByID,
  sendOtp,
  verifyOtp
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js"

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/logout", logoutUser);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/auth", authUser)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)
router.route("/:id").delete(protect, admin,  deleteUser).get(protect, admin, getUsersByID).put(protect, admin, updateUsersByID)

export default router