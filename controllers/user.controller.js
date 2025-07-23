import { profile } from "console";
import userModel from "../models/user.model.js";
import {cloudinaryUploader} from '../services/cloudinary.config.js';
import fs from 'fs/promises';

//gets all user
const allUsers = async(req, res, next)=>{
    try {
        const users = await userModel.find();
            return res.json({data:users, message: `users are ${users.length} in number`})
    } catch (error) {
        next(error);
    }

}

//creates user
const createUser = async(req, res, next)=>{
    try {
        const payload = req.body;
        const files = req.files;
        const userExisting = await userModel.findOne({email:payload.email});
        if (userExisting || !files){
           throw new Error ("user existing or file not found");
        }
        console.log(files["profilePics"][0].path);
        console.log(files["backgroundPics"][0].path);
        const profilePics =  await cloudinaryUploader(files["profilePics"][0].path, "PROFILE PICTURES");
        const backgroundPics = await cloudinaryUploader(files["backgroundPics"][0].path, "BACKGROUND PICTURES");
                    if (!profilePics || !backgroundPics){
                        await fs.unlink(files["profilePics"][0].path);
                        await fs.unlink(files["backgroundPics"][0].path);
                        throw new Error('upload unsuscessful');                                                                     
                    }
        console.log(files["profilePics"][0].path);
        console.log(files["backgroundPics"][0].path);

        //update body to include the pointer to the images in cloud
        payload["profilePics"] = profilePics.secure_url;
        payload["backgroundPics"] = backgroundPics.secure_url;

        console.log(payload, " is the updated payload");
        //console.log(profilePics.secure_url, backgroundPics.secure_url, " are the secure URLS");

        //creating instance and saving to database
        const newUser = new userModel({...payload});
        const savedUser = await newUser.save();
        return res.json({ createdUser: savedUser, message: "user created"})
    } catch (error) {
        await fs.unlink(files["profilePics"][0].path);
        await fs.unlink(files["backgroundPics"][0].path);
        console.log("error happened in created user endpoint");
        next(error);
    }
}

//get a particular user
const getUser = async(req, res, next)=>{
    try {
        const userObject = req.query;
        if (!userObject.userId){
            return res.json({message:"user id not found"})
        }
        const userId = userObject.userId;
        const foundUser = await userModel.findById(userId);
        if (!foundUser){
            return res.json({message:"user not found"});
        }
        return res.json({data: foundUser, message: "a user gotten"})
    } catch (error) {
        console.log("error happened in get user endpoint");
        next(error);
    }
}

//deletes a user
const deleteUser = async(req, res, next)=>{
    try {
         const userObject = req.query;
          if (!userObject.userId){
            return res.json({message:"user id not found"})
        }
        const userId = userObject.userId;
        const deletedUser = await userModel.findByIdAndDelete(userId);
            return res.json({data:deletedUser, message:"a user deleted"})
    } catch (error) {
        console.log("error happened in delete user endpoint");
        next(error);
    }
}

export {
    allUsers,
    createUser,
    getUser,
    deleteUser
}