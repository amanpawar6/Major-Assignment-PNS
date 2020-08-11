const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    "email": String,
    "password": String,
    "name": String,
    "cmpny_name": String,
    "phone_no": Number,
    "address": String,
    "designation": String
})

employer = mongoose.model('employee', employerSchema);

module.exports = employer;