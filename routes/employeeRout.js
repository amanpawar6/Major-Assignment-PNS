const express=require('express');
const router=express.Router();
const loginmodule=require('../module/employeeModule');
const middleware=require('../module/middleWares');


router.post('/login',middleware.checkUserInfo,loginmodule.login);
router.post('/signup',middleware.passwordHashing,loginmodule.signup);
router.post('/updateemployee',loginmodule.updateEmployee);


module.exports=router;