const RTC_CONFIGURATION = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    }
  ]
};

var socket = io.connect('https://sunrintv.kro.kr');
var callee;

function sendJoin() {
  socket.emit('join', 'callee');
}

function startWebRTC() {
  
}

$(document).ready(() => {
  // send socket that i'm callee 
  sendJoin()
  // start WebRTC connection
  startWebRTC()
});
