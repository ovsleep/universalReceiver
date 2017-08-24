"use strict";
var request = require('request');
const IrReceiver = require('./irReceiver');

var receiver = new IrReceiver();
var device = 'cable';

var specialButtons = {
  'IN_1': { device: 'cable', cmd: 'watch'},
  'IN_2': { device: 'tv', cmd: 'watch'},
  'IN_3': { device: 'pi', cmd: 'watch'},
  'IN_4': { device: 'chrome', cmd: 'watch'},
  'IN_5': { device: 'xbox', cmd: 'watch'},
  'OFF': { device: 'tv', cmd: 'off'},
}

var keymapping = {
  'cable':{
    'GUIDE':'KEY_GUIDE',
    'EXIT':'KEY_EXIT',
    'RED':'KEY_RED',
    'GREEN':'KEY_GREEN',
    'YELLOW':'KEY_YELLOW',
    'BLUE':'KEY_BLUE',
    'UP':'KEY_UP',
    'LEFT':'KEY_LEFT',
    'DOWN':'KEY_DOWN',
    'RIGHT':'KEY_RIGHT',
    'OK':'KEY_OK',
    'BACK':'KEY_BACK',
    'RW':'KEY_RW',
    'PLAY':'KEY_PLAY',
    'FF':'KEY_FF',
    'PAUSE':'KEY_PAUSE',
    'STOP':'KEY_STOP',
  },
  'xbox':{
    'GUIDE':'HOME'
  },
  'tv':{
    'INFO':'TOOL'
  }
}

receiver.on('ready', function () {
    console.log('receiver ready!');
});

receiver.on('receive', function (button) {
    if(specialButtons[button]){
      var action = specialButtons[button];
      console.log('specialButton: ' + button + ' - ' + action.cmd + ' - ' + action.device);
      sendAction(action.cmd, action.device);
      device = action.device;
      if(device == 'pi' || device == 'chrome'){
        device = 'tv';
      }
    }
    else{
      if(keymapping[device] && keymapping[device][button]){
        button = keymapping[device][button];
      }
      console.log('sending: ' + device + ' - ' + button);
      sendKey(device, button);
    }
});


function sendKey(device, key){
  let command = {
            'command': 'key',
            'data': {
                'device': device,
                'key': key
            }
        };
        return _sendCommand(command);
}

function sendAction(cmd, device){
  let command = {
            'command': cmd,
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
console.log('sending command: ' + post_data);
 request(options, function(err, res, body) {
   if (res && (res.statusCode === 200 || res.statusCode === 201)) {
     console.log(body);
   }
 });
}

console.log('quit!');
