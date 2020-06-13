import {
  all,
  any,
  complement,
  equals,
  findIndex,
  map,
  none,
  not,
  update,
} from "ramda";
import { Board, GameState, GameAction } from "./types";
import initialState from "./initialState";

const equalsBlank = equals(" ");
const alreadyTaken = complement(equalsBlank);

const noMovesLeft = none(equalsBlank);
const movesLeft = any(equalsBlank);

const checkForWin = (board: Board, char: string) =>
  any(
    (winningSet) =>
      all(
        equals(char),
        map((index) => board[index], winningSet)
      ),
    [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8],
    ]
  );

/**
 * exhaustively check for a win for either player
 */
const compMove = (board: Board, compToken: string, usersToken: string) => {
  let defensiveMove = -1;
  for (let candidate = 0; candidate < board.length; ++candidate) {
    if (alreadyTaken(board[candidate])) continue;
    if (checkForWin(update(candidate, compToken, board), compToken)) {
      return candidate;
    }
    if (checkForWin(update(candidate, usersToken, board), usersToken)) {
      defensiveMove = candidate;
    }
  }
  return defensiveMove >= 0 ? defensiveMove : findIndex(equalsBlank, board);
};

const reducer = (state: GameState, action: GameAction): GameState => {
  const [board] = state.game;
  const index = action.payload;

  if (action.type === "move") {
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
    return {
      ...state,
      game,
      gameOver:
        userWon ||
        checkForWin(game[0], state.opponentsToken) ||
        noMovesLeft(newBoard),
      usersTurn: state.opponentIsComp,
    };
  }

  if (action.type === "reset") {
    return initialState;
  }

  return state;
};

export default reducer;
