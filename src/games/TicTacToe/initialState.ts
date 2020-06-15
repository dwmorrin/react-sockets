import { always, map, range } from "ramda";
import { GameState } from "./types";

const makeBoard = () => map(always(" "), range(0, 9));

const initialState: GameState = {
  game: [makeBoard()],
  gameOver: false,
  opponentIsComp: true,
  opponentsToken: "O",
  usersToken: "X",
  usersTurn: true,
  waiting: false,
};

export default initialState;
