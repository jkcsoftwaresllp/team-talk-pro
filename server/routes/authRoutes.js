const express = require('express');
const router =express.Router();
const {registerUser,loginUser,getProfile}=require('../controller/authController');
const {verifyToken }=require('../middleWare/auth');

router.post('/register',registerUser);
router.post('/login', loginUser);
router.get('/me',verifyToken,getProfile);
module.exports =router;
