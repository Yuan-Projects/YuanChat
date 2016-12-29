const WebSocketServer = require('ws').Server,
      wss = new WebSocketServer({ port: 8181 });

var clientID = 0;
var clients = {};

var defaultMessages = ['Congratulations! You have connected successfully.'];

/* The handshake has been completed */
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

  console.log('[Info]' + nickName + ' has connected.');
  
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

  ws.on('error', (error) => {
    console.error('[Error]', 'The client ' + nickName + ' occurred error:', error);
  });
  
});

/* An error occurs on the underlying server */
wss.on('error', (error) => {
  console.error('[Error] An error occurred on the underlying server.', error);
});

/* The server has been bound */
wss.on('listening', () => {
  console.log('[Info]The server is listening.');
});

/**  
 * Emitted before the response headers are written to the socket as part of the handshake. 
 * This allows you to inspect/modify the headers before they are sent.
 */
wss.on('headers', (headers) => {
  
});