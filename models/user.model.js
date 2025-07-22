import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({

    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePics:{
        type: String,
        required:false
    },
    backgroundPics:{
        type:String,
        required:false
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    kyc:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Kyc',
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    }]
})

const userModel = mongoose.model('Users', userSchema);
export default userModel;