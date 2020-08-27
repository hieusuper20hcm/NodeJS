const md5 = require('md5')
const socket=require('socket.io')
const User=require('../model/user.model')
const Cart=require('../model/cart.model')
const Product=require('../model/product.model')
const Bought=require('../model/bought.model')
let io=require('../index');
const e = require('express')

module.exports.updateCount= async function(data){
      await Cart.updateOne({_id:data.id}, {'cart.count':Number(data.count)})
      let countCart=0;
      let tongTien=0;
      const cart=await Cart.find({userId: data.userID})
      if(cart){
          cart.map(v=>{
              countCart+=v.cart.count
              tongTien+=v.cart.count*v.cart.price
          })
      }
     io.io.sockets.emit('updateMoney', {tongTien:tongTien,countCart:countCart});   
}

module.exports.index= async function(req,res){
    let carts=[]
    if(req.signedCookies.userID){
        const user=await User.findOne({_id:req.signedCookies.userID})
        carts=await Cart.find({userId:req.signedCookies.userID})
        res.render('cart/index',{
                carts:carts,
                values:user
        })
    }
    else if(!req.signedCookies.userID){
        req.signedCookies.userID=req.signedCookies.sessionID
        carts=await Cart.find({userId:req.signedCookies.userID})
        res.render('cart/index',{
            carts:carts,
            sessionID:req.signedCookies.sessionID
        })
    }
    
    
     
}
module.exports.countCart= async function(req,res,next){
    var countCart=0;
    var tongTien=0;
    let cart=[]
    if(!req.signedCookies.userID){
        cart=await Cart.find({userId: req.signedCookies.sessionID})
    }else{
        cart=await Cart.find({userId: req.signedCookies.userID})
    }
    
    if(cart){
        cart.map(v=>{
            countCart+=v.cart.count
            tongTien+=v.cart.count*v.cart.price
        })
    }
    
    res.locals.countCart=countCart
    res.locals.tongTien=tongTien
    next();
}

module.exports.addCart= async function(req,res){
    if(!req.signedCookies.userID){
        req.signedCookies.userID=req.signedCookies.sessionID
    }
    const query=[{'cart.productID':req.params.productID},{userId:req.signedCookies.userID}];
    const product=await Product.findOne({_id: req.params.productID})
    const cartItem=await Cart.find({userId:req.signedCookies.userID})
    const cart=await Cart.findOne({$and:query})
    let object={
        productID: product.id,
        nameProduct : product.name,
        price : product.price,
        img : product.img, 
        count: 1
    }
    if(cartItem.length>0)
    {
       if(cart){
            await Cart.updateMany({$and:query},{'cart.count':++cart.cart.count})
       }
       else{
           await Cart.create({
                userId:  req.signedCookies.userID,
                cart: object
            })
       }
    }
    else{
        await Cart.create({
                userId:  req.signedCookies.userID,
                cart: object
            })
    }

    //if()
        // await Cart.create({
        //     userId:  req.signedCookies.userID,
        //     cart: object
        // })
    // await Cart.updateMany({userId: user._id},{
    //     $addToSet: {
    //         cart: object
    //      }
    // })
    // await Cart.create({
    //     userId:  req.signedCookies.userID,
    //     cart,
    //})
    res.redirect('back')
}

module.exports.deleteCart= async function(req,res){
    if(!req.signedCookies.userID){
        req.signedCookies.userID=req.signedCookies.sessionID
    }
    const query=[{'cart.productID':req.params.productID},{userId:req.signedCookies.userID}];
    await Cart.deleteOne({$and:query},(err) => {
        if (err){
            console.log(err);
            return;
        }     
    })
    res.redirect('back')
}

module.exports.postIndex= async function(req,res){
    const carts=await Cart.find({userId:req.signedCookies.userID})
    const user=await User.findOne({_id:req.signedCookies.userID})
    let cartArr=carts.map(e=>{
        return e.cart
    })

    await Bought.create({
        userId:  req.signedCookies.userID,
        name:req.body.name,
        email:user.email,
        address:req.body.address,
        phone:req.body.phone,
        cart:cartArr
        // cart: [{
        //     productID:carts.cart.productID,
        //     name:carts.cart.productID,
        //     price:carts.cart.productID,
        //     img:carts.cart.productID,
        //     count:carts.cart.productID
        // }]
    })
    await Cart.deleteMany({userId:req.signedCookies.userID})
    res.send('Đặt hàng thành công')
}