require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const games = [];

io.on("connect", onConnect);
server.listen(process.env.PORT || 3001);

//---------------------------------------------//

function onConnect(socket) {
  let game;

  socket.on("findGame", () => {
    game = findExistingRoomToJoin(games);
    if (game) {
      game.add(socket);
      return start();
    }
    game = new TwoPlayerGame(socket);
    games.push(game);
    socket.emit("wait");
  });

  socket.on("move", (move) => {
    const opponent = game.getOpponent(socket);
    if (!opponent) return;
    socket.broadcast.to(opponent.id).emit("receiveMove", move);
  });

  socket.on("reset", () => {
    const opponent = game.getOpponent(socket);
    if (!opponent) return;
    if (game.playerResetting) {
      game.playerResetting = null;
      return start();
    }
    game.playerResetting = socket;
  });

  socket.on("leaveGame", cleanUp); // soft disconnect
  socket.on("disconnect", cleanUp); // hard disconnect

  function cleanUp() {
    if (game) {
      game.remove(socket);
      if (game.isEmpty()) {
        const index = games.indexOf(game);
        games.splice(index, 1);
      } else {
        const opponent = game.getOpponent(socket);
        if (!opponent) return;
        opponent.emit("wait", "Your opponent has left.");
      }
    }
  }

  function start() {
    const [player1, player2] = game.choosePlayersAtRandom();
    player1.emit("start", "this player goes first");
    player2.emit("start" /* this player will wait */);
  }
}

function findExistingRoomToJoin(rooms) {
  return rooms.find((room) => room.waitingForAntherPlayer());
}

//---------------------------------------------//

class TwoPlayerGame {
  constructor(socket) {
    this.players = [];
    this.add(socket);
    this.playerResetting = null;
    return this;
  }

  add(socket) {
    if (this.players.length < 2) {
      this.players.push(socket);
      return true;
    }
    return false;
  }

  choosePlayersAtRandom() {
    return Math.floor(Math.random() * 2)
      ? [...this.players]
      : [this.players[1], this.players[0]];
  }

  getOpponent(socket) {
    return this.players.find((player) => player !== socket);
  }

  isEmpty() {
    return this.players.length === 0;
  }

  remove(socket) {
    const index = this.players.indexOf(socket);
    this.players.splice(index, 1);
  }

  waitingForAntherPlayer() {
    return this.players.length === 1;
  }
}
