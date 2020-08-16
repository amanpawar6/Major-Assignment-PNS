const bcrypt = require('bcrypt');
const empModel = require('../models/empModel');
const connect=require('../models/connectionModel')
var saltRounds = 15;
const jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
var validator = require("email-validator");


function passwordHashing(req, res, next) {
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
    let password = req.body.password;
    empModel.findOne({
        "email": useremail
    }).exec(async function (error, data) {
        if (error) return res.status(500).send({
            message: error
        });
        if (!data) {
            return res.status(404).send("<h1>not found</h1>");
        }
        req.session.compair = await bcrypt.compare(password, data.password);

        next();
    });
}


const authenticateToken = (req, res, next) => {
    
    try {
        
         const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "req.session.privatekey");
        req.user = {
            email: decodedToken.email
        };
        next();
    } catch (err) {
        res.status(401).json({
            message: "Auth failed!"
        });
    }

}

function checkpost(req, res, next) {
    if (!req.boby) {
        return res.status(422).send("nothing to post");
    }
}

function checkFriend(req, res, next) {
    let id=new ObjectID(req.id);
    let receiverid=new ObjectID(req.body.id);
    connect.findOne({
        $and: [{
            "receiver": receiverid},
            {"requester":id
        }]
    }, (err, data) => {
       if(data){
        if (err) {
            return res.status(500).send({msg:'somthing went wrong'});
        };

        if (data.status === "pending") {
            
            return res.status(200).send({msg:'friend request pending.'});
        }
        if (data.status === "rejected") {
            return res.status(200).send({msg:"this user rejected your request previously"})
        }
        if (data.status == "accepted") {
            return res.status(200).send({msg:"already friends"});
        }
    }
    next();
    
    })
}


module.exports = {
    passwordHashing,
    checkUserInfo,
    authenticateToken,
    checkpost,
    checkFriend,
}
