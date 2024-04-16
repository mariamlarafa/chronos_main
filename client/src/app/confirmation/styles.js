import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  confirmationPage: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto"
  },
  box: {
    width: 400,
    backgroundColor: "white",
    border: "none rgb(230, 235, 241)",
    borderRadius: 4,
    padding: 40,
    textAlign: "center"
  },
  boxTitle: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center"
  },
  inputs: {
    width: "100%"
  },
  saveBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "var(--light-green)",
    color: "var(--white)",
    fontSize: 16,
    fontWeight: 500,
    textTransform: "capitalize",
    outline: "none",
    border: "none",
    transition: "all 0.3s ease-in-out",
    borderRadius: 4,
    "&:hover": {
      backgroundColor: "var(--dark-green)",
      transform: "scale(1.1)",
      outline: "none",
      border: "none"
    }
  }
});
