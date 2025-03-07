import express from "express";
import cookieParser from 'cookie-parser';
import connectDB from "./DB/db.js";
import userRoutes from "./Router/userRouter.js";
import cors from 'cors'
import ProjRouter from "./Router/projRouter.js";
const app = express();

// Allow CORS for all origins
app.use(cors({
    origin: "*",  // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true
}));

app.options("*", cors());  // Allow preflight requests for all routes


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB()


app.use('/user' , userRoutes)
app.use('/project', ProjRouter )

export default app;
