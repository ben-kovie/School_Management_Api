import express from "express"
import testRoutes from "../routes/testRoutes.js"
import { globalErrorHandler } from "../middlewares/generalErrorHandler.js"
import authRoute from "../routes/authRoute.js"

const app = express()

app.use(express.json())

app.use("/api/v1/test", testRoutes)
app.use("/api/v1/auth", authRoute)

app.use((req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server`))
  })

app.use(globalErrorHandler)

export default app
