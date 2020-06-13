export type Board = readonly string[];

export type GameState = {
  game: Board[];
  gameOver: boolean;
  opponentIsComp: boolean;
  opponentsToken: string;
  usersToken: string;
  usersTurn: boolean;
};

export type GameAction = {
  type: "move" | "reset";
  payload: number;
};
