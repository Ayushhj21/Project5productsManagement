const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const validateBody = require('../validators/validator');

const createCartProduct = async function (req, res) {
    try {
        const userId = req.params.userId
        // console.log(userId)
        let tokenId = req.userId
        const productId = req.body.items[0].productId


        if (!(validateBody.isValidObjectId(userId) && validateBody.isValidObjectId(tokenId))) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        if (!(userId.toString() == tokenId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        if (!validateBody.isValidObjectId(productId)) {
            return res.status(404).send({ status: false, message: "productId is not valid" })
        }

        const requestBody = req.body
        if (!validateBody.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful creation" });
        }

        let { items } = requestBody
        if (!validateBody.isValidObjectId(userId)) {
            res.status(400).send({ status: false, msg: "Invalid user id" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            res.status(400).send({ status: false, msg: "user not found" })
        }
        const cartCheck = await cartModel.findOne({ userId: userId })
        // console.log("string3", cartCheck)  //This valid user id is giving us cart details we are creating
        // console.log("hii", items[0].quantity) //0th index se we are fetching quantity details
        // console.log("hii", items[0].productId) //0th index se we are fetching productId
        //cart not exists
        if (!cartCheck) { ///create cart
            const totalItems1 = items.length
            console.log(totalItems1, 'ashutosh')


            const product = await productModel.findOne({ _id: items[0].productId, isDeleted: false })

            if (!product) {
                return res.status(404).send({ status: false, message: "product don't exist or it's deleted" })
            }

            //console.log("producttt", product)

            const totalPrice1 = product.price * items[0].quantity //This is checking the quantity number which we are giving in postman and then will multiply it with product price.
           // console.log(totalPrice1, "LAAALA")

            const cartData = { items: items, totalPrice: totalPrice1, totalItems: totalItems1, userId: userId }
            //console.log("cart data:", cartData)
            const createCart = await cartModel.create(cartData)
            //console.log("string2", createCart)
            return res.status(201).send({ status: true, message: `cart created successfully`, data: createCart })
        }
        else {
            //add products in the cart
            console.log("hiiiii")
            const product = await productModel.findOne({ _id: items[0].productId }, { isDeleted: false })
            if (!product) {
                return res.status(404).send({ status: false, message: "product don't exist or it's deleted" })
            }
           // console.log("product", product)
            const totalPrice1 = cartCheck.totalPrice + (product.price * items[0].quantity) //Firstly this will go into the db and check the userid's total price and then add product's price in it with it's respective quantities
            console.log("totalprice", totalPrice1)
            console.log("String4", items[0].quantity)
            for (let i = 0; i < cartCheck.items.length; i++) {
                if (cartCheck.items[i].productId == items[0].productId) {
                    cartCheck.items[i].quantity = cartCheck.items[i].quantity + items[0].quantity
                    const response = await cartModel.findOneAndUpdate({ userId: userId }, { items: cartCheck.items, totalPrice: totalPrice1 }, { new: true })
                    return res.status(201).send({ status: true, message: `product added in the cart successfully`, data: response })
                }
            }
            const totalItems1 = items.length + cartCheck.totalItems
            console.log(totalItems1)

            const cartData = await cartModel.findOneAndUpdate({ userId: userId }, { $addToSet: { items: { $each: items } }, totalPrice: totalPrice1, totalItems: totalItems1 }, { new: true })
            return res.status(201).send({ status: true, message: `product added in the cart successfully1`, data: cartData })

        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }
}


const updateCart = async function (req, res) {
    try {
        const userId = req.params.userId
        const userIdFromToken = req.userId

        if (!validateBody.isValidObjectId(userIdFromToken)) {
            return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
        }
        if (!validateBody.isValidObjectId(userId)) {
            res.status(400).send({ status: false, msg: "Invalid user id" })
        }
        const user = await userModel.findById({ _id: userId })
        if (!user) {
            res.status(400).send({ status: false, msg: "user not found" })
        }
        if (userId.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });

        }
        //authentication required
        const requestBody = req.body
        let { productId, removeProduct, cartId } = requestBody
        const findCart = await cartModel.findOne({ _id: cartId })
        //console.log(findCart)
        if (!findCart) {
            return res.status(400).send({ status: false, message: `cart does not exist` })
        }

        const product = await productModel.findOne({ _id: req.body.productId, isDeleted: false })
        //console.log(product)

        if (removeProduct == 1) {
            //const totalItems1=findCart.totalItems-1
            for (let i = 0; i < findCart.items.length; i++) {
                if (findCart.items[i].productId == productId) {
                    //remove that productId from items array
                    const updatedPrice = findCart.totalPrice - product.price
                    //console.log(updatedPrice)
                    findCart.items[i].quantity = findCart.items[i].quantity - 1
                    if (findCart.items[i].quantity > 0) {
                        console.log("Hi")
                        const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalPrice: updatedPrice }, { new: true })
                        return res.status(201).send({ status: true, message: `One quantity  removed from the product cart successfully`, data: response })
                    }
                    else {
                        console.log("HOIIII")
                        const totalItems1 = findCart.totalItems - 1
                        findCart.items.splice(i, 1)

                        const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalItems: totalItems1, totalPrice: updatedPrice }, { new: true })
                        return res.status(201).send({ status: true, message: `1 product removed from the cart successfully`, data: response })

                    }
                } else {
                    return res.status(400).send({ status: false, message: `Product id does not match` })
                }

            }
        }
        if (removeProduct == 0) {
            for (let i = 0; i < findCart.items.length; i++) {
                if (findCart.items[i].productId == productId) {
                    const updatedPrice = findCart.totalPrice - (product.price * findCart.items[i].quantity)
                    const totalItems1 = findCart.totalItems - 1
                    //remove that productId from items array
                    findCart.items.splice(i, 1)
                    const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalItems: totalItems1, totalPrice: updatedPrice }, { new: true })
                    return res.status(201).send({ status: true, message: ` product removed from the cart successfully`, data: response })

                } else {
                    return res.status(400).send({ status: false, message: `Product id does not match` })
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

/////

const getCartList = async (req, res) => {
    try {
        const userId = req.params.userId
        let tokenId = req.userId
        console.log(userId)

        if (!(validateBody.isValidObjectId(userId) && validateBody.isValidObjectId(tokenId))) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        if (!(userId.toString() == tokenId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        const checkUser = await cartModel.findOne({ userId: userId })
        if (!checkUser) {
            return res.status(404).send({ status: false, msg: "There is no cart exist with this user id" });
        }

        return res.status(200).send({ status: true, message: 'User cart details', data: checkUser });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }
}


const deleteCart = async (req, res) => {
    try {
        const userId = req.params.userId
        let tokenId = req.userId
        if (!(validateBody.isValidObjectId(userId) && validateBody.isValidObjectId(tokenId))) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        if (!(userId.toString() == tokenId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        const checkCart = await cartModel.findOne({ userId: userId })
        if (!checkCart) {
            return res.status(404).send({ status: false, msg: "Cart doesn't exist" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, msg: "user doesn't exist" })
        }
        const deleteCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })
        res.status(200).send({ status: true, msg: "Successfully deleted", data: deleteCart })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }


}






module.exports.createCartProduct = createCartProduct
module.exports.getCartList = getCartList
module.exports.deleteCart = deleteCart
module.exports.updateCart = updateCart