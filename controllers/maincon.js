
require('dotenv').config();//.env file
const Razorpay=require('razorpay');//Razorpay
const jwt=require('jsonwebtoken')//jsonWebToken
const bcrypt=require('bcrypt');//bcrypt
const AWS=require('aws-sdk');

const mongoose=require('mongoose');
const userSchema=require('../models/users');
const orderSchema=require('../models/orders');
const expenseSchema=require('../models/expense');



//singupformdata
exports.singupformdata= async (req,res,next)=>{
    const {name,phone,email,password}=req.body;  
    const bcryptPassword=await bcrypt.hash(password,10);
    try{
        const newUser= await new userSchema({
            name:name,
            phone:phone,
            email:email,
            password:bcryptPassword,
            gender: 'Male',
        }).save();
        res.status(200).send("Databace ok")
    }catch(err){
        console.log(err)
        res.status(404).send("Databace ok")
    }
}

//loginformdata
exports.loginformdata=async (req,res,next)=>{
    const {email,password}=req.body;
    try{
      const user= await userSchema.findOne({email:email})
      if(user){
        const validPassword=await bcrypt.compare(password,user.password);
         if(validPassword){  
            const jwtToken=jwt.sign({userid:user._id.toString()},'munisekhar',{expiresIn:'10m'}); 
            res.status(200)
            res.json(jwtToken);
         }else{
            res.status(401).json({status:401,masage:"password not mach"})
         }
      }else{
        res.status(404).json({status:404,masage:"Email not found"})
      }
    }catch(err){
    }
}

// expensepost
exports.createExpense=async(req,res,next)=>{
    const {expense,amount,type}=req.body;
    try{
        
        const newExpense= await new expenseSchema({
            expense:expense,
            amount:amount,
            type:type,
            user:req.userid                                                                                                                                                                                                                                   
        }).save()

        const userRecord = await userSchema.findById(req.userid);
        userRecord.expense.push(newExpense._id);
        userRecord.totalamount+=Number(amount)
        await userRecord.save();

        res.status(200).send({masage:"ok"});

    }catch(err){
        console.log(err)
        res.status(404).send({masage:"err"})
    }
}

//getDataExpenses
exports.userExpenses=async (req,res,next)=>{
   try{
    const page=req.params.page
    const start=(page-1)*4
    const data=await userSchema.findById(req.userid)
    .select('name')
    .populate(
        {
            path:'expense',
            select:'expense amount type',
            options:{ skip: start, limit: 4 }
        }
    )
    res.status(200).json(data);
   }catch(err){
    res.status(404).send(err)
   }
}

//expenseDelete
exports.deleteUserExpense=async (req,res,next)=>{
    const id=req.params.id;
    const userid=req.userid;
    try{
        const deleteExpense= await expenseSchema.findByIdAndDelete(id);
        const updateInUserSchema=await userSchema.findById(userid);
        updateInUserSchema.totalamount= updateInUserSchema.totalamount-deleteExpense.amount;
        updateInUserSchema.expense.pull(id);
        await updateInUserSchema.save();
        res.send(200);
    }catch(err){
        res.send(404)
    }
    
}


//leader board
exports.leaderboard=async (req,res,next)=>{
    try{
        const allUsers= await userSchema.find({})
        .select('name totalamount -_id')
        .sort({ totalamount: -1 })
            res.status(200).json(allUsers);
    }catch(err){
        console.log(err)
      res.status(404)
      res.send(err)
    }
}


//premium Razorpay
exports.premium= async (req,res,next)=>{
    var instance = new Razorpay({
        key_id:process.env.KEY_ID,
        key_secret:process.env.KEY_SECRET,
      });
    const amount=400*100;
   try{
    const order= await instance.orders.create ({amount,currency:"INR"})
 
    const newPrimium =  new orderSchema({
                orderId:order.id,
                status:"pending",
                user:req.userid
            })
       await newPrimium.save()
    
    res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency })
   }catch(err){
    console.log(err)
    res.status(500).json({ message: 'Something went wrong', error: err.message });
    
   }
}


//premiumok
exports.premiumUpdate=async (req,res,next)=>{
    const userid=req.userid;
    const {orderId,paymentId}=req.body;
    try{
        const order= await orderSchema.findOneAndUpdate({orderId:orderId},{paymentId:paymentId,status:'succuss'})
        const user=await userSchema.findByIdAndUpdate({_id:userid},{premium:true})
        res.status(200)
    }catch(err){
        res.status(404).json(err);
    }

} 



// expence download button
exports.createExpensFile=async(req,res,next)=>{
    const userid=req.userid;
    try{
     const data= await userSchema.findById(userid)
     .select('name')
     .populate('expense','expense amount type')
     const stringifiExpence= JSON.stringify(data);
    //  const randomString = crypto.randomBytes(16).toString('hex');
     const timestamp = Date.now();
     let fileNamen = `${timestamp},Expence.text`;
    //  const feeldname='';
     const fildUrl= await uploadS3Bucket(stringifiExpence,fileNamen)
    const user=await userSchema.findById(userid);
      user.expense_files.push(fildUrl)
      await user.save()
     res.status(200).json({data,fildUrl});
    }catch(err){
        console.log(err)
     res.status(404).send(err);
    }
}

function uploadS3Bucket(data,filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const BUCKET_SECRET_KEY = process.env.BUCKET_SECRET_KEY;

   

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: BUCKET_SECRET_KEY,
    });

    return new Promise((resolve,reject)=>{
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
             ACL:'public-read'
        }

        s3bucket.upload(params,(err,data)=>{
            if(err){
                console.log('error getin',err)
                reject(err)
            }else{
               console.log(data)
               resolve(data.Location)
            }
        })
    })
}


exports.userAllFilse=async (req,res,next)=>{
   try{
  
    const userid=req.userid;
    const user = await userSchema.findById(userid)
    .select('expense_files')
    res.status(200).send(user)
   }catch(err){
   
   }
}