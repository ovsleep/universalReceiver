const net = require('net');
var prompt = require('prompt');
var connection;
var server = net.createServer(function(socket) {
  connection = socket;
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});

server.listen(9958, '127.0.0.1');

prompt.start();
prompt.get(['cmd'], get_cmd);

function get_cmd(err, result){
  connection.write('0000000000000001 00 ' + result.cmd + ' universal');
  prompt.get(['cmd'], get_cmd);
}
