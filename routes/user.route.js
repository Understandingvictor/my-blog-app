import express from "express";
import {allUsers, createUser, getUser, deleteUser } from "../controllers/user.controller.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";
import { upload, multipleFilesField } from "../middlewares/uploads.middleware.js";

const multiplePicsAndField = multipleFilesField("profilePics", "backgroundPics");

const route = express.Router();

route.get('/user/allUsers',allUsers);
route.post('/user/createUser', multiplePicsAndField,  createUser);
route.get("/user/getUser", verifyUser, getUser);
route.delete('/user/deleteUser', verifyUser, isAdmin,  deleteUser );

export default route;