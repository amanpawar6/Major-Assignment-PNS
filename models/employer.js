const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    "email": String,
    "password": String,
    "name": String,
    "Company_Name": String,
    "Phone_Number": Number,
    "Address": String,
    "Designation": String
})

employer = mongoose.model('employee', employerSchema);

module.exports = employer;