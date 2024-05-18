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
  updateUsersByID
} from "../controllers/userController.js";

router.route("/").post(registerUser).get(getUsers);
router.post("/logout", logoutUser);
router.post("/login", authUser)
router.route("/profile").get(getUserProfile).put(updateUserProfile)
router.route("/:id").delete(deleteUser).get(getUsersByID).put(updateUsersByID)

export default router