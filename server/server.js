import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import newsRoutes from "./routes/newsRoute.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// app.use("/api/upload", uploadRoutes);

dotenv.config();
db();
// import userRoutes from "./routes/userRoutes.js";
// app.use("/api/users", userRoutes);


const app = express();

// Middleware
app.use(cors());
// Do not add global express.json() to avoid breaking multipart requests

// Routes
app.use("/api/users", express.json(), express.urlencoded({ extended: true }), userRoutes);
app.use("/api/news", newsRoutes);
// Root check
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold)
);
