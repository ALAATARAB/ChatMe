const {OnlinePeople} = require('../util');
const MessageServies = require('../services/MessageServices');


function loopOverLivePeople(conditionFunc,data) {
    const Wss = require('../webSocket').getWss();
    if (Wss) {
        [...Wss.clients].map(client=> {
            if (conditionFunc(client)) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

async function sendToMe(connection) {
    connection.send(
        JSON.stringify(
            {
                online : [...OnlinePeople]
                .map(person=> ({userId:person[0],userName:person[1]}))
            }
    ));
}

async function sendToAll(connectionUserId,connectionUserName) {
    // notify all the users that there is a new user enter the app
    loopOverLivePeople((client)=>client.userId != connectionUserId,
    {online : [{userId:connectionUserId,userName:connectionUserName}]}
    );
    // put the new user in the OnlinePeople for new future users
    OnlinePeople.set(connectionUserId,connectionUserName);
}

function closeEvent(connectionUserId,connectionUserName) {
    OnlinePeople.delete(connectionUserId);
    // let all clients know that this person is offline
    loopOverLivePeople((client)=>true,{offline:{userId:connectionUserId,userName:connectionUserName}});
}

async function messageEvent(connectionUserId,msg) {
    let message = JSON.parse(msg.toString());
    if('sendedMessage' in message) {
        let {sendedMessage} = message;
        await MessageServies.saveMessage(connectionUserId,sendedMessage.to,sendedMessage.content);
        // if the recipent is online i will send it to him
        if (OnlinePeople.has(sendedMessage.to)) {
            loopOverLivePeople((client)=>client.userId==sendedMessage.to,{
                incommingMessage:{
                from:connectionUserId,
                content:sendedMessage.content,
            }})
        }
    }
    else if ('typing' in message) {
        let {typing} = message;
        let to = typing.to;
        if (OnlinePeople.has(to)) {
            loopOverLivePeople((client)=>client.userId==to,{typing:{from:connectionUserId}});
        }
    }
}

module.exports.loopOverLivePeople = loopOverLivePeople;
module.exports.sendToAll = sendToAll;
module.exports.sendToMe = sendToMe;
module.exports.closeEvent = closeEvent;
module.exports.messageEvent = messageEvent;
