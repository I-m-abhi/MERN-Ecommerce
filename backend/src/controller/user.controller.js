import User from '../models/user.model.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import HandleError from '../utils/handleError.js';
import { sendToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

export const registerUser = handleAsyncError(async (req, res, next) => {
  const user = await User.create(req.body);

  sendToken(user, res, 201);
});

export const loginUser = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HandleError("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new HandleError("Invalid email or password", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new HandleError("Invalid email or password", 401));
  }

  sendToken(user, res, 200);
})

export const logoutUser = handleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
})

export const userProfile = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  })
})

// Forgot Password Send Email
export const resetPasswordRequest = handleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new HandleError("User not found with this email", 400));
  }

  let resetToken;
  try {
    resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(new HandleError("Error generating reset token", 500));
  }

  const resetPasswordUrl = `http://localhost/api/v1/reset/password/${resetToken}`;
  const message = `Use the following link to reset your password: ${resetPasswordUrl}. \n\n This link will expire in 5 minutes. \n\n If you did not request this, please ignore this email.`;
  try {
    sendEmail({
      email: user.email,
      subject: "Reset Password Request",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`
    })
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new HandleError("Error sending email", 500));
  }
})

export const resetPassword = handleAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if (!user) {
    return next(new HandleError("Reset Password Token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new HandleError("Passwords does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, res, 200);
})

export const updatePassword = handleAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findOne({ email: req.user.email }).select("+password");

  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    return next(new HandleError("Old password is incorrect", 401));
  }
  if (newPassword !== confirmPassword) {
    return next(new HandleError("New password and confirm password do not match", 400));
  }
  user.password = newPassword;
  await user.save();

  sendToken(user, res, 200);
})

export const updateProfile = handleAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    user
  });
})

// Admin:- Get All Users
export const getUsersList = handleAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  });
})

// Admin:- Get Single User Details
export const getSingleUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleError(`User doesn't exist with this id:${req.params.id}`, 400));
  }
  res.status(200).json({
    success: true,
    user
  });
})

// Admin:- Change User Role
export const changeUserRole = handleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, {
    new: true,
    runValidators: true,
  })
  if (!user) {
    return next(new HandleError("User not found", 400));
  }
  res.status(200).json({
    success: true,
    user
  })
})

// Admin:- Delete user profile
export const deleteUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new HandleError("User not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
})