import express from "express"
import testRoutes from "./routes/testRoutes.js"
import { globalErrorHandler } from "./middlewares/generalErrorHandler.js"
import {limiter} from "./middlewares/limiterMiddleware.js"
import authRoute from "./routes/authRoute.js"
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
// import hpp from "hpp";
import cors from "./config/core.js"


const app = express()
// app.use(express.urlencoded({ extended: true }))

// CORS (development)
app.use(cors)

 // express middleware for json files
app.use(express.json())

  // prevent injection of NOsql file into our database
// app.use(
//   mongoSanitize()
// );
 
  //limiter middleware to protect all routes from brute force
app.use("/api", limiter);

  // Avoid attack on restricted roles
// app.use(
//   hpp({
//     checkQueryString: false,
//   })
// );
  // Prevent XSS attacks
// app.use(xss());

  // routes
app.use("/api/v1/test", testRoutes)
app.use("/api/v1/auth", authRoute)

// handle unhandled routes
app.use((req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server`))
  })

// global error handler
app.use(globalErrorHandler)

export default app
