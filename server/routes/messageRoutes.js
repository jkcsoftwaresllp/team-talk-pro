const express=require('express');
const router =express.Router();
const db =require('../config/db');
router.get('/:chatId',(req,res)=>{
    const{page=1,limit=20}=req.query;
    const offset=(page - 1)*limit;
    const sql='SELECT * FROM messages WHERE chat_id=? ORDER BY created_at ASC';
    db.query(sql,[req.params.chatId,parseInt(limit),parseInt(offset)],(err,results)=>{
        if(err)res.status(500).json(err);
        res.json(results)
    });
});
module.exports=router;