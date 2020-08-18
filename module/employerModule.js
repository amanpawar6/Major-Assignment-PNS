const empModel = require('../models/empModel');
const connect = require('../models/connectionModel');
var validator = require("email-validator");
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');


function validatingEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatingPhone(phone) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
};

const validatingImage = (req, res, next) => {
    if (!(req.file)) {
        return res.send('Please select an image to upload');
    } else {
        next();
    }
}

const validatingDetails = (req, res, next) => {
    if (validatingEmail(req.body.email) && validatingPhone(req.body.phone_no)) {
        next();
    } else {
        fs.unlink(req.file.path, function (err) {
            if (err) return res.status(422).send({
                msg: "something went wrong"
            })
            return res.status(422).send({
                msg: 'Please Provide correct email or phone number'
            })
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
        res.status(200).send({
            msg: "data saved"
        });
    })
}

const providingUserInfo = (req, res, next) => {
    empModel.findById(req.id, (err, data) => {
        if (err) {
            return res.send(404);
        }
        return res.send(data);
    })
}

function displayposts(req, res, send) {
    let id = req.id; //new ObjectID("5f33dfc211676830184588e6");
    connect.find({
            "requester": id,
            "status": "accepted"
        }

    ).select('receiver').exec(async function (error, data) {

        if (error) return console.log(error);

        if (data.length > 0) {

            let receiverIdArray = data.map(val => (val.receiver[0]));
            console.log(receiverIdArray)
            let postdata = await receiverIdArray.map(function (crr, index, arr) {
                let receiverid = receiverIdArray[index]

            })

            empModel.findById(receiverid).select('post').exec(function (error, data) {
                if (error) return console.log(error);
                console.log(data.post);
            })
        }
    });
}

function updateEmployer(req, res, next) {

    let employerDetails = req.body;
    let email = req.user.email;
    empModel.updateOne({
        "email": email
    }, {
        $set: employerDetails
    }, function (error, data) {
        if (error) {
            return res.status(500).send({
                message: error
            });
        }
        return res.status(200).send(`user updated on id:${email}`);
    });
}

module.exports = {
    employerRegister,
    employerExists,
    providingUserInfo,
    validatingDetails,
    displayposts,
    validatingImage,
    updateEmployer
}


//----------------------------code for Displaypost-------------------

/* let receiverIdArray = data.map(val => (val.receiver[0]));
console.log(receiverIdArray)
let postdata = receiverIdArray.map(function (crr) {
    return CONVERTTHISTOOBJECTID(receiverIdArray)
})

empModel.find({
    $in: postdata
}).select('post').exec(function (error, data) {
    if (error) return console.log(error);
    console.log(data.post);
})
return mongoose.Types.ObjectId(receiverIdArray) */