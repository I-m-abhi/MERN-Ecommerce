import express from "express";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import errorHandleMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

// Error Handling Middleware
app.use(errorHandleMiddleware);

export default app;