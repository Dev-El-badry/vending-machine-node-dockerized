import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import compression from "compression";
import { adminRouter } from "./routes/admin.routes";
import { apiRouter } from "./routes/api.routes";
import { errorHandler } from "../engine/middlewares/error-handler";
import { UserDoc } from "./domains/users/models/user.models";

declare global {
  namespace Express {
    interface Request {
      user: UserDoc;
    }
  }
}

const app = express();
const xss = require("xss-clean");

app.set("trust proxy", true);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(helmet());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this API, please try again in an hour",
});
app.use("/api", limiter);
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

app.use(compression());

app.use("/admin", adminRouter);
app.use("/api/v1", apiRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("not found page");
});

app.use(errorHandler);
export { app };
