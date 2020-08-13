//const postmodel=require('../models/empModel');
const empmodel=require('../models/empModel');




function savePost(req,res,next){
    let postdetails = req.body;
    let email=req.user.email;
    
    empmodel.updateOne({
        "email": email
    }, {$set:postdetails}, function (error) {
        if (error) {
            return res.status(422).send("something went wrong")
        }
        return res.status(200).send(`post saved`);
    });      
}



module.exports={savePost}