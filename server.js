"use strict";
var request = require('request');
const IrReceiver = require('./irReceiver');

var receiver = new IrReceiver();

receiver.on('ready', function () {
    console.log('receiver ready!');
});

receiver.on('receive', function (button) {
    sendWatch('chrome');
});

function sendWatch(device){
  let command = {
            'command': 'watch',
            'data': {
                'device': device
            }
        };
        return _sendCommand(command);
}

function _sendCommand(post_data){
  var options = {
   url: 'http://192.168.1.17:9589/api/remote',
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   json: post_data
 };

 request(options, function(err, res, body) {
   if (res && (res.statusCode === 200 || res.statusCode === 201)) {
     console.log(body);
   }
 });
}
