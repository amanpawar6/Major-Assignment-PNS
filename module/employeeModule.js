const jwt = require("jsonwebtoken");
const employeedata = require('../models/employeeModel');
const crypto=require('crypto');




function login(req, res, next) {
    req.session.privatekey=crypto.randomBytes(64).toString('hex');
    if (req.session.compair) {
       req.cookies.accesstoken = jwt.sign({
            "email": email,
            "password": password
        }, privatekey, {
            expiresIn: "120s"
        });
        return res.redirect('http://127.0.0.1:5500/views/dashBord.html'); 
    } else {
        return res.status(401).send("invalid password");
    }

}

function signup(req, res, next) {
    let employeedetails = req.body;
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

function updateEmployee(req,res,next){
    console.log("haklfjalfjlaf");
}

module.exports = {
    login,
    signup,
    updateEmployee
}