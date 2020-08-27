const mongoose = require('mongoose')
const boughtSchema = new mongoose.Schema({
    userId: String,
    name:String,
    email:String,
    address:String,
    phone:String,
    cart: [{
        productID:String,
        nameProduct:String,
        price:Number,
        img:String,
        count:Number
    }],
    createDate: { type: Date, default: Date.now }
});
const Bought = mongoose.model('Bought', boughtSchema,'boughts');
module.exports=Bought;