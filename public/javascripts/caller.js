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

var screenStream;
var socket = io.connect('https://sunrintv.kro.kr');
var caller = [];

socket.on('candidate', (candidate) => {
  console.log('Candidate Recieved:', candidate);
  callee.addIceCandidate(candidate);
});
socket.on('answer', (answer) => {
  console.log('Answer Recieved:', answer);
  caller.setRemoteDescription(answer);
});

function getStream() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getDisplayMedia({ audio: false, video: true }).then((mediaStream) => {
      resolve(mediaStream);
    })
  });
}
function getNumberOfCallee() {
  return new Promise((resolve, reject) => {
    socket.on('numberOfCallee', (numberOfCallee) => { resolve(numberOfCallee); });
    socket.emit('getNumberOfCallee', null);
  });
}
function makePeerConnection(numberOfCallee) {
  for (let i = 0; i < numberOfCallee; i++) {
    let pc = new RTCPeerConnection(RTC_CONFIGURATION);
    pc.addStream(screenStream);
    pc.onicecandidate = (event) => {
      if (event.candidate != null) {
        console.log('Candidate Created:', event.candidate);
        socket.emit('candidate', { id: i, candidate: event.candidate });
      }
    };
    pc.createOffer().then((offer) => {
      return pc.setLocalDescription(offer);
    }).then(() => {
      socket.emit('offer', { id: i, offer: pc.localDescription });
    });
    caller.push(pc);
  }
}

function startWebRTC() {
  getNumberOfCallee().then((numberOfCallee) => {
    console.log('NumberOfCalle:', numberOfCallee);
    makePeerConnection(numberOfCallee);
  });
}

$(document).ready(() => {
  socket.emit('join', 'caller');
  $("#share").click(() => {
    getStream().then((stream) => {
      screenStream = stream;
      $("#screen")[0].srcObject = stream;
      startWebRTC();
    });
  });
});
