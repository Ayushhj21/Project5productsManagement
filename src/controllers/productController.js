const productModel = require('../models/productModel');
const validateBody = require('../validators/validator');
const aws = require("aws-sdk");



aws.config.update({
    accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
    secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
    region: "ap-south-1" // Mumbai region
});


// this function uploads file to AWS and gives back the url for the file
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) { // exactly 

        // Create S3 service object
        let s3 = new aws.S3({ apiVersion: "2006-03-01" });
        var uploadParams = {
            ACL: "public-read", // this file is publically readable
            Bucket: "classroom-training-bucket", // HERE
            Key: "books/" + file.originalname, // HERE    "pk_newFolder/harry-potter.png" pk_newFolder/harry-potter.png
            Body: file.buffer,
        };

        // Callback - function provided as the second parameter ( most oftenly)
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err });
            }
            console.log(data)
            console.log(`File uploaded successfully. ${data.Location}`);
            return resolve(data.Location); //HERE 
        });
    });
};


const createProduct = async (req, res) => {
    try {
        const requestBody = req.body
        if (!validateBody.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }
        //Object destructuring
        const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes,installments}= requestBody
        let files = req.files

        if (!validateBody.isValid(title)) {
            return res.status(400).send({ status: false, message: "Please provide title or title field" });
        }
        const duplicateTitle = await productModel.findOne({ title });
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "This title already exists" });
        }
        if (!validateBody.alphabetTestOfString(title)) {
            return res.status(400).send({ status: false, message: "You can't use number in title" });
        }
        if (!validateBody.isValid(description)) {
            return res.status(400).send({ status: false, message: "Please provide description or description field" });
        }
        if (!validateBody.alphabetTestOfString(description)) {
            return res.status(400).send({ status: false, message: "You can't use number in description" });
        }
        if (!validateBody.isValid(price)) {//can add number validation
            return res.status(400).send({ status: false, message: "Please provide price or price field" });;
        }
        if (!validateBody.isValid(currencyId)) { //can add string validation
            return res.status(400).send({ status: false, message: "Please provide currencyId or currencyId field" });;
        }
        if(!(requestBody.currencyId=="INR")){
            return res.status(400).send({ status: false, message: "Please provide currencyId in INR only" });;
        }
        if (!validateBody.isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: "Please provide currencyFormat or currencyFormat field" });;
        }
        if(!(requestBody.currencyFormat=="₹")){
            return res.status(400).send({ status: false, message: "Please provide currencyFormat in format ₹ only" });;
        }
        if (!files || (files && files.length === 0)) {
            return res.status(400).send({ status: false, message: " Product image or product image file is missing" });
        }
        if (!validateBody.isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: "Please provide available Sizes field" });;
        }
        const productPicture = await uploadFile(files[0])
        let productRegister = { title, description, price, currencyId, currencyFormat, isFreeShipping,productImage:productPicture, style, availableSizes, installments }


        if(availableSizes){
            let array=availableSizes.split(",").map(x=>x.trim())
            for(let i=0;i<array.length;i++){
                if(!(["S","XS","M","X","L","XXL","XL"].includes(array[i]))){
                    return res.status(400).send({status:false,msg:`Available sizes must be among ${["S","XS","M","X","L","XXL","XL"].join(',')}`})
                }
            }
            if(Array.isArray(array)){
                productRegister['availableSizes']=array
            }
        }
        

        //-----------SAVE USER PASSWORD WITH LOOK LIKE HASHED PASSWORD STORED IN THE DATABASE
        const products = await productModel.create(productRegister);
        return res.status(201).send({ status: true, message: 'Success', data: products });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message });
    }
}



const getproduct = async (req, res) => {
    try {
        if (!validateBody.isValidRequestBody(req.query)) {
            return res.status(400).send({ status: false, msg: "No query param received" });
        }
        let size=req.query.size
        let name= req.query.title
        let price= req.query.priceGreaterThan // doubt

        if (!isValid(size)) {
            return res.status(400).send({ status: false, message: 'In request size query is required' })
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'In request name query is required' })
        }
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: 'In request price query  is required' })
        }
        
       
        if (size || name || price) {
            let product = await productModel.find({ size: req.query.size, name: req.query.title, price: req.query.price, isDeleted: false })
            if (!(product)) {
                return res.status(404).send({ status: false, message: "Sorry, there is no such product found" });
            }
            else {
                let title = product.name
                let productlist = await productModel.find({ Price: { $gt: 'priceGreaterThan', $lt: 'priceLessThan' } }).sort({ price: -1 })

                return res.status(200).send({ status: true, message: 'Product Lists', data: productlist });
            }
        } else {
            return res.status(400).send({ status: false, message: "Please provide query for this request" });
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const getProductsById= async (req, res) => {
    try {
        let productId= req.params.productId
        let checkproductId = validateBody.isValidObjectId(productId);
        if (!checkproductId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid productId in path params" });;
        }
        let productData = await productModel.findOne({ _id:productId, isDeleted: false });
        if (!checkParams) {
            return res.status(404).send({ status: false, msg: "No product exists with this id" });
        }
        return res.status(200).send({ status: true, message:'Success', data: productData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}









const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId;
        let checkproductId = validateBody.isValidObjectId(productId);
        if (!checkproductId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid productId in path params" });;
        }
        let data = await productModel.findOne({ _id: productId ,isDeleted:false});
        if (!data) {
            return res.status(404).send({ status: false, message: "This Product id does not exits" });
        }
            data.isDeleted = true;
            data.deletedAt = Date().now;
            data.save();
            return res.status(200).send({ status: true, message: 'Success', data: data });
        
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = { createProduct, getproduct,getProductsById,deleteProduct }



