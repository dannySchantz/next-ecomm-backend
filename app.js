import express from "express"
import usersRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
import imagesRouter from "./src/controllers/images.controllers.js"
import buyImagesRouter from "./src/controllers/buyImages.controllers.js"
import auth from "./src/middlewares/auth.js"
import cors from 'cors'
import morgan from "morgan"
// import * as Sentry from "@sentry/node";

// Sentry.init({ dsn: "https://examplePublicKey@o0.ingest.sentry.io/0" });

// // The request handler must be the first middleware on the app
// app.use(Sentry.Handlers.requestHandler());

// // All controllers should live here
// app.get("/", function rootHandler(req, res) {
//   res.end("Hello world!");
// });

// // The error handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler());

// // Optional fallthrough error handler
// app.use(function onError(err, req, res, next) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + "\n");
// });

const app = express()
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/images', imagesRouter)
app.use('/create-checkout-session', buyImagesRouter)


export default app