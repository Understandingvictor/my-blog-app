import jwt from 'jsonwebtoken'

const verifyUser = (req, res, next)=>{
    try {
        const cookie = req.cookies;
        if(!cookie.token){
            throw new Error("session expired, pls login");
        }

        const token = cookie.token; //actual token
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded)=>{
            if(error){
                return next(error);
            }
            req.user = {userId:decoded.userId};
            next();
        })   
        
    } catch (error) {
        throw new Error(error.message);
    }
}
export default verifyUser;