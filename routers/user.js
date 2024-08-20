const express=require('express');
const router=express.Router();
const maincon=require('../controllers/maincon');
const userAuthentication=require('../controllers/jwt');
const Password=require('../controllers/emailsend');//forgetpassword
const premium=require('../controllers/check-prime -user');

router.get('/userExpenses/:page',userAuthentication,maincon.userExpenses);
router.post('/singupformdata',maincon.singupformdata);
router.post('/loginformdata',maincon.loginformdata);
router.post('/createExpense',userAuthentication,maincon.createExpense);
router.get('/deleteUserExpense/:id',userAuthentication,maincon.deleteUserExpense);
router.get('/premium',userAuthentication,maincon.premium);
router.post('/premiumUpdate',userAuthentication,maincon.premiumUpdate);
router.get('/leaderboard',userAuthentication,premium,maincon.leaderboard);

router.get('/createExpensFile',userAuthentication,maincon.createExpensFile);
router.get('/userAllFilse',userAuthentication,maincon.userAllFilse);

// //password update 
router.post('/forget/password',Password.forget);
router.get('/forgetPasswordLink/:token',Password.forgetPasswordLink);
router.post('/resetPassword',Password.resetPassword);


module.exports=router;

