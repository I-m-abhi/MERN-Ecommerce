import HandleError from "../utils/handleError.js";

export default  (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle specific errors
  // if (err.name === "ValidationError") {
  //   const message = Object.values(err.errors).map(val => val.message).join(", ");
  //   err = new HandleError(message, 400);
  // }

  // Cast errors for invalid ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new HandleError(message, 400);
  }

  if(err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered. Please Login with the existing credentials.`;
    err = new HandleError(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
}