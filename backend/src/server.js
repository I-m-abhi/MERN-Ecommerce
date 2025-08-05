import app from "./app.js";
import connectMongoDB from "./config/db.js";
import Razorpay from 'razorpay';

import {v2 as cloudinary} from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Handle uncaught exceptions errors
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down the server due to uncaught exception");
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
  // headers: {
  //   "X-Razorpay-Account": "<merchant_account_id>"
  // }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});


// Handle unhandled promise rejections errors
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});