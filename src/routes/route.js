const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController=require('../controllers/productController')
const cartController=require('../controllers/cartController')
const orderController=require('../controllers/orderController')

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
router.get('/products',productController.getproduct)
router.get('/products/:productId',productController.getProductsById)
//-----------------FOURTH API UPDATE PRODUCT DETAIL
router.put('/products/:productId',productController.updateProduct)


//-----------------FIFTH API DELETE PRODUCT FROM DB
router.delete('/products/:productId',productController.deleteProduct)


router.post('/users/:userId',myMiddleware.getUserDetails,cartController.createCartProduct)

//-----------------THIRD API GET CART DETAIL

router.put('/users/:userId/cart',myMiddleware.getUserDetails,cartController.updateCart)
router.get('/users/:userId/cart',myMiddleware.getUserDetails,cartController.getCartList)

router.delete('/users/:userId/cart',myMiddleware.getUserDetails,cartController.deleteCart)


router.post('/users/:userId/orders',myMiddleware.getUserDetails,orderController.createOrder)

router.put('/users/:userId/orders',myMiddleware.getUserDetails,orderController.updateOrder)




//---------------------------GENERATE S3 URL----------------------------//
//router.post('/write-file-aws',awsController.userAws)

module.exports = router;