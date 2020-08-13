const jwt = require("jsonwebtoken");
const empdata = require('../models/empModel');
const crypto=require('crypto');
const multer=require('multer');
const path=require('path');




function login(req, res, next) {
    let email=req.body.email;
    let password=req.body.password;
    req.session.privatekey=crypto.randomBytes(64).toString('hex');
    if (req.session.compair) {
       req.session.accesstoken = jwt.sign({
            "email": email,
            "password": password
        }, req.session.privatekey, {
            expiresIn: "120000s"
        });
        req.session.save();
        //console.log(req.session.accesstoken);
        return res.redirect('http://127.0.0.1:5500/views/search.html'); 
    } else {
        return res.status(401).send("invalid password");
    }

}


function signup(req, res, next) {
    let employeedetails = req.body;
    var empinfo = new empdata(employeedetails);
    console.log(empinfo);
    empinfo.save(function (error) {
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
   
    let employeeDetails = req.body;
    let email=req.user.email;
    console.log(email);
    empdata.updateOne({
        "email": email
    }, {$set:employeeDetails}, function (error, data) {
        if (error) {
            console.log(error);
        }
        return res.status(200).send(`user updated on id:${email}`);
    });
}

module.exports = {
    login,
    signup,
    updateEmployee,
   // upload
}