document.addEventListener('DOMContentLoaded', function () {
  var progressBar = document.querySelector('progress');
  var ws = new WebSocket('ws://localhost:8181');
  
  ws.onopen = function(e) {
    console.log('Connection to server opened');
    progressBar.remove();
    var request = {
      type: 'fetchDefault'
    };
    ws.send(JSON.stringify(request));
  };
  
  ws.onmessage = function(e) {
    var data = JSON.parse(e.data);
    if (Array.isArray(data)) {
      renderMessages(data);
    }
  };
  
  ws.onclose = function(e) {
    var reason = 'Unknown error';
    switch(e.code) {
      case 1000:
        reason = 'Normal closure';
        break;
      case 1001:
        reason = 'An endpoint is going away';
        break;
      case 1002:
        reason = 'An endpoint is terminating the connection due to a protocol error.';
        break;
      case 1003:
        reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept';
        break;
      case 1004:
        reason = 'Reserved. The specific meaning might be defined in the future.';
        break;
      case 1005:
        reason = 'No status code was actually present';
        break;
      case 1006:
        reason = 'The connection was closed abnormally';
        break;
      case 1007:
        reason = 'The endpoint is terminating the connection because a message was received that contained inconsistent data';
        break;
      case 1008:
        reason = 'The endpoint is terminating the connection because it received a message that violates its policy';
        break;
      case 1009:
        reason = 'The endpoint is terminating the connection because a data frame was received that is too large';
        break;
      case 1010:
        reason = 'The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn\'t.';
        break;
      case 1011:
        reason = 'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
        break;
      case 1012:
        reason = 'The server is terminating the connection because it is restarting';
        break;
      case 1013:
        reason = 'The server is terminating the connection due to a temporary condition';
        break;
      case 1015:
        reason = 'The connection was closed due to a failure to perform a TLS handshake';
        break;
    }
    progressBar.remove();
    document.querySelector('#tips').innerHTML = reason;
    document.querySelector('#tips').style.display = 'block';
  };
  
  var messageContainer = document.querySelector('#messageContainer');
  var form = document.querySelector('form'),
      messageControl = form.querySelector('input');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    e.stopPropagation();
    if (ws.readyState === WebSocket.OPEN) {
      var request = {
        type: 'createMessage',
        data: messageControl.value
      };
      ws.send(JSON.stringify(request));
    }
  });
  
  function renderMessages(messages) {
    var messageDom = messages.map(function(message) {
      return '<p>' + message + '</p>';
    });
    messageContainer.innerHTML += messageDom.join('');
  }
  
});