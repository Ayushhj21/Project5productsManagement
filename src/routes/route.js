const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

const myMiddleware = require('../middlewares/authMiddleware')

//-----------------FEATURE I - USER API
//-----------------FIRST API CREATE USER
router.post('/user', userController.userRegistration)
//-----------------SECOND API USER LOGIN
router.post('/userlogin', userController.userLogin)
//-----------------THIRD API GET USER DETAILS
router.get('/user/:userId/profile',myMiddleware.getUserDetails,userController.getUserList)
//-----------------THIRD API UPDATE USER DETAILS
router.put('/user/:userId/profile',myMiddleware.getUserDetails,userController.updateUserList)

//-----------------FEATURE II - PRODUCT API
//-----------------FIRST API CREATE PRODUCT
//router.post('/products',myMiddleware.getUserDetails,productController.createProduct)



//---------------------------GENERATE S3 URL----------------------------//
//router.post('/write-file-aws',awsController.userAws)

module.exports = router;