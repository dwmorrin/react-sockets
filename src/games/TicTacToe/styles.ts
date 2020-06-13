import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  board: {
    margin: "auto",
    flexWrap: "wrap",
    height: 300,
    width: 400,
  },
  square: {
    width: "33%",
  },
  paper: {
    cursor: "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
});

export default useStyles;
