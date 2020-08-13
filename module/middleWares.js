const bcrypt = require('bcrypt');
const empdata = require('../models/empModel');
var saltRounds = 15;
const jwt=require('jsonwebtoken');


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


function logincheckUserInfo(req, res, next) {

    let useremail = req.body.email;
    let password=req.body.password;
    empdata.findOne({
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
    const authHeader = req.session.accesstoken;
    if (authHeader == null) {
        return res.status(401).send("Unauthorized")
    };
    jwt.verify(authHeader,req.session.privatekey, (error, user) => {
        if (error) {
            return res.status(403).send({
                message: error
            })
        }
        req.user=user;
        next();
    });
}
 function checkpost(req,res,next){
     if(!req.boby){
         return res.status(422).send("nothing to post");
     }
 }

module.exports = {
    passwordHashing,
    logincheckUserInfo,authenticateToken,checkpost}