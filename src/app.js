import express from "express"
import testRoutes from "../routes/testRoutes.js"
import { globalErrorHandler } from "../middlewares/generalErrorHandler.js"
import {limiter} from "../middlewares/limiterMiddleware.js"
import authRoute from "../routes/authRoute.js"
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "../config/core.js"



const app = express()
app.use(express.urlencoded({ extended: true }))

// CORS (development)
app.use(cors)

 // express middleware for json files
app.use(express.json())
 
  //limiter middleware to protect all routes from brute force
app.use("/api", limiter);

  // prevent injection of NOsql file into our database
app.use(mongoSanitize());

  // Avoid attack on restricked roles
app.use(hpp());

app.use(xss());

  // routes
app.use("/api/v1/test", testRoutes)
app.use("/api/v1/auth", authRoute)
 
app.use((req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server`))
  })

app.use(globalErrorHandler)

export default app
