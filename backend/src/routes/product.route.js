import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProduct
} from "../controller/product.controller.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.user.js";

const router = express.Router();

router.post("/product/new", authenticateUser, authorizeRoles("admin"),  createProduct);
router.get("/products", authenticateUser, getAllProducts);
router.put("/product/update/:id", updateProduct);
router.delete("/product/delete/:id", deleteProduct);
router.get("/product/:id", getProductDetails);

export default router;