const bcrypt = require('bcrypt');
const employeedata = require('../models/employeeModel');
var saltRounds = 15;


function passwordHashing(req, res, next) {
    console.log("in passwordHashing");
    bcrypt.hash(req.body.password, saltRounds, function (error, hash) {

        if (error) return res.status(400).send({
            message: error
        });
        req.body.password = hash;

        next();
    });
}


function checkUserInfo(req, res, next) {

    let useremail = req.body.email;
    let password=req.body.password;
    employeedata.findOne({
        "email": useremail
    }).exec(async function (error, data) {
        if (error) return res.status(500).send({
            message: error
        });
        if (!data) {
            return res.status(404).send("<h1>not found</h1>");
        }
        req.session.compair= await bcrypt.compare(password,data.password);

        next();
    });
}


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send("Unauthorized")
    };
    jwt.verify(token,req.session.privatekey, (error, user) => {
        if (error) {
            return res.status(403).send({
                message: error
            })
        }
        req.user=user;
        next();
    });
}


module.exports = {
    passwordHashing,
    checkUserInfo,authenticateToken}