var socket;
var server_url;

var max_hist = 300;
var price_hist = [];

let noise1_off = 0.0;
let noise1_change = 0.01;

let noise2_off = 0.0;
let noise2_change = 0.1;

var cash = 10000.0;
var owned = 0.0;

var last_transaction = [0.0, 0.0];
var sold = true;

function buy() {
  p = price_hist.at(-1);

  can_buy = cash / actual_price(p);
  owned += can_buy;
  cash -= actual_price(p) * can_buy;

  last_transaction[1] = p;
  sold = false;
}

function sell() {
  p = price_hist.at(-1);

  cash += actual_price(p) * owned;
  owned = 0;

  last_transaction[1] = p;
  sold = true;
}

function setup() {
  // p5 setup
  createCanvas(1200, 600);
  colorMode(RGB, 255);
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

  buy_button = createButton('Buy');
  buy_button.position(width-100, height-100);
  buy_button.mousePressed(buy);

  sell_button = createButton('Sell');
  sell_button.position(width-100, height-80);
  sell_button.mousePressed(sell);

  // Setup any other event listeners here
}

function draw_graph() {
  step = width / price_hist.length;

  let i = 0;
  last_x = 0;
  last_y = 0;
  for (let x = 0; x < width; x+=step) {
    stroke(255);
    
    line(last_x, last_y, x, price_hist[i]);
    last_x = x;
    last_y = price_hist[i];

    i++;
  }

  // Draw last transaction
  //stroke(0, 0, 255);
  push();
  if (sold) stroke(255, 0, 0);
  else stroke(0, 255, 0);
  line(0, last_transaction[1], width, last_transaction[1]);
  pop();
}



function get_price() {
  p = noise(noise1_off) * height;
  p += noise(noise2_off) * 200;
  p += random(40) - 20;
  noise1_off += noise1_change;
  noise2_off += noise2_change;
  return min(max(p, 0), height);
}

function actual_price(h) {
  return (height - h) + 5;
} 
 
function draw() {
  background(0);

  
  price_hist.push(get_price());
  

  if (price_hist.length > max_hist) {
    price_hist.shift();
  }

  draw_graph();

  textSize(24);
  fill(255);
  text('Price: $' + str(int(actual_price(price_hist.at(-1)))), 40, 40)
  text('Cash: $' + str(int(cash)), 40, 70)
  text('Owned: ' + str(int(owned)), 40, 100)
}

