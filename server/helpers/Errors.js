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
        console.log(typeof (parameters))
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

class PartnerNotFoundError extends ErrorHandler {
    constructor(infos) {
        super(400, "PartnerNotFound", infos || "The id you specified for this partner has not been found");
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

const handleError = (error, req, res, next) => {
    res.status(error.code).json({ code: error.message, message: error.infos });
}

/**
 * Check if the variable type is correct
 * @param {var} variable Variable to test
 * @param {string} varName Variable name to return if there is an error
 * @param {string} typeExpected Type expexted for the given variable
 */
const isValidType = (variable, varName, typeExpected) =>
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

/**
* Check if the variables types are correct
* @param {[var]} variables Variables to test
* @param {[string]} varsName Variables' name to return if there is an error
* @param {[string]} typesExpected Types expexted for the given variables
*/
const areValidTypes = (variables, varsName, typesExpected) => {
    let promises = [];
    for (let i = 0; i < variables.length; i++)
        promises.push(isValidType(variables[i], varsName[i], typesExpected[i]));

    return Promise.all(promises);
}




module.exports = {
    ExistingNameError,
    MissingParameterError,
    InvalidParameterError,
    MongoError,
    PartnerNotFoundError,
    handleError,
    isValidType,
    areValidTypes
}