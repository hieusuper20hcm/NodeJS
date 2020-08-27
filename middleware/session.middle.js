const shortid=require('shortid')
module.exports.session=function(req,res,next){
    if(!req.signedCookies.sessionID){
        res.cookie('sessionID',shortid.generate(),{
            signed:true
        })
    }
    next()
}