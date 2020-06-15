import React, { FC, useReducer, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Dialog,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
} from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import useStyles from "../games/TicTacToe/styles";
import {
  GameActionTypes,
  ResetTypes,
  ChangeOpponentTypes,
} from "../games/TicTacToe/types";
import initialState from "../games/TicTacToe/initialState";
import reducer from "../games/TicTacToe/reducer";
import api from "../games/TicTacToe/api";
import TicTacToeBoard from "./TicTacToeBoard";
import { not } from "ramda";

const TicTacToe: FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [board] = state.game;

  useEffect(() => {
    api.listen(dispatch);
    return () => {
      api.disconnect();
    };
  }, []);

  return (
    <Box>
      <Grid className={classes.topbar}>
        <span>
          <Typography>You</Typography>
          <Avatar className={state.usersTurn ? classes.activePlayer : ""}>
            {state.usersToken}
          </Avatar>
        </span>
        <FormControlLabel
          control={
            <Switch
              checked={not(state.opponentIsComp)}
              onChange={(event) =>
                dispatch({
                  type: GameActionTypes.ChangeOpponent,
                  payload: event?.target.checked
                    ? ChangeOpponentTypes.PlayHuman
                    : ChangeOpponentTypes.PlayComputer,
                })
              }
            />
          }
          label={`Play Online${
            state.opponentIsComp ? " (You are playing the computer)" : ""
          }`}
        />
        <span>
          <Typography>Them</Typography>
          <Avatar
            className={
              state.gameOver || state.usersTurn ? "" : classes.activePlayer
            }
          >
            {state.opponentsToken}
          </Avatar>
        </span>
      </Grid>
      <TicTacToeBoard dispatch={dispatch} board={board} />
      <Dialog open={state.gameOver}>
        {state.waiting ? (
          <Typography variant="body1">Waiting for another player...</Typography>
        ) : (
          <Button
            onClick={() =>
              dispatch({
                type: GameActionTypes.Reset,
                payload: ResetTypes.StayInRoom,
              })
            }
          >
            Start New Game
          </Button>
        )}
        {state.opponentIsComp ? (
          ""
        ) : (
          <Button
            onClick={() =>
              dispatch({
                type: GameActionTypes.ChangeOpponent,
                payload: ResetTypes.LeaveRoom,
              })
            }
          >
            Cancel
          </Button>
        )}
      </Dialog>
      <Dialog open={!!state.error}>
        <Typography variant="h6">{state.error}</Typography>
        <Button
          onClick={() =>
            dispatch({
              type: GameActionTypes.CloseError,
              payload: 0,
            })
          }
        >
          Close
        </Button>
      </Dialog>
    </Box>
  );
};

export default TicTacToe;
