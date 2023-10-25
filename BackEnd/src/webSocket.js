// create web socket and share it with all the files
const ws = require('ws');
const TokenServies = require('./services/TokenServices');
const WebSocketServices = require('./services/WebSocketServices');
let Wss=null;

function initSocket(server) {
    Wss = new ws.WebSocketServer({server:server});
    Wss.on('connection',async (connection,req)=>{
        try{
            let {userId,userName} =await TokenServies.getTokenFromCookie(req.headers.cookie);
            connection.userId = userId;
            connection.userName = userName;
            await WebSocketServices.sendToMe(connection);
            await WebSocketServices.sendToAll(userId,userName);
            connection.on('close',() =>{WebSocketServices.closeEvent(userId,userName)});
            connection.on('message',async (msg) => {await WebSocketServices.messageEvent(userId,msg);});
        }
        catch(err) {
            throw err;
        }
    });
}

function getWss() {
    if (Wss) {
        return Wss;
    }
    throw "There is no Wss";
}

module.exports.initSocket = initSocket;
module.exports.getWss = getWss;