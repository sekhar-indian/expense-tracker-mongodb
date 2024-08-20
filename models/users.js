// const Sequelize=require('sequelize');
// const sequelize=require('../util/dbConection');

// const signupdata=sequelize.define('users',{
    // id:{
    //     type:Sequelize.INTEGER,
    //     autoIncrement:true,
    //     allowNull:false,
    //     unique:true,
    //     primaryKey:true
    // },
    // name:{
    //     type:Sequelize.String,
    //     allowNull:false,
    // },
    // phone:{
    //     type:Sequelize.String,
    //     allowNull:false,
    //     unique:true
    // },
    // email:{
    //     type:Sequelize.String,
    //     allowNull:false,
    //     unique:true
    // },
    // password:{
    //     type:Sequelize.String,
    //     allowNull:false
    // },
    // premium:{
    //     type: Sequelize.BOOLEAN,
    //     defaultValue: false
    // },
    // totalamount:{
    //     type:Sequelize.INTEGER,
    //     defaultValue:0
    // }


// });

// module.exports=signupdata;


const mongoose=require('mongoose');
const expense = require('./expense');
const Schema=mongoose.Schema;

const schema= new Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    premium:{
        type:Boolean,
        default:false
    },
    totalamount:{
        type:Number,
        default:0
    },
    expense:[{type:Schema.Types.ObjectId,ref:'Expense',required:true}],
    expense_files:[{type:String}]

}, { strict: false });

module.exports=mongoose.model('User',schema)