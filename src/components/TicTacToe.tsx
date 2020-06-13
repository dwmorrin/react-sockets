import React, { FC, useReducer } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Dialog,
  Button,
} from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import { range } from "ramda";
import useStyles from "../games/TicTacToe/styles";
import initialState from "../games/TicTacToe/initialState";
import reducer from "../games/TicTacToe/reducer";

const TicTacToe: FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [board] = state.game;

  return (
    <Box>
      <Grid className={classes.board} container spacing={3}>
        {range(0, 9).map((index) => (
          <Grid className={classes.square} item key={index}>
            <Paper
              className={classes.paper}
              onClick={() => dispatch({ type: "move", payload: index })}
            >
              <Typography variant="h1">{board[index]}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={state.gameOver}>
        <Button onClick={() => dispatch({ type: "reset", payload: 0 })}>
          Reset
        </Button>
      </Dialog>
    </Box>
  );
};

export default TicTacToe;
