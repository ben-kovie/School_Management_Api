import User from "../models/userModel.js"
import ApiError from "../utils/ApiError.js"
import asyncWrapper from "../utils/asyncWrapper.js"
import crypto from "crypto";

export const forgotPassword = asyncWrapper( async ( req, res, next) => {

      const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
  
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    // Simulate email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/test/reset-password/${resetToken}`;
  
    res.status(200).json({
      success: true,
      message: "Password reset token generated",
      resetURL, // remove in production
    });
})


export const resetPassword = asyncWrapper( async ( req, res, next ) => {

     const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Token invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
})
