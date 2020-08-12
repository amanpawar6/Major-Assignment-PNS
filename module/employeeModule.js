const jwt = require("jsonwebtoken");
const employeedata = require('../models/employeeModel');
const crypto=require('crypto');




function login(req, res, next) {
    let email=req.body.email;
    let password=req.body.password;
    req.session.privatekey=crypto.randomBytes(64).toString('hex');
    if (req.session.compair) {
       req.cookies.accesstoken = jwt.sign({
            "email": email,
            "password": password
        }, req.session.privatekey, {
            expiresIn: "120s"
        });
        return res.redirect('http://127.0.0.1:5500/views/dashBord.html'); 
    } else {
        return res.status(401).send("invalid password");
    }

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname);
    }
});

var upload = multer({storage: storage}).single('image');



function signup(req, res, next) {
    let employeedetails = req.body;
    var employee = new employeedata(employeedetails);
    employee.save(function (error, response) {
        if (error) {
            return res.status(422).send({
                message: error
            });
        }

        res.status(200).send(`employee registration successfull. <a href=http://127.0.0.1:5500/views/login.html>Go to LOG IN</a>`);
        res.end();

    });
}

function updateEmployee(req,res,next){
    console.log("haklfjalfjlaf");
}

module.exports = {
    login,
    signup,
    updateEmployee
}