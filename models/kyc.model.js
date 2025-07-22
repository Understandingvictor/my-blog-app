import mongoose, { Mongoose } from "mongoose";

const kycSchema = new mongoose.Schema({
    nationalId:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }
})

const kycModel = mongoose.model('Kyc', kycSchema);
export default kycModel;