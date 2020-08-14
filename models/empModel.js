const mongoose=require("mongoose");

const empSchema = new mongoose.Schema({
    "email": String,
    "password": String,
    "name": String,
    "age": Number,
    "sc": String,
    "ssc": String,
    "graduation": String,
    "masters": String,
    "phone_no": Number,
    "address": String,
    "lst_cmpny": String,
    "crt_cmpny": String,
    "Designation": String,
    "image" : String,
    "post" : [{ 
        "post" : {type:String},
        "time" : { type : Date, default: Date.now }
    }]
});

const empModel = mongoose.model('emp', empSchema);

module.exports = empModel;