import jwt from 'jsonwebtoken';

const jwtAuthMiddleware = (req, res, next)=>{

    //first check request headers has authorization or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error:'Token not found'});

    //Extract the jwt token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try{
        //verify the JWT 
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY)

        //Attach user information to the request object
        req.user = decoded;
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({
            error:'Invalid Token'
        })
    }

}
const generateToken = (userdata)=>{
    return jwt.sign(userdata, process.env.JWT_SECRETKEY, {expiresIn:'5d'});
}
export {jwtAuthMiddleware, generateToken};