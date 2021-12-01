const express = require('express');
const socketio = require('socket.io')

// === Server Setup ===
var PORT = process.env.PORT || 3000;
var app = express();
var server = app.listen(PORT);

// Serve the static HTML
app.use(express.static('public'));

console.log("Server running on http://localhost:"+PORT);

// === Socket Server ===
const io = socketio(server);

// If a player does not respond within this many
// frames, they are disconnected.
const dc_threshold = 60;

const fps = 30;
const frame_time = 1000 / fps;

setInterval(heartbeat, frame_time);
io.sockets.on('connection', new_connection);

var connections = {};

function heartbeat(){
    io.sockets.emit('heartbeat', {example_message: 'Hello all!'});

    //console.log(connections);

    for (id in connections){
        let client = connections[id];
        client.dead_timer += 1;

        if (client.dead_timer >= dc_threshold){
            io.to(id).emit('dc');
            console.log(`${id} disconnected (timed out).`);
            delete connections[id];
        }
    }
}

function new_connection(socket){
    console.log('New Connection: ' + socket.id);
    
    connections[socket.id] = {
        dead_timer: 0
    };

    socket.on('alive', ()=>{
        connections[socket.id].dead_timer = 0;
    });
}