import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use('/',router)
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const MONGO_URI =
"mongodb+srv://harshvardhan23007:CCIM9wiy5Mb5cVrJ@cluster0.ywqrmk4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error");
  process.exit(1);
});
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});
