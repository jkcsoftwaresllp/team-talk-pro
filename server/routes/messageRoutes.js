const express=require('express');
const router =express.Router();
const db =require('../config/db');
router.get('/:chatId',(req,res)=>{
    const sql='SELECT * FROM messages WHERE chat_id=? ORDER BY created_at ASC';
    db.query(sql,[req.params.chatId],(err,results)=>{
        if(err)res.status(500).json(err);
        res.json(results)
    });
});
module.exports=router;