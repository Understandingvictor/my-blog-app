import express from "express";
import { allKyc, createKyc, deleteKyc, getKyc } from "../controllers/kyc.controller.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";

const route = express.Router()

route.get('/kyc/allKyc', verifyUser, isAdmin, allKyc);
route.post("/kyc/createKyc", verifyUser, isAdmin, allKyc);
route.delete("/kyc/deleteKyc", verifyUser, isAdmin, allKyc);
route.post("/kyc/getKyc", verifyUser, isAdmin, allKyc);

export default route;