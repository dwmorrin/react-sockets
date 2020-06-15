import React, { FC } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { range } from "ramda";
import useStyles from "../games/TicTacToe/styles";
import { GameActionTypes, Dispatch, Board } from "../games/TicTacToe/types";

const TicTacToeBoard: FC<{ dispatch: Dispatch; board: Board }> = ({
  dispatch,
  board,
}) => {
  const classes = useStyles();
  return (
    <Grid className={classes.board} container spacing={3}>
      {range(0, 9).map((index) => (
        <Grid className={classes.square} item key={index}>
          <Paper
            className={classes.paper}
            onClick={() =>
              dispatch({ type: GameActionTypes.Move, payload: index })
            }
          >
            <Typography variant="h1">{board[index]}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default TicTacToeBoard;
