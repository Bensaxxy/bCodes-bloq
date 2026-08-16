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
app.use(helmet());
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = [process.env.FRONTEND_URL];
app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// API Endpoints
// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the bCodes - bloq");
});

// Authentication routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);

app.use("/api/admin", adminRouter);

app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`),
);
