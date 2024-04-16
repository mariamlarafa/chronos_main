import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  resetPasswordPage: {
    height: "100%",
    display: "flex",
    margin:'auto',
	  justifyContent: "center",
    alignItems: "center",
    "& $box button": {
      width: "100%",
      height: 50,
      backgroundColor: "var(--light-green)",
      color: "var(--white)",
      fontSize: 16,
      fontWeight: 500,
      // textTransform: "capitalize",

      outline: "none",
      border: "none",
      transition: "all 0.3s ease-in-out",
      borderRadius:4,
      "&:hover": {
        backgroundColor: "var(--dark-green)",
        transform: "scale(1.1)",
        outline: "none",
        border: "none"
      }
    }
  },

  box: {
    width: 400,
    backgroundColor: "white",
    border: "none rgb(230, 235, 241)",
    borderRadius: 4,
    padding: 40,
    textAlign: "center"
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 600,
    textAlign: "center"
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 30
  },
  imageContainer: {
    width: 200,
    margin: "10px auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  notificationIcon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: 150,
    width: 150,
    alignItems: "center",
    borderRadius: "100%",
    "& svg": {
      width: "100%"
    },
    "&.success": {
      // background:'#21bf62',
      fill: "#21bf62"
    },
    "&.failed": {
      fill: "red"
    }
  },
  goBack:{
    display:'flex',
    color:'var(--black)',
    fontWeight:500,
    textDecoration:'none',
    alignItems:'center',
    transition:'all 0.3s ease-in-out',
    gap:5,
    '&:hover':{
      color:'var(--orange)'
    }
  },
  goBackIcon:{
    width:16,
    height:16,
    fill:'var(--orange)',
    '& svg':{

      width:16,
      height:16,
    }
  }
});
