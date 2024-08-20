const mongoose=require('mongoose');
const userSchema=require('../models/users');

const premium=async (req,res,next)=>{
    try{
        const user= await userSchema.findById(req.userid);
        if(user.premium){
            next();
        }
       
    }
    catch(err){
        res.send('notPremiumUser')
    }
}
module.exports=premium;