import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
dotenv.config();
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { app, server } from './socketio/socket.js';
import path from 'path';

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOption = {
    origin: "http://localhost:5173",
    credentials:true
};
app.use(cors(corsOption));

app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
//npm run build npm run start

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
});