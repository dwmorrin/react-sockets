import {
  all,
  any,
  complement,
  equals,
  findIndex,
  map,
  none,
  update,
} from "ramda";
import { Board } from "./types";

export const equalsBlank = equals(" ");
export const alreadyTaken = complement(equalsBlank);
export const noMovesLeft = none(equalsBlank);
export const movesLeft = any(equalsBlank);

/**
 * The array literal contains sets of indicies.  If a player token is found
 * in each index for a given set, that player has won the game.
 * This function exhaustively checks each winning possibility for a given
 * player token.
 */
export const checkForWin = (board: Board, token: string) =>
  any(
    (winningSet) =>
      all(
        equals(token),
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
export const compMove = (
  board: Board,
  compToken: string,
  usersToken: string
) => {
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
