import express, { application, text } from "express";
import cookieParser from "cookie-parser";
import kycRoute from './routes/kyc.route.js'
import postRoute from './routes/post.route.js'
import userRoute from './routes/user.route.js'
import uploadsRoute from './routes/formAndUpload.routes.js'
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

mongoose
.connect(process.env.DB_STRING)
.then(()=>console.log('database active'))
.catch((error)=>console.log('database error'));


app.use(express.json());
app.use(express.text({type:['text/plain', 'text/html', 'application/javascript', 'application/xml']}));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(postRoute);
app.use(userRoute);
app.use(kycRoute);
app.use(uploadsRoute);
app.use((error, req, res, next)=>{ //universal error handling middleware.
    return res.json({message:error.message});
})

app.listen(port, ()=>{
    console.log(`app is running on port ${port}`);
})

