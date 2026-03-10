import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';

const port = 8080;
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.send("Backend setup done");
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;       
    res.status(statusCode);
    res.json({
        message: err.message,
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});     


app.listen(port,()=>{
    console.log(`Server is running on port :${port}`);
});