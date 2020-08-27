require('dotenv').config();

const express = require('express')
const socket=require('socket.io')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true},
  function (err, db) {
   if(err) console.log(err);
   else console.log("Connect is successfull")
});

const userRoutes=require('./routes/user.route')
const authRoutes=require('./routes/auth.route')
const productRoutes=require('./routes/product.route')
const cartRoutes=require('./routes/cart.route')
const managerProduct=require('./routes/managerProduct.route')
const managerCart=require('./routes/managerCart.route')
const authMiddle=require('./middleware/auth.middle')
const cartController=require('./controller/cart.controller');
let session=require('./middleware/session.middle')

let port=process.env.PORT || 3000

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use('/', express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(process.env.SESSION_SECRET))
app.use(session.session)
app.use(cartController.countCart)
app.use(authMiddle.userNav)

app.get('/',authMiddle.checkLogin,authMiddle.checkAdmin,function (req, res) {
  res.render('index')
});


app.use('/users',authMiddle.checkLogin,authMiddle.checkAdmin,userRoutes);
app.use('/auth',authRoutes);
app.use('/managerProduct',authMiddle.checkLogin,authMiddle.checkAdmin,managerProduct);
app.use('/managerCart',authMiddle.checkLogin,authMiddle.checkAdmin,managerCart)
app.use('/product',productRoutes);
app.use('/cart',cartRoutes);

const server=app.listen(port,function(){console.log("Sever is start in port 30000");})

let io=socket(server)
io.on('connection',function(socket){
  console.log(`Có người vừa kết nối, socketID: ${socket.id}`)
  socket.on('changeCount',cartController.updateCount )
})
module.exports.io=io