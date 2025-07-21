import User from "../models/user.model.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";

export const authenticateUser = handleAsyncError(async (req, res, next) => {
  const {token} = req.cookies;
  if(!token) {
    return next(new HandleError("Unauthorized access! Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  next();
})

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new HandleError(`Role - ${req.user.role} is not allowed to access this resource`, 403));
    }
    next();
  }
}
