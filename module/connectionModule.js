const connect = require('../models/connectionModel');
const empdata = require('../models/empModel');
var ObjectID = require('mongodb').ObjectID;


function findFriends(req, res, next) {

    empdata.find({
        "name": req.body.name
    }).exec(function (error, data) {
        if (error) return res.status(422).send({
            message: error
        });
        return res.status(200).send(data);
    })
}

function findIdfromemail(req, res, next) {
    let email = req.user.email;

    empdata.findOne({
        "email": email
    }).exec(function (error, response) {
        if (error) return res.status(422).send("something went wrong")
        if (response)
            req.id = response._id;
        next()
    })
}


function addfriend(req, res, next) {
    let id = new ObjectID(req.id);
    let receiverid = new ObjectID(req.body.id);
    var involveusers = {
        "requester": id,
        "receiver": receiverid,
        "status": "pending"
    }

    var connectedUsers = new connect(involveusers);
    connectedUsers.save(function (error) {
        if (error) {
            return res.status(422).send({
                msg: "somthing went wrong"
            });
        }
        return res.status(200).send({
            msg: 'friend request sent.'
        });
    });
}


function showPendingFriends(req, res, next) {
    let id = new ObjectID(req.id);

    connect.find({
        $and: [{
                "receiver": id
            },
            {
                "status": "pending"
            }
        ]
    }).select('requester').exec(async function (err, data) {
        let requesterarray = data.map(p => new ObjectID(p.requester[0] + ""))
        await empdata.find({
            "_id": {
                $in: requesterarray
            }
        }).exec(function (err, value) {
            if (err) {
                return res.status(422).send("something went wrong");
            }
            //sampledata = value.map(r => r.name);
            return res.status(200).send(value);

        })

    });
}


function showAcceptedFriends(req, res, next) {
    let id = new ObjectID(req.id);
    connect.find({
        $and: [{
                "requester": id
            },
            {
                "status": "accepted"
            }
        ]
    }).select('receiver').exec(async function (err, data) {
        for (let i = 0; i < data.length; i++) {
            if (err) return res.send(err)
            await empdata.findById(data[i].receiver).exec(async function (err, data) {

                let receiverarray = data.map(p => new ObjectID(p.receiver[0] + ""))
                await empdata.find({
                    "_id": {
                        $in: receiverarray
                    }
                }).exec(function (err, value) {
                    if (err) {
                        return res.status(422).send("something went wrong");
                    }
                    sampledata = value.map(r => r.name);
                    return res.status(200).send(sampledata);

                })

            });
        }
    });
}

function accepted(req, res, next) {
    let id = (req.id);
    let receiverid = (req.body.id);
    let status = "accepted";
    console.log(receiverid, id);
    connect.updateOne({
                "requester": id,

                "receiver": receiverid,

                "status": "pending"
            }

            , {
                $set: {
                    "status": status
                }
            })
        .exec(function (error, data) {
            console.log(data);
            if (error) return res.status().send("something went wrong");
            return res.status(200).send({
                msg: "friend request accepted"
            });
        });
}


function rejected(req, res, next) {
    let id = new ObjectID(req.id);
    let receiverid = new ObjectID(req.body.id);
    connect.updateOne({
            $and: [{
                    "requester": id
                },
                {
                    "receiver": receiverid
                },
                {
                    "status": "pending"
                }
            ]
        }, {
            $set: {
                "status": "accepted"
            }
        })
        .exec(function (error) {
            if (error) return res.status().send("something went wrong");
            return res.status(200).send({
                msg: "friend request rejected"
            });
        })
}



/* function getref(req, res, next) {
    let email = "p@gmail.com"
    empdata.findOne({
        "email": email //requesterUserEmail
    }).exec(function (error, data) {

            if (error) return res.status(500).send({
                message: error
            })
            var id=(`ObjectId("${data._id}")`).toString();

            console.log(id.toString());
         connect.findOne({}).populate('emp').exec(function(error,value){
            if (error) return res.status(500).send({
                message: error
            })
            console.log(value.receiver.email);
         }) 
        })
    } */

module.exports = {
    findFriends,
    addfriend,
    showPendingFriends,
    showAcceptedFriends,
    findIdfromemail,
    accepted,
    rejected
}