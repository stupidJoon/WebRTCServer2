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
var caller = [];

function sendGetNumberOfCallee() {
  socket.emit('getNumberOfCallee', null);
}
function sendJoin() {
  socket.emit('join', 'caller');
}

function getNumberOfCallee() {
  return new Promise((resolve, reject) => {
    socket.on('numberOfCallee', (numberOfCallee) => { resolve(numberOfCallee); });
    sendGetNumberOfCallee();
  });
}

function startWebRTC() {
  getNumberOfCallee().then((numberOfCallee) => {
    console.log('NumberOfCalle:', numberOfCallee);
  });
}

$(document).ready(() => {
  // send socket server that i'm caller 
  sendJoin();
  // when click share button start WebRTC Connection
  $("#share").click(() => {
    getStream().then((stream) => {
      $("#screen")[0].srcObject = stream;
      startWebRTC()
    });
  });
});
