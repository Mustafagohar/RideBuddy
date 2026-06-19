import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import vendorRoute from "./routes/venderRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";

dotenv.config();

const App = express();

App.use(express.json());
App.use(cookieParser());

App.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

mongoose
  .connect(process.env.mongo_uri)
  .then(() => console.log("connected"))
  .catch((error) => console.error(error));

App.get("/", (req, res) => {
  res.send("Backend Running");
});

App.get("/test", (req, res) => {
  res.send("Test Route Working");
});

console.log("AUTH ROUTE REGISTERING");

App.use("*", cloudinaryConfig);

App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin", adminRoute);
App.use("/api/vendor", vendorRoute);

App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

const port = process.env.PORT || 3000;

App.listen(port, () => {
  console.log(`server listening on ${port}`);
});
