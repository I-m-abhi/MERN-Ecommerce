import app from "./app.js";
import connectMongoDB from "./config/db.js";

import dotenv from "dotenv";
dotenv.config({path: "./src/config/config.env"});

// Handle uncaught exceptions errors
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down the server due to uncaught exception");
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

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