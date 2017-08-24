"use strict";

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
module.exports = IrReceiver;

function IrReceiver(){
  var self = this;
  EventEmitter.call(this);

  this.lastButton = Date.now();
  var lirc = require('lirc-client')({
    path: '/var/run/lirc/lircd'
    //host: '127.0.0.1',
   // port: 9958
  });

  lirc.on('connect', function () {
    console.log('Ready!');
    self.emit('ready');
  });

  lirc.on('receive', function (remote, button, repeat) {
    if(Date.now() - self.lastButton < 300){
      console.log('Repeated button!');
      return;
    }
    self.lastButton = Date.now();
    console.log('button ' + button + ' on remote ' + remote + ' was pressed!');
    if(remote == 'universal'){
        self.emit('receive', button);
    }
  });
}

inherits(IrReceiver, EventEmitter);
