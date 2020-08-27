const Cart=require('../model/cart.model')
module.exports.postIndex= async function(req,res,next){
    let errors=[];
    const carts=await Cart.find({userId:req.signedCookies.userID})
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
    if(!req.body.address){
        errors.push('Address is not required')
    }
    if(errors.length>0){
        res.render('cart/index',{
            errors: errors,
            values: req.body,
            carts: carts
        })
        return;
    }
    next();
}