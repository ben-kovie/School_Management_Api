import express from "express"
import { testRoute } from "../controllers/testController.js"
import { protect } from "../middlewares/authenticationMiddleware.js"
import {restrictTo} from "../middlewares/authorizationMiddleware.js"
import { forgotPassword, resetPassword } from "../controllers/resetPasswordController.js"
const router = express.Router()

router.get("/", testRoute)

// 🔐 Protected route (any logged-in user)
router.get("/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are logged in",
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    },
  })
})

// 🔒 Admin only
router.get(
  "/admin",
  protect,
  restrictTo("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    })
  }
)

router.post("/forgot-password", forgotPassword)
router.patch("/reset-password/:token", resetPassword)

export default router
