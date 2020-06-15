# React Sockets

Phase 1: Build a TicTacToe game

Phase 2: (Current) Add socket.io so two people can play together

Phase 3: Add more games

## Config

Client app is using Create React App. `npm run start` to start client app.

Server app is Express + Socket.io.
No script (yet), just `node server/server.js`.

A useful `.env` line for Socket.io is `DEBUG=socket.io:socket,engine:socket`.
This will log all of the socket events.
