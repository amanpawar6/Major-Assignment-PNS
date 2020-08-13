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
    console.log(req.id);
    console.log(req.body.id);
    var involveusers = {
        "requester": req.id,
        "receiver": req.body.id,
        "status": "pending"
    }
    var connectedUsers = new connect(involveusers);
    console.log(connectedUsers);
    connectedUsers.save(function (error) {
        if (error) {
            return res.status(422).send({
                message: error
            });
        }
        return res.status(200).send(`friend request sent. <a href=http://127.0.0.1:5500/views/dashBord.html></a>`);
    });
}


function pendingFriends(req, res, next) {
    var sampledata = [];
    connect.find({
        $and: [{
            "requester": req.id,
            "status": "pending"
        }]
    }).select('receiver').exec(async function (err, data) {
        let receiverarray = data.map(p => new ObjectID(p.receiver[0] + ""))
        console.log(receiverarray);
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


function acceptedFriends(req, res, next) {

    var sampledata = [];
    connect.find({
        $and: [{
            "requester": req.id,
            "status": "accepted"
        }]
    }).select('receiver').exec(function (err, data) {
        for (let i = 0; i < data.length; i++) {
            empdata.findById(data[i].receiver).exec(async function (err, data) {
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
    pendingFriends,
    acceptedFriends,
    findIdfromemail

}