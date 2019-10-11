var exports = module.exports = {};

let caller = [];
let callee = [];

function webRTC(io) {
  io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id);
    socket.on('join', (room) => {
      if (room == 'caller') {
        socket.join(room);
        caller.push(socket);
      }
      else if (room == 'callee') {
        socket.join(room);
        callee.push(socket);
      }
      else {
        throw new Error('Neither Caller and Callee');
      }
      console.log(socket.id, 'is', room);
    });
    socket.on('getNumberOfCallee', () => {
      socket.emit('numberOfCallee', callee.length);
    });
    socket.on('candidate', (data) => {
      if (caller.includes(socket)) {
        callee[data['id']].emit('candidate', data['candidate']);
      }
      else if (callee.includes(socket)) {
        caller[data['id']].emit('candidate', data['candidate']);
      }
    });
    socket.on('disconnect', () => {
      if (caller.includes(socket)) {
        caller.splice(caller.indexOf(socket), 1);
      }
      else if (callee.includes(socket)) {
        callee.splice(callee.indexOf(socket), 1);
      }
    });
  });
}

module.exports.on = (io) => {
  webRTC(io)
}