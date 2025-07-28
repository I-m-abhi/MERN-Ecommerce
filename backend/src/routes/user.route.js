import express from "express";
import {
  changeUserRole,
  deleteUser,
  getSingleUser,
  getUsersList,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  resetPasswordRequest,
  updatePassword,
  updateProfile,
  userProfile,
} from "../controller/user.controller.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authenticateUser, userProfile);
router.post("/profile/update", authenticateUser, updateProfile);
router.post("/password/forgot", resetPasswordRequest);
router.post("/reset/password/:token", resetPassword);
router.post("/update/password", authenticateUser, updatePassword);
router.get("/admin/users", authenticateUser, authorizeRoles("admin"), getUsersList);

router.route("/admin/user/:id")
  .post(authenticateUser, authorizeRoles("admin"), getSingleUser)
  .put(authenticateUser, authorizeRoles("admin"), changeUserRole)
  .delete(authenticateUser, authorizeRoles("admin"), deleteUser);

export default router;