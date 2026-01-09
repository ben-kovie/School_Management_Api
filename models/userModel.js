import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // important
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

  },
  { timestamps: true }
)


// 🔐 Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
  
    this.password = await bcrypt.hash(this.password, 12)
  })


userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 mins

  return resetToken;
};

  
export default mongoose.model("User", userSchema)
