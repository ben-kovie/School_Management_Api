import ApiError from "../utils/ApiError.js"

export const restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError("You do not have permission to perform this action", 403)
        )
      }
      next()
    }
  }
  