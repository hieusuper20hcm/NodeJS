const md5 = require('md5')
const User=require('../model/user.model')
const Cart=require('../model/cart.model')
module.exports.postLogin=async function(req,res,next){
    const email=req.body.email;
    const pass=req.body.password;
    const user= await User.findOne({email:email});
     if(!user){
         res.render('auth/index',{
             errors:[
                 "Email does not exist"
             ],
             values: req.body
         })
         return;
     }
     if(md5(pass)!=user.password){
         res.render('auth/index',{
             errors:[
                 'Password is wrong'
             ],
             values: req.body
         })
         return;
     }
     res.cookie('userID',user.id,{
         signed: true
     })
     next();
}

module.exports.checkLogin= async function(req,res,next){
   if(!req.signedCookies.userID){
       res.redirect('/auth/login')
       return;
   }
   const user= await User.findOne({_id:req.signedCookies.userID});
   if(!user){
    res.redirect('/auth/login')
    return;
   }
   if(await (await Cart.find({userId: req.signedCookies.sessionID})).length>0){
        await Cart.deleteMany({userId: req.signedCookies.userID})
    }
    await Cart.updateMany({userId: req.signedCookies.sessionID},
       {userId:req.signedCookies.userID}
       , function(err,res) {
       if (err) throw err;        
   }); 
   next(); 
}

module.exports.userNav=async function(req,res,next){
    const user= await User.findOne({_id:req.signedCookies.userID});
    res.locals.userNav=user
    next()
}

module.exports.postResetPassword=async function(req,res,next){
    const email=req.body.email;
    let user= await User.findOne({email:email});
     if(!user){
         res.render('auth/resetPassword',{
             errors:[
                 "Email does not exist"
             ],
             values: req.body
         })
         return;
     }
     
     if(req.body.phone!=user.phone){
         res.render('auth/resetPassword',{
             errors:[
                 'Phone is wrong'
             ],
             values: req.body
         })
         return;
     }
     if(!req.body.password){
        res.render('auth/resetPassword',{
            errors:[
                'Password is not required'
            ],
            values: req.body
        })
        return;
    }
    if(req.body.password!=req.body.passwordAgain){
        res.render('auth/resetPassword',{
            errors:[
                'Enter the password again is wrong'
            ],
            values: req.body
        })
        return;
    }

     next();
}

module.exports.checkAdmin= async function(req,res,next){
    const user= await User.findOne({_id:req.signedCookies.userID});
    if (user.status === true){
        next();
    }else{
        res.redirect('/product')
    }
}