const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = socketio(server);

let players = []; // This will store both player names and their scores
let playersScore = []; 

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A player connected');

    // Listen for "find" event (player name submission)
    socket.on("find", (e) => {
        // Store player name and initialize their score to 0
        players.push(e.name);

        if (players.length === 4) {
            // Emit data when 4 players are connected
            io.emit("find", { connected: true });
            console.log("Players connected:", players);
            players = []; // Reset the players array after emitting the data
        }
    });

    // Listen for "getScore" event (player score submission)
    socket.on("getScore", (e) => {
        // Find the player by name and update their score
        playersScore.push(e);

        if (playersScore.length === 4) {
            // Emit player scores when all 4 players' scores are collected
            io.emit("getScore", playersScore.map(player => ({ name: player.name, score: player.score })));
            console.log("Scores sent:", playersScore);
            playersScore = []; // Reset players array after emitting the data
        }
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected');
    });
});

// Export the server as the default export for Vercel
module.exports = (req, res) => {
    // Vercel expects the server to handle the request and response directly
    server.emit('request', req, res);
};
