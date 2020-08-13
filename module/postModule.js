const postmodel=require('../models/postModel');
const empmodel=require('../models/empModel');
//const { logincheckUserInfo } = require('./middleWares');

function savePost(req,res,next){
    let postdetails = req.body;
    

    var postdata = new postmodel(postdetails);
    postdata.save(function (error, response) {
        if (error) {
            return res.status(422).send({
                message: error
            });
        }

        res.status(200).send("<alert>post saved</alert>");
        res.end();

    });
}

module.exports={savePost}