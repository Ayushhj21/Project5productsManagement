const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
      
    }],
    totalPrice: {
        type: Number,
        required: true,
        // "Holds total price of all the items in the cart"
    },
    totalItems: {
        type: Number,
        required: true,
        //"Holds total number of items in the cart"
    },
}, { timestamps: true })
module.exports = mongoose.model('cart', cartSchema)