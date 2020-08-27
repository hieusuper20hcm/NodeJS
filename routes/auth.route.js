const express = require('express')
const multer  = require('multer')

const authMiddle=require('../middleware/auth.middle')
const authController=require('../controller/auth.controller')
const userController=require('../controller/user.controller')
const userMiddlewware=require('../middleware/user.middle');

const upload = multer({ dest: './public/uploads/' });

const router = express.Router()

router.get('/create',userController.create);

router.post('/create',
upload.single('avatar'),
userMiddlewware.postCreate,
userController.postCreate
);

router.get('/login',authController.login)
router.post('/login',authMiddle.postLogin,authController.postLogin)

router.get('/resetPassword',authController.resetPassword)
router.post('/resetPassword',
 authMiddle.postResetPassword,
 authController.postResetPassword
)

router.get('/logout',authController.logOut)

module.exports = router