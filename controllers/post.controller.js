import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { cloudinaryUploader } from "../services/cloudinary.config.js";
import fs from 'fs/promises';

//user logs in
const login = async(req, res, next)=>{
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email:email});
        if (!user || user.password !== password){
            return res.send('user doesnt exist or invalid credentials');
        }
        const payload = {userId:user.id}
        const options = {expiresIn:'24hr'}
        const token= jwt.sign(payload, process.env.SECRET_KEY, options);
        return res.cookie(
             'token', token,
            {maxAge:1200000*24,
            secure:true,
            httpOnly:true
            } 
        ).json({data:'cookie set successfully'});
    } catch (error) {
        next(error);
    }
}

//gets all posts
const allPosts = async(req, res, next)=>{
    try {
        const posts = await postModel.find();
            return res.json({Posts: posts, message:`posts are ${posts.length} in number`});
    } catch (error) {
        next(error);
    }
}

//endpoint to create post
const createPost= async(req, res, next)=>{
    try {
      const userObject = req.user; //checks for th user
      const payload = req.body; //checks for the body
      const files = req.files; //checks for files
      const userId = userObject.userId; //grabs user id
      const pics = []; //holds the path to the pictures
      const secureUrls = []; //holds the secure urls to the pictures in cloud

      if (!userId || !files || !payload) {
        throw new Error("user id not found try loggin in");
      }
      for (let pic of files) {
        pics.push(pic["path"]);
      }

      for (let i = 0; i < pics.length; i++) {
        const result = await cloudinaryUploader(pics[i], "post pictures");
        if(!result){
            await fs.unlink(pics[i]);
            throw new Error('upload not successful');
        }
        secureUrls.push(result["secure_url"]);
      }
      
      //modify payload to include pointers to images in the database
      payload["pictures"] = secureUrls;

      const newPost = new postModel({ ...payload, user: userId }); //we will see what happens here
      const savedPost = await newPost.save();

      //update for the related fields btw user and post model
      const foundUser = await userModel.findByIdAndUpdate(
        userId,
        { $push: { posts: savedPost } },
        { new: true }
      );
      return res.json({
        createdPost: savedPost,
        updatedUser: foundUser,
        message: "Post created and user updated",
      });
    } catch (error) {
        next(error);
    }
}

//get a particular post
const getPost= async(req, res, next)=>{
    try {
        const postIdObject = req.query;
        const userObject = req.user;
        const userId = userObject.userId;
        const postId = postIdObject.postId;
        if (!userId || !postId){
            return res.json({message:'user id not found or post Id not found'})
        }
        const foundUser =  await postModel.findById(postId);
            return res.json({data:foundUser, message:"a Post gotten"})
    } catch (error) {
        console.log('error happened in the get post controller')
        next(error);
    }
}

//delete a particular post
const deletePost= async(req, res, next)=>{
    try {
        const postIdObject = req.query;
        const postId = postIdObject.postId;

        if (!postId){
            throw new Error('post id not found');
        }

        const foundPost = await postModel.findById(postId);
        
        if(!foundPost){
            throw new Error('post not found');
        }
        // return res.send(`${foundPost._id} is the found post`);
        const deletedPost = await postModel.findByIdAndDelete(postId);
      

        //update user model
        const updatedUser = await userModel.findByIdAndUpdate(foundPost.user, {$pull:{posts:foundPost._id}});
        return res.json({deletedPost:deletedPost, updatedUser:updatedUser, message: "a Post deleted"});
    } catch (error) {
        console.log('something happened in the deletepost endpoint');
        next(error);
    }
}

export {
    allPosts,
    createPost,
    getPost,
    deletePost,
    login
}