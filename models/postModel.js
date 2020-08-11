const mongoose = require('mongoose');

const postdetails = new mongoose.Schema({
    
    "userpost":String,
    "userid":String,
    "time":Date

});



post = mongoose.model('postdetails', postSchema);

module.exports = post;