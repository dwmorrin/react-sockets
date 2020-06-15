export type Board = readonly string[];

export type GameState = {
  error?: string;
  game: Board[];
  gameOver: boolean;
  opponentIsComp: boolean;
  opponentsToken: string;
  usersToken: string;
  usersTurn: boolean;
  waiting: boolean;
};

export enum GameActionTypes {
  ChangeOpponent,
  CloseError,
  Move,
  ReceiveMove,
  Reset,
  Start,
  Wait,
}

export enum ChangeOpponentTypes {
  PlayComputer,
  PlayHuman,
}

export enum ResetTypes {
  LeaveRoom,
  StayInRoom,
}

export enum StartTypes {
  UsersTurn,
  OpponentsTurn,
}

export type GameAction = {
  type: GameActionTypes;
  payload: number;
  error?: string;
};

export type Dispatch = (action: GameAction) => void;
