// const Sequelize=require('sequelize');
// const sequelize=require('../util/dbConection');

// const orders=sequelize.define('orders',{
  
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         unique:true,
//         primaryKey:true
//     },
//     orderId:{
//         type:Sequelize.String,
//         allowNull:false,
//     },
//     paymentId:{
//         type:Sequelize.String
//     },
//     status:{
//         type:Sequelize.String,
//         allowNull:false,
//     },
// });

// module.exports=orders;\

const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const schema= new Schema({
    orderId:{
        type:String,
        required:true
    },
    paymentId:{
        type:String
        
    },
    status:{
        type:String,
        required:true
    },
    user:{type:Schema.Types.ObjectId, ref:'User'}
});

module.exports=mongoose.model('Order',schema)