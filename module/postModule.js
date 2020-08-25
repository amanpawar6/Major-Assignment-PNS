//const postmodel=require('../models/empModel');
const empModel=require('../models/empModel');




function savePost(req,res,next){
    let postdetails = req.body.post;
    let email=req.user.email;
    console.log(postdetails, ">>>>>>", email)
    
    empModel.updateOne({
        "email": email
    }, {$set: {"post" : postdetails}}, function (error) {
        if (error) {
            return res.status(422).send("something went wrong")
        }
        return res.status(200).send(`post saved`);
    });      
}



module.exports={savePost}