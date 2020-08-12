var express = require('express');
var router = express.Router();
var employerDetails = require('../models/employer');


router.post('/login', function(req, res, next) {
    var body = req.body;
    console.log(body);
    if(body.role == "Employee"){
      console.log("hello Employee");
      return res.json(body);
    }else if(body.role == "Employer"){
      console.log("hello Employer");
      return res.json(body);
    }
});



module.exports = router;
