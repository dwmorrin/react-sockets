import React, { FC } from "react";
import { Router } from "@reach/router";
import TicTacToe from "./TicTacToe";

const App: FC = () => (
  <Router>
    <TicTacToe path="/" />
  </Router>
);

export default App;
