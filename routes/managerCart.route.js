const express = require('express')
const multer  = require('multer')

const controller=require('../controller/managerCart.controller')
// const middlewware=require('../middleware/managerCart.middle');

const router = express.Router();


router.get('/',controller.index);

router.get('/search',controller.search);

router.get('/:id',controller.view);

// router.post('/:id',controller.deleteView);


module.exports = router