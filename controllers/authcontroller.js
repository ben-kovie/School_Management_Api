import User from "../models/userModel.js"
import ApiError from "../utils/ApiError.js"
import asyncWrapper from "../utils/asyncWrapper.js"
import bcrypt from "bcryptjs"
import {signToken} from "../utils/jwt.js"

export const register = asyncWrapper( async (req, res, next) =>{

 const { name, email, password } = req.body
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

  const { email, password } = req.body

    if (!email || !password) {
      return next(new ApiError("Email and password are required", 400))
    }

    // Find user + select password explicitly
    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new ApiError("Invalid email or password", 401))
    }

    const token = signToken({ id: user._id, role: user.role })

    res.status(200)
    .json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    })

})