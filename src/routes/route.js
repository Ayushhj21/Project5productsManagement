const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController=require('../controllers/productController')

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
router.post('/products',productController.createProduct)

//-----------------FOURTH API UPDATE PRODUCT DETAIL
router.put('products/:productId',productController.getProductsById)

//-----------------FIFTH API DELETE PRODUCT FROM DB
router.delete('/products/:productId',productController.deleteProduct)



//---------------------------GENERATE S3 URL----------------------------//
//router.post('/write-file-aws',awsController.userAws)

module.exports = router;