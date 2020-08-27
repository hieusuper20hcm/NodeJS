const express = require('express')
const multer  = require('multer')

const controller=require('../controller/managerProduct.controller')
const middleware=require('../middleware/managerProduct.middle')

const upload = multer({ dest: './public/uploads/' });

const router = express.Router();


router.get('/',controller.index);

router.get('/search',controller.search);

router.get('/create',controller.create);

router.post('/create',
 upload.single('img'),
 middleware.postCreate,
 controller.postCreate
);

router.get('/:id',controller.view);

router.post('/:id',controller.deleteView);

router.get('/update/:id',controller.update);
router.post('/update/:id',
 upload.single('img'),
 middleware.postUpdate,
 controller.postUpdate
);

module.exports = router