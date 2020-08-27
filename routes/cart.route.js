const express = require('express')
const cartController=require('../controller/cart.controller')
const cartMiddleware=require('../middleware/cart.middle')
const authMiddleware=require('../middleware/auth.middle')
const Mailing=require('../mailing')

const router = express.Router()

router.get('/',cartController.index);
router.post('/',authMiddleware.checkLogin,cartMiddleware.postIndex,cartController.postIndex);

router.get('/add/:productID',cartController.countCart,cartController.addCart);

router.post('/add/:productID',cartController.countCart,cartController.deleteCart)

module.exports = router