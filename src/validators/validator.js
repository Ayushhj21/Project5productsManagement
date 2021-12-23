const validator = require("email-validator");
const mongoose=require("mongoose")
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false//it cheks is there value is null or undefined
    if (typeof value === 'string' && value.trim().length === 0) return false//it checks the value conAtain only space or not 
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;// it checks, is there any key is available or not in provided body
}

const isString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false//it checks the value conAtain only space or not 
    return true;
}

const isValidMobileNum = function (value) {
    if (!(/^[6-9]\d{9}$/.test(value))) {
        return false
    }
    return true
}

const isValidSyntaxOfEmail = function (value) {
    if (!(validator.validate(value.trim()))) {
        return false
    }
    return true
}
const isValidEmail = function (value) {
    if (!(validator.validate(value))) {
        return false
    }
    return true
}

let alphabetTestOfString = function (value) {
    let regex = /^[A-Za-z ]+$/
    if (!(regex.test(value))) {
        return false
    }
    return true
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const validString = function(value) {
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
}


module.exports = {
    isValid,
    isValidRequestBody,
    isValidSyntaxOfEmail,
    isValidMobileNum,
    alphabetTestOfString,
    isString,isValidObjectId,validString,isValidEmail
}