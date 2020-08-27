const Product=require('../model/product.model')

module.exports.postCreate= async function(req,res,next){
    let errors=[];
    let product= await Product.find();
    product=product.find(product=> product.name.toLowerCase()===req.body.name.toLowerCase());
    const priceRegex=/^[1-9](?=.+[0-9]).{3,}$/
    const nameRegex=/^\b[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ ]+\S$/
    if(!req.body.name){
        errors.push('Name is not required')
    }else if(nameRegex.test(req.body.name)===false){
        errors.push('Name is wrong format')
    }else if(product){
        errors.push('Name is was existed ')
    }
    if(!req.body.price){
        errors.push('Price is not required')
    }else if(priceRegex.test(req.body.price)===false){
        errors.push('Price is wrong format')
    }
    if(errors.length>0){
        res.render('managerProduct/create',{
            errors: errors,
            values: req.body
        })
        return;
    }
    next();
}
module.exports.postUpdate= async function(req,res,next){
    const products=await Product.findOne({_id: req.params.id});
    let errors=[];
    let product= await Product.find();
    product=product.find(product=> product.name.toLowerCase()===req.body.name.toLowerCase());
    const priceRegex=/^[1-9](?=.+[0-9]).{3,}$/
    const nameRegex=/^\b[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ ]+\S$/

    if(req.file){
        req.body.img=req.file.path.split('\\').splice(1).join('/');
    }
    if(!req.body.name || req.body.name.toLowerCase()===products.name.toLowerCase()){
        req.body.name=products.name;
    }else if(product){
        errors.push('Name is was existed ')
    }else if(nameRegex.test(req.body.name)===false){
        errors.push('Name is wrong format')
    }
    if(!req.body.price){
        req.body.price=products.price;
    }else if(priceRegex.test(req.body.price)===false){
        errors.push('Price is wrong format')
    }
    if(errors.length>0){
        res.render('managerProduct/update',{
            errors: errors,
            product:products
        })
        return;
    }

    // if(nameRegex.test(req.body.name)===false){
    //     errors.push('Name is wrong format')
    // }else if(product){
    //     errors.push('Name is was existed ')
    // }
    // if(priceRegex.test(req.body.price)===false){
    //     errors.push('Price is wrong format')
    // }
    // if(errors.length>0){
    //     res.render('managerProduct/create',{
    //         errors: errors,
    //         values: req.body
    //     })
    //     return;
    // }   
  
    next();   
}

