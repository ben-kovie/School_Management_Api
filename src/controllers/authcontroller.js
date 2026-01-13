import User from "../models/userModel.js"
import ApiError from "../utils/ApiError.js"
import asyncWrapper from "../utils/asyncWrapper.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

export const register = asyncWrapper( async (req, res, next) =>{

 const { name, email, password, role } = req.body
  if (!name || !email || !password) {
      return next(new ApiError("All fields are required", 400))
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return next(new ApiError("User already exists", 400))
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
})


export const login = asyncWrapper( async (req, res, next) =>{

    const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const accessToken = signAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    id: user._id,
  });

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
  });

})


export const refreshAccessToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError("Refresh token required", 401));
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decoded) => {
      if (err) return next(new ApiError("Invalid refresh token", 403));

      const accessToken = signAccessToken({
        id: decoded.id,
      });

      res.status(200).json({
        success: true,
        accessToken,
      });
    }
  );
};

export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


