import express from "express";
import { authenticateUser, authorizeRoles } from "../middleware/auth.user.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderDetails,
  updateOrderStatus
} from "../controller/order.controller.js";

const router = express.Router();

router.route("/new/order").post(authenticateUser, createOrder);
router.route("/admin/order/:id")
  .get(authenticateUser, authorizeRoles("admin"), getOrderDetails)
  .put(authenticateUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(authenticateUser, authorizeRoles("admin"), deleteOrder);
  
router.route("/my/orders").get(authenticateUser, getMyOrders);
router.route("/admin/orders").get(authenticateUser, authorizeRoles("admin"), getAllOrders);

export default router;