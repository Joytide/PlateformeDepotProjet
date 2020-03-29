const env = process.env.NODE_ENV || 'dev';
const mongoose = require('mongoose');

class ErrorHandler extends Error {
    constructor(code, message, infos) {
        super();
        this.code = code;
        this.message = message;
        this.infos = infos;
    }
}

class MissingParameterError extends ErrorHandler {
    constructor(parameters) {
        console.log(typeof(parameters))
        if (parameters && parameters instanceof Array)
            super(400, "MissingParameter", "One or many parameters are missing from the request. Expected parameters : " + parameters.join(' ,'));
        else
            super(400, "MissingParameter", "One or many parameters are missing from the request. Expected parameters : n/a (refer to documentation for this endpoint");
    }
}

class InvalidParameterError extends ErrorHandler {
    constructor(varName, type) {
        if (varName && type)
            super(400, "InvalidParameter", `Invalid type for ${varName}. Expected type : ${type}`);
        else
            super(400, "InvalidParameter", "One or many parameters have an incorrect data type. Please check documentation");
    }
}

class ExistingNameError extends ErrorHandler {
    constructor(infos) {
        super(409, "ExistingName", infos || "The name specified is already used");
    }
}

class MongoError extends ErrorHandler {
    constructor(error) {
        if (env == 'dev')
            super(500, 'MongoError', error)
        else
            super(500, "InternalServerError", "Something wrong happened on the server side");
    }
}

function handleError(error, req, res, next) {
    res.status(error.code).json({ code: error.message, message: error.infos });
}

/**
 * Check if the variable type is correct
 * @param {var} variable Variable to test
 * @param {string} varName Variable name to return if there is an error
 * @param {string} typeExpected Type expexted for the given variable
 */
isValidType = (variable, varName, typeExpected) =>
    new Promise((resolve, reject) => {
        if (variable)
            if (typeof (variable) == typeExpected)
                resolve()
            else if (typeExpected == "ObjectId")
                if (mongoose.Types.ObjectId.isValid(variable))
                    resolve();
                else
                    reject(new InvalidParameterError(varName, typeExpected));
            else
                reject(new InvalidParameterError(varName, typeExpected));
        else
            reject(new MissingParameterError([varName]));

    });




module.exports = {
    ExistingNameError,
    MissingParameterError,
    InvalidParameterError,
    MongoError,
    handleError,
    isValidType
}