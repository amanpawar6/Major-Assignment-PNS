const express=require('express');
const router=express.Router();
const loginmodule=require('../module/employeeModule');
const middleware=require('../module/middleWares');
const postmodule=require('../module/postModule')
const connectionmodule=require('../module/connectionModule');


router.post('/login',middleware.logincheckUserInfo,loginmodule.login);
router.post('/signup',middleware.passwordHashing,loginmodule.signup);
router.post('/updateemployee',middleware.authenticateToken,loginmodule.updateEmployee);
//router.post('/updatepost',middleware.authenticateToken,postmodule.savePost);
//----------------------------connection------------------

router.post('/findfriend',connectionmodule.findFriends);
router.post('/addfriend',middleware.authenticateToken,connectionmodule.findIdfromemail,connectionmodule.addfriend);
router.post('/pendingrequest',middleware.authenticateToken,connectionmodule.findIdfromemail,connectionmodule.pendingFriends);
router.post('/acceptedrequest',middleware.authenticateToken,connectionmodule.findIdfromemail,connectionmodule.acceptedFriends);
router.post('/user/post',middleware.authenticateToken,middleware.checkpost,postmodule.savePost)

module.exports=router;
