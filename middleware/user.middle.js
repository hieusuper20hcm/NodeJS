const md5 = require('md5')
const User=require('../model/user.model')

module.exports.postCreate= async function(req,res,next){
    let errors=[];
    const user=await User.findOne({email:req.body.email});
    const phongeRegex=/^0(?=.+[0-9]).{9}$/
    const nameRegex=/^\b[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ ]+.{5}$/
    if(!req.body.name){
        errors.push('Name is not required')
    }else if(nameRegex.test(req.body.name.trim())===false){
        errors.push('Name is wrong format(At least 5 letters alphabet)')
    }
    if(!req.body.phone){
        errors.push('Phone is not required')
    }else if(phongeRegex.test(req.body.phone)===false){
        errors.push('Phone is wrong format')
    }
    if(!req.body.email){
        errors.push('Email is not required')
    }else if(user){
        errors.push('Email was existed')
    }
    if(!req.body.password){
        errors.push('Password is not required')
    }
    if(errors.length>0){
        res.render('users/create',{
            errors: errors,
            values: req.body
        })
        return;
    }
    next();
}
module.exports.postUpdate= async function(req,res,next){
    var user=await User.findOne({_id: req.params.id});
    let errors=[];
    const phongeRegex=/^0(?=.+[0-9]).{9}$/
    const nameRegex=/^\b[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ ]+.{5}$/
    if(!req.body.name){
        req.body.name=user.name;
    }else if(nameRegex.test(req.body.name.trim())===false){
        errors.push('Name is wrong format(At least 5 letters alphabet)')
    }
    if(!req.body.phone){
        req.body.phone=user.phone;
    }else if(phongeRegex.test(req.body.phone)===false){
        errors.push('Phone is wrong format')
    }
    if(errors.length>0){
        res.render('users/update',{
            errors: errors,
            user: user
        })
        return;
    }
    if(req.body.email!==user.email){
        req.body.email=user.email
    } 
    if(req.file){
        req.body.avatar=req.file.path.split('\\').splice(1).join('/');
    }
    
    if(!req.body.password){
        req.body.password=user.password;
    }
    if(req.body.password!==user.password){
        req.body.password=md5(req.body.password);
    }
    next();   
}


