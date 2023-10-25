const {validationResult} = require('express-validator');
const {getError} = require('../util');

const TokenServies = require('../services/TokenServices');
const AuthServeice = require('../services/AuthServices');

exports.logIn = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(getError(errors.array()[0].msg,409));
        return;
    }

    let {email,password} = req.body;

    try {
        let {userId,userName} = await AuthServeice.retriveExistedUser(email,password);

        let token = await TokenServies.assignToken({userId,userName});
        res.cookie('token',token,{secure:true,sameSite:'none',maxAge:1000*60*60*24*7}).status(201).json({userId,token,userName});
    }
    catch(err) {
        next(getError(err.error,err.status));
    }
}

exports.signUp = async (req,res,next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(getError(errors.array()[0].msg,409));
        return;
    }

    const {userName,email,password} = req.body;
    try {
        let {userId} = await AuthServeice.createNewUser(userName,email,password);
        let token = await TokenServies.assignToken({userId:userId,userName:userName});
        res.cookie('token',token,{secure:true,sameSite:'none',maxAge:1000*60*60*24*7}).status(201).json({userId,token});
    }
    catch (err) {
        next(getError(err.error,err.status));
    }
}
