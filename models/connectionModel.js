var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var connectSchema = new mongoose.Schema({

    "requester":[{ type: Schema.Types.ObjectId, ref: 'emp' }],
    "receiver":[{ type: Schema.Types.ObjectId, ref: 'emp' }],
    "status":String


 });

const connectionmodel=mongoose.model("empconnection",connectSchema);

module.exports=connectionmodel;