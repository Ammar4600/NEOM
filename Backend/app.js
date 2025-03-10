import express from "express";
import cookieParser from 'cookie-parser';
import connectDB from "./DB/db.js";
import userRoutes from "./Router/userRouter.js";
import cors from 'cors'
import ProjRouter from "./Router/projRouter.js";
const app = express();

// Allow CORS for all origins
app.use(cors({
    origin: "http://localhost:5173", // Allows all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB()


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    
    next();
});
app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP", message: "Backend is running!" });
});


app.use('/user' , userRoutes)
app.use('/project', ProjRouter )

export default app;
