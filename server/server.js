import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "./db/connect.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connect();
}
);
