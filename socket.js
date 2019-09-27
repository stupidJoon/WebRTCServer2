var exports = module.exports = {};

let caller = [];
let callee = [];

function webRTC(io) {
  // socket connect event
  io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id);
    // determine socket is caller or callee
    socket.on('join', (room) => {
      if (room == 'caller') {
        socket.join(room);
        caller.push(socket.id);
      }
      else if (room == 'callee') {
        socket.join(room);
        callee.push(socket.id);
      }
      else {
        throw new Error('Neither Caller and Callee');
      }
      console.log(socket.id, 'is', room);
    });
    // get number of callee
    socket.on('getNumberOfCallee', () => {
      socket.emit('numberOfCallee', callee.length);
      console.log('Number Of Callee is', callee.length);
    });
  });
}

module.exports.on = (io) => {
  webRTC(io)
}