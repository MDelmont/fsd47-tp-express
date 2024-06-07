const response = (res, ret) => {
    return res.status(ret.statusCode).json({message: ret.message, data: ret.data});
}

const missingFieldResponse = (res,missingFields) => {
    return response(res, {
        statusCode: 401,
        message: `Required information ${missingFields.join(', ')} is missing`,
        data: { requiredMissing: missingFields, errors: [{ msg: "errorMissingData" }] },
    });
}

const loginPasswordInvalidResponse = (res) => {
    return response(res, {
        statusCode: 401,
        message: 'Login/password invalid',
        data: null,
      });
}

const notGoodScopeResponse = (res) => {
    return response(res, {
        statusCode: 401,
        message: 'access denied',
        data: null,
      });
}


const internalErrorResponse = (res,functionName) => {
    return response(res, {
        statusCode: 500,
        message: 'internal server error',
        data: {function:functionName},
      });
}

export default {response,
    missingFieldResponse,
    loginPasswordInvalidResponse,
    notGoodScopeResponse,
    internalErrorResponse}
