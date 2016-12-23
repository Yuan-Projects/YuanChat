const WebSocketServer = require('ws').Server,
      wss = new WebSocketServer({port: 8181});
      
var defaultMessages = ['Hello, world!', 'Test 1', 'Test 2'];
      
wss.on('connection', (ws)=> {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    var request = JSON.parse(message);
    switch(request.type) {
      case 'fetchDefault':
        ws.send(JSON.stringify(defaultMessages));
        break;
      case 'createMessage':
        wss.clients.forEach(function each(client) {
          var data = [request.data];
          client.send(JSON.stringify(data));
        });
        break;
    }
  });
  
});