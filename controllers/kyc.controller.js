import kycModel from "../models/kyc.model.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";


const allKyc = async(req, res, next)=>{
 try {
        const kyc = await kycModel.find();
            return res.json({kyc: kyc, message:`kyc are ${kyc.length} in number`});
    } catch (error) {
        console.log('error in all kyc handle')
        next(error);
    }
}

const createKyc= async(req, res, next)=>{
    try {
        const {userId} = req.user;
        const reqObject = req.body;
        
        if (!reqObject.nationalId){
          throw new Error('national id not found');
        }
        const newKyc = new kycModel({...reqObject, user:userId});
        const savedKyc = await newKyc.save();

        //update user model
        const updatedUser = await userModel.findByIdAndUpdate(userId, {kyc:savedKyc}, {new:true});
            return res.json({savedKyc:savedKyc, updatedUser:updatedUser, message: "Kyc created"})
    } catch (error) {
        next(error);
    }
}

const getKyc= async(req, res, next)=>{
     try {
        const kycObject = req.query;
        if (!kycObject.kycId){
            throw new Error("kyc id not found");
        }
        const kycId = kycObject.kycId;
        const foundKyc = await kycModel.findById(kycId);
        if (!foundKyc){
            throw new Error("kyc not found");
        }
        return res.json({data: foundKyc, message: "a kyc gotten"})
    } catch (error) {
        console.log("error happened in get getkyc endpoint");
        next(error);
    }
}
const deleteKyc= async(req, res, next)=>{
 try {
         const kycObject = req.query;
         const {userId} = req.user;
          if (!kycObject.kycId){
            return res.json({message:"kyc id not found"})
        }
        const kycId = kycObject.userId;
        const deletedKyc = await kycModel.findByIdAndDelete(kycId);
        const updatedUser = await userModel.updateOne(userId, {$pull:{kyc:deletedKyc.id}})
            return res.json({deletedKyc:deletedKyc, updatedUser:updatedUser, message:"a kyc deleted"});
    } catch (error) {
        console.log("error happened in delete kyc endpoint");
        next(error);
    }
}
export {
    allKyc,
    createKyc,
    getKyc,
    deleteKyc
}