import express from "express";
import {
  authenticateUser,
  authorizeRoles
} from "../middleware/auth.user.js";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getAllProducts,
  getProductReviews,
  getProductDetails,
  updateProduct,
  deleteReview
} from "../controller/product.controller.js";

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(authenticateUser, authorizeRoles("admin"), getAllProducts);

router.route("/admin/product/create").post(authenticateUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id")
  .put(authenticateUser, authorizeRoles("admin"), updateProduct)
  .delete(authenticateUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/product/review").put(authenticateUser, createProductReview);
router.route("/reviews")
  .get(getProductReviews)
  .delete(authenticateUser, deleteReview);


// router.post("/product/new", authenticateUser, authorizeRoles("admin"), createProduct);
// router.get("/products", authenticateUser, getAllProducts);
// router.put("/product/update/:id", updateProduct);
// router.delete("/product/delete/:id", deleteProduct);
// router.get("/product/:id", getProductDetails);

export default router;