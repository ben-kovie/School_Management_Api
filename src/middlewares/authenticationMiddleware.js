import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import ApiError from "../utils/ApiError.js"

export const protect = async (req, res, next) => {
  let token

  // 1️⃣ Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next(new ApiError("Not authorized, no token", 401))
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3️⃣ Get user from token
    const user = await User.findById(decoded.id)

    if (!user) {
      return next(new ApiError("User no longer exists", 401))
    }

    // 4️⃣ Attach user to request
    req.user = user
    next()
  } catch (error) {
    return next(new ApiError("Not authorized, token failed", 401))
  }
}

  