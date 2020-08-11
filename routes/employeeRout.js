const express=require('express');
const router=express.Router();
const loginmodule=require('../module/loginModule')


router.post('/login',loginmodule.login);
router.post('/signup',loginmodule.signup);


module.exports=router;