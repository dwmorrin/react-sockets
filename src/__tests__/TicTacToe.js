import { makeBoard } from "../games/TicTacToe/initialState";
import { move } from "../games/TicTacToe/reducer";
import { GameActionTypes } from "../games/TicTacToe/types";
import { checkForWin, compMove } from "../games/TicTacToe/utils";

test("empty board has no win for X or O", () => {
  expect(checkForWin(makeBoard(), "X")).toBeFalsy();
  expect(checkForWin(makeBoard(), "O")).toBeFalsy();
});

test("empty board wins with space", () =>
  expect(checkForWin(makeBoard(), " ")).toBeTruthy());

test("computer makes defensive move", () => {
  const board = [" ", " ", " ", "O", " ", " ", "X", "X", " "];
  expect(compMove(board, "O", "X")).toBe(8);
});

test("computer chooses win over defense", () => {
  const board = ["X", "X", " ", "O", "O", " ", " ", " ", " "];
  expect(compMove(board, "O", "X")).toBe(5);
});

test("winning move ends game", () => {
  const board = ["X", "X", " ", " ", " ", " ", " ", " ", " "];
  const winningBoard = board.slice();
  winningBoard[2] = "X";
  const state = {
    game: [board],
    opponentIsComp: false,
    usersTurn: true,
    usersToken: "X",
  };
  const action = {
    action: GameActionTypes.Move,
    payload: 2,
  };

  expect(move(state, action)).toEqual({
    game: [winningBoard, board],
    gameOver: true,
    opponentIsComp: false,
    usersToken: "X",
    usersTurn: false,
  });
});
