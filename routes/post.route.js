import express from "express";
import { allPosts, createPost, getPost, deletePost, login } from "../controllers/post.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";
import isOwner from "../middlewares/deleteAuth.middleware.js";
import {upload} from "../middlewares/uploads.middleware.js";

const route = express.Router();

route.get('/post/allPosts', allPosts);
route.post('/post/createPost', verifyUser, upload.array('post-pictures', 5), createPost);
route.get('/post/getPost', verifyUser, getPost);
route.delete('/post/deletePost', verifyUser, isOwner, deletePost);
route.post('/login', login);

export default route;