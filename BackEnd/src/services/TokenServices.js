const jwt = require('jsonwebtoken');
const {PASSWORD} = require('../util');


async function assignToken(payload) {
    try {
        let token = await jwt.sign(payload,PASSWORD);
        return token
    }
    catch(err) {
        throw {error:"There is an issue",status:500};
    }
}

async function getTokenFromCookie(cookies) {
    if (cookies) {
        let tokenCookie = String(cookies).split(';').find(str => str.startsWith('token'));
        if (tokenCookie) {
            let token = tokenCookie.split('=')[1];
            if (token) {
                try {
                    let userData = await jwt.verify(token,PASSWORD);
                    return userData;
                }
                catch(err) {
                    throw {error:'invalid Token',status:401};
                }
            }
            throw {error:'There is no Token',status:401};
        }
        throw {error:'There is no Token',status:401};
    }
    throw {error:'There are no cookies',status:401};
}

module.exports.getTokenFromCookie = getTokenFromCookie;

module.exports.assignToken = assignToken;