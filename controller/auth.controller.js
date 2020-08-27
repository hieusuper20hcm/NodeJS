const md5 = require('md5')
const User=require('../model/user.model')
const { countCart } = require('./cart.controller')

module.exports.login=function(req,res){
     res.render('auth/index')
}
module.exports.postLogin= async function(req,res){
     res.redirect('/')
 }
 
module.exports.resetPassword=function(req,res){
     res.render('auth/resetPassword')
}
module.exports.postResetPassword= async function(req,res){;
        let users = {}
        users.password = md5(req.body.password)
        User.updateOne({email:req.body.email}, users, function(err,res) {
            if (err) throw err;        
        });
        res.redirect('/auth/login')
}

 module.exports.logOut=function(req,res){
    res.clearCookie('userID');
    res.redirect('back')
    // res.cookie('userID', {
    //     signed: false
    // });
    //res.render('auth/index')
 }