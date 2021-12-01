var socket;
var server_url;

function setup() {
  // p5 setup
  createCanvas(1200, 600);
  colorMode(HSB, 255);
  frameRate(30);
  
  // Get URL
  const host = window.location.hostname;
  if (host == 'localhost'){
    // Local
    server_url = 'http://localhost:3000';
  } else {
    // Production (Hosted)
    server_url = 'https://' + host;
  }

  console.log(server_url);

  socket = io.connect(server_url);

  socket.on('heartbeat', (data) => {
      socket.emit('alive');
  });

  // Setup any other event listeners here
}

function draw() {
  background(0);
}

