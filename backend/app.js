import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
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

app.listen(() => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
});