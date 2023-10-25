const Message = require('../models/message');

async function saveMessage(from,to,text) {
    try {
        await Message.create({from,to,text});
    }
    catch(err) {
        throw {error:'There is an error in server',status:500};
    }
}

async function getMessagesBetween(myId,friendId) {
    try {
        // grap all the messages from user or to user and then sort them 
        // by the createdAt field ASC
        let messages =await Message.find({
            $or:[{from:myId,to:friendId},{from:friendId,to:myId}]
        }).sort({createdAt:1});
        return messages;
    }
    catch(err) {
        throw {error:'There is an error in server',status:500};
    }
}

module.exports.saveMessage = saveMessage;
module.exports.getMessagesBetween = getMessagesBetween;