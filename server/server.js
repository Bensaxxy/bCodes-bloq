import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import helmet from "helmet";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();

const port = process.env.PORT || 4000;

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Body parser
app.use(express.json());

// Cookies
app.use(cookieParser());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the bCodes - bloq API",
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);
app.use("/api/admin", adminRouter);

// Start server only after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();