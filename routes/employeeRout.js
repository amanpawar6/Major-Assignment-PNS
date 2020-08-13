const express=require('express');
const router=express.Router();
const loginmodule=require('../module/employeeModule');
const middleware=require('../module/middleWares');
const employerModule = require('../module/employerModule');
var path = require('path');
var multer = require('multer');

const DIR = './uploads/';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {

        filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  }

const upload = multer({storage: storage, limits: {
    fileSize: 1024 * 1024 * 2
}, fileFilter : function(req, file, cb){
    checkFileType(file, cb);
  }}).single('image');



router.post('/login', middleware.checkUserInfo,loginmodule.login);
router.post('/signup', upload, employerModule.validatingDetails, employerModule.employerExists, middleware.passwordHashing, loginmodule.signup);
router.post('/updateemployee',loginmodule.updateEmployee);


module.exports=router;