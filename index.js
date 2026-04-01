import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";

import offlinePlansRoutes from "./routes/offlinePlans.js";

import bookingRoutes from "./routes/bookingRoutes.js"
import router from "./routes/userRoutes.js";
import admin from "./routes/adminRoutes.js";
import planRoutes from "./routes/planRoutes.js";



dotenv.config();
const app = express();

// ✅ Increase payload size limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ CORS configuration for credentials
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    // allow all origins dynamically
    callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/profile", profileRoutes);
app.use("/user", router);
app.use("/admin", admin);
app.use("/plans", planRoutes);
app.use("/bookings", bookingRoutes);
app.use("/api/offline-plans", offlinePlansRoutes);

// ✅ CHANGED: use MONGO_URI env variable (Atlas connection string)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});