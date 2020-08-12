
const mongoose=require("mongoose");

const employeeSchema = new mongoose.Schema({
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
    "crt_cmpny": String
});

const employee = mongoose.model('employee', employeeSchema);

module.exports = employee;

