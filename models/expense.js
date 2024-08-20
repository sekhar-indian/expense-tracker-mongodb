// const Sequelize=require('sequelize');
// const sequelize=require('../util/dbConection');

// const expense=sequelize.define('dalyexpense',{
  
//     expense:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
//     dicription:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//     },
//     expenses:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     }
// });

// module.exports=expense;

const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const schema=new Schema({
    expense:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    user:{type:Schema.Types.ObjectId,ref:'User', required:true}
});

module.exports=mongoose.model('Expense',schema);