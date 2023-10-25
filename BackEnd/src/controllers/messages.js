const TokenServies = require('../services/TokenServices');
const MessagesServices = require('../services/MessageServices');
const { getError } = require('../util');


exports.getMessagesBetween = async (req,res,next) => {
    try {
        let friendId = req.params.userId;
        let myId = (await TokenServies.getTokenFromCookie(req.headers.cookie)).userId;
        let messages = await MessagesServices.getMessagesBetween(myId,friendId);
        res.status(200).json(messages);
    }
    catch(err) {
        next(getError(err.error,err.status));
        return;
    }
}