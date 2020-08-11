const jwt= require("jsonwebtoken");
const mongoose=require("mongoose");
const employeedata=require('../models/employeeModel');

function login(req,res,next){
    console.log(req.body);
    res.send(req.body);
}

function signup(req,res,next){
    let employeedetails = req.body;
        //req.body.email=req.body.email.toLowerCase();
        console.log(employeedetails);
        var employee = new employeedata(employeedetails);
        employee.save(function (error, response) {
            if (error) {
                return res.status(422).send({
                    message: error
                });
            }
            
            res.status(200).send(`employee registration successfull`);
            res.end();
        
    });
}

module.exports={
    login,
    signup
}