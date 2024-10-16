import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOption = {
    origin: "http://localhost:5173",
    credentials:true
};
app.use(cors(corsOption));

const PORT = process.env.PORT || 3000;
app.listen(() => {
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
});