const express = require('express');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the Express server
const port = process.env.PORT || 4000; // Use the assigned port or fallback to 4000
const expressServer = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Import and initialize Socket.IO with the Express server
const socketio = require('socket.io');
const io = socketio(expressServer);

let players = []; // This will store both player names and their scores
let playersScore = []; 

// Socket.IO logic
io.on('connection', (socket) => {
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
});
