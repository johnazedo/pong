import { Game } from './game'

const express = require('express');
const app = express();
const http = require('http').Server(app);
var cors = require('cors')
const io = require('socket.io')(http);
const crypto = require('crypto');
const uuid = require('uuid');

app.use(express.static('public'));
app.use(cors)

const games = new Map();
const players = new Map();
const room = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  let userId = uuid.v4()
  players.set(userId, socket)
  room.push(userId)

  if(room.length == 2) {
    let gameId = uuid.v4()
    let game = Game(gameId, room.shift(), room.shift())
    games.set(gameId, game)
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('updatePaddle', (data) => {
    socket.broadcast.emit('updatePaddle', data);
  });

});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

