import { not, update } from "ramda";
import {
  alreadyTaken,
  checkForWin,
  compMove,
  movesLeft,
  noMovesLeft,
} from "./utils";
import {
  GameState,
  GameAction,
  GameActionTypes,
  ResetTypes,
  StartTypes,
} from "./types";
import initialState from "./initialState";
import api from "./api";

type StateHandler = (state: GameState, action: GameAction) => GameState;

const changeOpponent: StateHandler = (_, { payload }) => {
  const leavingGameRoom = payload === ResetTypes.LeaveRoom;
  if (not(leavingGameRoom)) api.findGame();
  else api.leaveGame();
  return {
    ...initialState,
    gameOver: !leavingGameRoom,
    opponentIsComp: leavingGameRoom,
    usersTurn: leavingGameRoom,
    waiting: !leavingGameRoom,
  };
};

const closeError: StateHandler = (state) => ({
  ...state,
  error: undefined,
});

export const move: StateHandler = (state, action) => {
  if (not(state.usersTurn)) return state;
  const [board] = state.game;
  const index = action.payload;
  if (alreadyTaken(board[index])) return state;
  const newBoard = update(index, state.usersToken, board);
  const userWon = checkForWin(newBoard, state.usersToken);
  const game = [
    not(userWon) && state.opponentIsComp && movesLeft(newBoard)
      ? update(
          compMove(newBoard, state.opponentsToken, state.usersToken),
          state.opponentsToken,
          newBoard
        )
      : newBoard,
    ...state.game,
  ];
  const gameOver =
    userWon ||
    checkForWin(game[0], state.opponentsToken) ||
    noMovesLeft(newBoard);
  if (not(state.opponentIsComp)) {
    api.move(index);
  }
  return {
    ...state,
    game,
    gameOver,
    usersTurn: state.opponentIsComp,
  };
};

const receiveMove: StateHandler = (state, action) => {
  const [board] = state.game;
  const index = action.payload;
  const newBoard = update(index, state.opponentsToken, board);
  const gameOver =
    checkForWin(newBoard, state.opponentsToken) || noMovesLeft(newBoard);
  return {
    ...state,
    game: [newBoard, ...state.game],
    gameOver,
    usersTurn: true,
  };
};

const reset: StateHandler = (state, { payload }) => {
  if (not(state.opponentIsComp)) {
    if (payload === ResetTypes.StayInRoom) api.reset();
    if (payload === ResetTypes.LeaveRoom) api.leaveGame();
  }
  return {
    ...initialState,
    gameOver: !state.opponentIsComp,
    opponentIsComp: state.opponentIsComp,
    usersTurn: state.opponentIsComp,
    waiting: !state.opponentIsComp,
  };
};

const start: StateHandler = (_, { payload }) => ({
  ...initialState,
  opponentIsComp: false,
  gameOver: false,
  usersTurn: payload === StartTypes.UsersTurn,
  waiting: false,
});

const wait: StateHandler = (state, { error }) => ({
  ...state,
  error,
  gameOver: true,
  usersTurn: false,
  waiting: true,
});

const reducer: StateHandler = (state, action) =>
  ({
    [GameActionTypes.ChangeOpponent]: changeOpponent,
    [GameActionTypes.CloseError]: closeError,
    [GameActionTypes.Move]: move,
    [GameActionTypes.ReceiveMove]: receiveMove,
    [GameActionTypes.Reset]: reset,
    [GameActionTypes.Start]: start,
    [GameActionTypes.Wait]: wait,
  }[action.type](state, action));

export default reducer;
