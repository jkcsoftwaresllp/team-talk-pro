const db =require('../config/db');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
exports.registerUser=(req,res)=>{
    const {username,email,password}=req.body;
    const hashed =bcrypt.hashSync(password,10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql,[username,email,hashed],(err)=>{
        if(err)return res.status(500).json({err});
        res.status(201).json({msg :'User registered'});
    });
};
exports.loginUser =(req,res)=>{
    const{email,password}=req.body;
    db.query('SELECT * FROM users WHERE email =?', [email],(err,results)=>{
        if(err || results.length===0)res.status(401).json({msg:'Invalid'});
        const user=results[0];
        if(!bcrypt.compareSync(password.user.password))
            return res.status(401).json({msg:'Invalid credentials'});
        const token =jwt.sign({id:user.id},process.env.JWT_SECRET);
        res.cookie('token',token,{ httpOnly:true}).json({user});
    });

};
exports.getProfile=(req,res)=>{
    db.query('SELECT id,username,email FROM users WHERE id =?',[req.userId],(err,results)=>{
        if(err)return res.status(500).json({err});
        res.json(result[0]);
    });
};

