const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    "email": String,
    "password": String,
    "name": String,
    "age": Number,
    "SC": String,
    "SSC": String,
    "graduate": String,
    "masters": String,
    "phone_no": Number,
    "address": String,
    "lst_cmpny": String,
    "crt_cmpny": String,
})

employee = mongoose.model('employee', employeeSchema);

module.exports = employee;