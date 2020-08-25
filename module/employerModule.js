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

const posts = (req, res, send) => {
    var sampledata = [];
    let id = new ObjectID(req.id);
    connect.find({"requester": id,"status": "accepted"}).select('receiver').exec(function (err, data) {
        console.log(data);
       if(data.length > 0){
        for (let i = 0; i < data.length; i++) {
            empModel.findById(data[i].receiver).exec(async function (err, data) {

                let receiverarray = data.map(acceptedFriends => new ObjectID(acceptedFriends.receiver[0] + ""))
                await empdata.find({
                    "_id": {
                        $in: receiverarray
                    }
                }).exec(function (err, value) {
                    if (err) {
                        return res.status(422).send("something went wrong");
                    }
                    sampledata = value.map(r => r.posts);
                    console.log(sampledata);
                   return res.status(200).send(sampledata);
                })
            });
        }  
        }else{
            var msg = "No Posts are available"
            sampledata.push(msg);
            return res.status(200).send({msg : msg});
        }
       }        
    );
}

// const posts = (req, res, send) => {
//     let id = new ObjectID(req.id);
//     connect.find({
//         "requester": id,
//         "status": "accepted"
//     }, (err, data) => {
//         var friendsId = data.map(item => {
//             return item.receiver[0];
//         })
//         console.log(friendsId);
//         var friendsPosts = friendsId.map(item => {
//             var tempposts = []
//             empModel.findById(ObjectID(item), (err, data) => {
//                 if (err) {
//                     return res.send({
//                         msg: "err"
//                     })
//                 }
//                 if (data.post.length >= 1) {
//                     tempposts.push(data.post[0]);
//                 }
//             })
//             return tempposts;
//         })
//         console.log(friendsPosts, friendsPosts.length);
//     })
// }

// function displayposts(req, res, send) {
//     let id = req.id;//new ObjectID("5f33dfc211676830184588e6");
//     connect.find({
//             "requester": id,
//             "status": "accepted"
//         }

//     ).select('receiver').exec(async function (error, data) {

//         if (error) return console.log(error);

//         if (data.length > 0) {

//             let receiverIdArray = data.map(val => (val.receiver[0]));
//             console.log(receiverIdArray)
//             let postdata = await receiverIdArray.map(function (crr, index, arr) {
//                 let receiverid = receiverIdArray[index]
//                 empModel.findById(receiverid).select('post').exec(function (error, data) {
//                     if (error) return console.log(error);
//                         console.log(data.post);
//                 })
//             })
//         }
//     });
// }

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

const deletePreviousPicture = (req, res, next) => {
    var email = req.query.email;
    console.log(email);
    empModel.findOne({
        "email": email
    }, (err, data) => {
        if (err) {
            return res.status(500).send({
                message: error
            });
        }
        console.log(data);
        fs.unlink(data.image, function (err) {
            if (err) return res.status(422).send({
                msg: "something went wrong"
            })
            next();
            })
        })
}

function updatePicture(req, res, next) {
    employerDetails = req.file.path;
    let email = req.query.email;
    empModel.updateOne({
        "email": email
    }, {
        $set: {"image" : employerDetails}
    }, (error, data) => {
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
    posts,
    validatingImage,
    updateEmployer,
    updatePicture,
    deletePreviousPicture
}