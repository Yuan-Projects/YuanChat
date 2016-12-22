const WebSocketServer = require('ws').Server,
      wss = new WebSocketServer({port: 8181});
      
wss.on('connection', (ws)=> {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log(message);
  });
});