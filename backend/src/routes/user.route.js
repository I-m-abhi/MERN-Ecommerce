import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  resetPasswordRequest,
  updatePassword,
  updateProfile,
  userProfile,
} from "../controller/user.controller.js";
import { authenticateUser } from "../middleware/auth.user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/profile", authenticateUser, userProfile);
router.post("/profile/update", authenticateUser, updateProfile);
router.post("/password/forgot", resetPasswordRequest);
router.post("/reset/password/:token", resetPassword);
router.post("/update/password", authenticateUser, updatePassword);

export default router;