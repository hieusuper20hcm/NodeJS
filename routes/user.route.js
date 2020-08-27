const express = require('express')
const multer  = require('multer')

const controller=require('../controller/user.controller')
const middlewware=require('../middleware/user.middle');

const upload = multer({ dest: './public/uploads/' });

const router = express.Router();


router.get('/',controller.index);

router.get('/search',controller.search);

router.get('/:id',controller.view);


router.post('/:id',controller.deleteView);

router.get('/update/:id',controller.update);
router.post('/update/:id',
 upload.single('avatar'),
 middlewware.postUpdate,
 controller.postUpdate
);

module.exports = router