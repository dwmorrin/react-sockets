import io from "socket.io-client";
import { Dispatch, GameActionTypes, StartTypes } from "./types";

const socket = io();

const listen = (dispatch: Dispatch) => {
  socket.on("receiveMove", (move: number) =>
    dispatch({ type: GameActionTypes.ReceiveMove, payload: move })
  );
  socket.on("start", (usersTurn?: unknown) =>
    dispatch({
      type: GameActionTypes.Start,
      payload: usersTurn ? StartTypes.UsersTurn : StartTypes.OpponentsTurn,
    })
  );
  socket.on("wait", (error: string) =>
    dispatch({ type: GameActionTypes.Wait, payload: 0, error })
  );
};

const move = (move: number) => {
  socket.emit("move", move);
};

const findGame = () => {
  socket.emit("findGame");
};

const leaveGame = () => {
  socket.emit("leaveGame");
};

const reset = () => {
  socket.emit("reset");
};

const disconnect = () => socket.disconnect();

export default { disconnect, findGame, leaveGame, listen, move, reset };
