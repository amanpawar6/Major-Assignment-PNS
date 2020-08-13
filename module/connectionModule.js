const connect = require('../models/connectionModel');
const empdata = require('../models/empModel');
const {
    getMaxListeners
} = require('../models/connectionModel');

function findFriends(req, res, next) {

    empdata.find({
        "name": req.body.name
    }).exec(function (error, data) {
        if (error) return res.status(500).send({
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
        if (error) return res.status().send()
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
    var id = req.id;

    connect.find({
        $and: [{
            "requester": "5f33e1617e6a7033a4fc8e82",
            "status": "pending"
        }]
    }).select('receiver').exec(function (err, data) {
        for(let i=0;i<data.length;i++){
            empdata.findById(data[i].receiver).exec(function(err,value){
                if(err)return console.log(err);
                 return res.status(200).send(value.name);
            })
                
            
        }
    });
}


function viewFriends(req, res, next) {
    var id = req.id;

    connect.find({
        $and: [{
            "requester": "5f33e1617e6a7033a4fc8e82",
            "status": "accepted"
        }]
    }).select('receiver').exec(function (err, data) {
        for(let i=0;i<data.length;i++){
            empdata.findById(data[i].receiver).exec(function(err,value){
                if(err)return console.log(err);
                return res.status(200).send(value.name);
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
    viewFriends,
    findIdfromemail

}