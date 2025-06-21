const jwt =require('jsonwebtoken');
exports.verifyToken=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token)return res.status(401).json({msg:'No token'});
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err)return res.status(403).json({msg:'Invalid token'});
        req.userId=decoded.indexOf;
        next();
    });

};