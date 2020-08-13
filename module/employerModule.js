const empModel = require('../models/empModel');
const connect = require('../models/connectionModel');
var fs = require('fs');

function validatingEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatingPhone(phone){
	var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
	return re.test(phone);
};

const validatingDetails = (req, res, next) => {
    if(validatingEmail(req.body.email) && validatingPhone(parseInt(req.body.phone_no))){
        next();
    }
    else{
        fs.unlink(req.file.path, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            return res.send("Please Provide correct email or phone number")
        })
        
    }
}

var employerExists = (req, res, next) => {
    var body = req.body;
    empModel.find({
        "email": body.email
    }, (err, data) => {
        if (err) {
            return res.send(401)
        }
        if (data.length > 0) {
            fs.unlink(req.file.path, function (err) {
                if (err) throw err;
                console.log('File deleted!');
                return res.send(409, {
                    message: "user Already Exists"
                })
            })
        } else {
            next()
        }
    })
}

var employerRegister = (req, res, next) => {
    req.body.image = req.file.path;
    var employer = new empModel(req.body);
    employer.save((err, data) => {
        if (err) {
            return res.send(404, {
                message: "Not Found"
            })
        }
        req.session.user = data;
        console.log(data);
        res.send(200);
    })
}

const providingUserInfo = (req, res, next) => {
    var user = req.user;
    console.log(req.user);
    empModel.findById(user.id, (err, data) => {
        if(err){
            return res.send(404);
        }
        return res.send(data);
    })
}

const searchedPeople = (req, res, next) => {
    var user = req.user;
    var requestedUsers = req.query.name; 
    console.log(req.user);
    empModel.find({name : {'$regex': requestedUsers}}, (err, data) => {
        if(err){
            return res.send(404);
        }
        return res.send(data);
    })
}

const posts = (req, res, send) => {
    var user = req.user.id;
    connect.find({
        $and: [{
            "requester": "5f33e1617e6a7033a4fc8e82",
            "status": "accepted"
        }]
    }).select('receiver').exec(function (err, data) {
        for(let i=0;i<data.length;i++){
            empModel.findById(data[i].receiver).exec(function(err,value){
                if(err)return console.log(err);
                 return res.status(200).send(value.post);
            })
        }
    });
}

module.exports = {
    employerRegister,
    employerExists,
    providingUserInfo,
    validatingDetails,
    searchedPeople,
}