import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import { jwtAuthMiddleware } from './jwt.js';
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import db from './db.js'
import cors from 'cors';
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port = process.env.PORT || 6000;

app.use('/user', userRoutes);
app.use('/candidate', jwtAuthMiddleware, candidateRoutes);

app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
})