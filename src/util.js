// for jwt
let PASSWORD = 'woeifj;owiegiaiogawofjwioejfwjiegw';
exports.PASSWORD = PASSWORD;

// for all the people which are connected to this server
// it looks like OnlinePeople[userId:String] = userName:String
const OnlinePeople = new Map();
exports.OnlinePeople = OnlinePeople;

exports.getError = (message,status) => {
    let err = new Error(message);
    err.statusCode = status;
    return err;
}
