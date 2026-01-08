import jwt from "jsonwebtoken"

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3d", // token expires in 1 day
  })
}
