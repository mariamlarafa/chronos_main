

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "./environment.config.js";
import { globalErrorHandler } from "./Utils/errorHandler.js";
import { handleError } from "./middleware/errors.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import projectTestRoutes from "./routes/test/project.test.route.js";
import phasesRoutes from "./routes/phase.route.js";
import lotRoutes from "./routes/lot.route.js";
import taskRoutes from "./routes/tasks.route.js"
import requestRoutes from "./routes/request.route.js"
// import passport from "passport";
// import { authUser } from "./controllers/auth/authentication.js";
import passport from "./controllers/auth/passport-config.js";
// import { User, UserProfile } from './db/relations.js';
import path from "path";
import leaveRoutes from "./routes/leave.route.js";
import remoteRoutes from "./routes/remote.route.js";
import { fileURLToPath } from "url";
const app = express();

// dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(handleError);
app.use(express.json());

app.use(passport.initialize());

//static routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDirectory = path.join(__dirname, "uploads");
// Serve uploaded files as static assets
app.use("/uploads", express.static(uploadsDirectory));
// api routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/phases", phasesRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/remote",remoteRoutes);
//testing routes
app.use("/api/projects/test", projectTestRoutes);

import "./db/relations.js";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,authorization,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const PORT = config.port
app.listen(PORT, () => console.log(`server running on post : ${PORT}`));
app.all("*", (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);
