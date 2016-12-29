const WebSocketServer = require('ws').Server,
      wss = new WebSocketServer({ port: 8181 });

var clientID = 0;
var clients = {};
      
var defaultMessages = ['Congratulations! You have connected successfully.'];
      
wss.on('connection', (ws)=> {
  var nickName = 'Anonymous' + clientID;
  clients[nickName] = ws;
  var notification = {
    type: 'notification',
    data: [nickName + ' has just joined this room.']
  };

  wss.clients.forEach(function each(client) {
    if (client !== ws) {
      client.send(JSON.stringify(notification));
    }
  });

  clientID++;
  
  ws.on('message', (message) => {
    var request = JSON.parse(message);
    switch(request.type) {
      case 'fetchDefault':
        ws.send(JSON.stringify({
          type: 'message',
          data: defaultMessages
        }));
        break;
      case 'createMessage':
        var broadcastData = {
          type: 'message',
          data: [ nickName + ': ' + request.data]
        }
        wss.clients.forEach(function each(client) {
          client.send(JSON.stringify(broadcastData));
        });
        break;
    }
  });

  ws.on('close', () => {
    console.log('[Notification]', nickName + ' has disconnected');
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({
        type: 'notification',
        data: [nickName + ' has disconnected']
      }));
    });
  });
  
});