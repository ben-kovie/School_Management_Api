import express from "express"
import testRoutes from "../routes/testRoutes.js"
import { globalErrorHandler } from "../middlewares/generalErrorHandler.js"

const app = express()

app.use(express.json())

app.use("/api/test", testRoutes)

app.use((req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server`))
  })

app.use(globalErrorHandler)

export default app
