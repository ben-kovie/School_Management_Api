import express from "express"
import { testRoute } from "../controllers/testcontroller.js"

const router = express.Router()

router.get("/", testRoute)

export default router
