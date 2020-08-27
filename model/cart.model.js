const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userId: String,
    cart: Object
    // productId:String,
    // name: String,
    // price: Number,
    // img: String
});
const Cart = mongoose.model('Cart', cartSchema,'carts');
module.exports=Cart;