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
const room = [];

class Game {
  constructor(id, playerOne, playerTwo) {
      this.id = id;
      this.playerOne = playerOne;
      this.playerTwo = playerTwo;
  }
}

io.on('connection', (socket) => {
  console.log('a user connected');

  

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('updatePaddle', (data) => {
    if (data.player === 'left') {
      leftPaddleY = data.y;
    } else if (data.player === 'right') {
      rightPaddleY = data.y;
    }
    socket.broadcast.emit('updatePaddle', data);
  });

});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

