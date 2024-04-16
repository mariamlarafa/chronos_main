import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  profileContainer: {
    maxWidth: "100%",
    margin: "auto",
    height:'100%',
    display:'block',
    position:'relative'
  },
  gridItem:{
    paddingTop:'0 !important'
    },

  sizeInfoCard: {
    // marginTop:-40,
    padding: 0,
    backgroundColor: "transparent"
  },
  profileInformation: {
    background: "white",
    padding: 30,
    width: "calc(100% - 60px)",
    margin: "auto",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    position: "relative",
    borderRadius: 10,
    minHeight: "40vh",
    marginTop: -40,
    height:'calc(100% - 20px )',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 24
  },
  creationDate: {
    fontSize: 16,
    color: "#a7a5a5",
    textAlign: "right",
    fontWeight: 500
  },
  profileInfo: {
    fontSize: 18,
    margin: 0,
    fontWeight: 600
  },
  profileImage: {
    borderRadius: 10
  },
  labels: {
    fontWeight: "400",
    fontStyle: "italic",
    fontSize: 14
  },
  updateProfile: {
    width: "100%",
    padding: "15px 0",
    color: "var(--white)",
    border: "none",
    borderRadius: 5,
    backgroundColor: "var(--dark-green)",
    fontWeight: 500,

    fontFamily: "'MyriadPro', sans-serif !important",
    fontSize: 15,
    transition: "0.3s all ease-in-out",
    "&:hover": {
      backgroundColor: "var(--light-green)"
    },
    '&.orange':{
      backgroundColor: "var(--orange)"
    },
    '&.orange:hover':{
      // backgroundColor: "var(--orange)",
      opacity:0.7
    }

  },
  input: {
    width: "100%"
  },
  formItem: {
    display: "flex",
    gap: 5,
    flexDirection: "column !important"
  },
  changePasswordBtn: {
    color: "var(--light-green)",

    // boxShadow: '0px 13px 22px -17px rgba(0,0,0,0.3)',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "left",
    padding: "5px 0",
    borderRadius: 50,
    height: 30,

    fontWeight: 600,
    transition: "0.3s all ease-in-out",
    textDecoration:'underline',
    fontSize:14,
    "&:hover": {
      color: "var(--orange)"
    }
  },
  //main info
  mainInfo: {
    padding: 0,
    backgroundColor: "transparent",
    height: "100%"
  },

  bgBottom: {
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,

    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#17917f"
  },
  bgTop: {
    padding: 20,
    paddingBottom: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#17917f"
    // minHeight:300
  },
  bottomSide: {
    padding: 20,
    paddingTop: 0,
    height: "calc(100% - 40px)"
  },
  hoverCard: {
    height: "100%",
    backgroundColor: "var(--white)",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    borderRadius: 30,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  keyFigures: {
    padding: "50px 0",
    backgroundColor: "var(--white)",
    textAlign: "center",
    borderRadius: 10,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-evenly"
  },
  keyFigure: {
    // margin: "auto",
    height: 150,
    width: 150,
    display: "flex",

    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    boxShadow: "0px 4px 31px 0px rgba(0,0,0,0.3)",

    borderRadius: "100%",
    // backgroundColor:'rgb(208, 242, 255)',
    "& h3, p": {
      margin: 0
    },
    "&.green": {
      backgroundColor: "var(--pastel-green)"
    },
    "&.blue": {
      backgroundColor: "var(--pastel-blue)"
    },

    "&.orange": {
      backgroundColor: "var(--pastel-orange)"
    },
    "& .key-value": {
      fontSize: 32,
      fontWeight: 600
    }
  },
  keyFigureIconContainer: {
    // boxShadow: "0px 15px 24px -8px rgb(0 0 0)",
    border:'3px solid white',
    width: 34,
    height: 34,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "100%",
    position: "absolute",
    top: -20,
    backgroundColor: "var(--orange)",
    "& svg": {
      width: 18,
      // height: 18,
      height: "80%",
      fill: "var(--white)"
    },
    "&.green": {
      background: "linear-gradient(135deg, #aaf3e3ad 0%, #20b7a1 100%)",
      "& svg": {
        fill: "var(--light-green)"
      }
    },
    "&.blue": {
      background:
        "linear-gradient(135deg, var(--pastel-blue) 0%, rgb(16, 57, 150)  100%)",
      "& svg": {
        fill: "rgb(16, 57, 150)"
      }
    },
    "&.orange": {
      background:
        "linear-gradient(135deg, var(--pastel-orange) 0%, var(--orange) 100%)",
      "& svg": {
        fill: "var(--orange)"
      }
    }
  },
  keyValueContainer: {
    height: 75,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--light-green)"
  },
  keyContent: {
    marginTop: 10,
    backgroundColor: "var(--light-green)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    height: 70,
    justifyContent: "center",
    "& .key-title": {
      fontWeight: 600,
      fontSize: 20,
      marginTop: 5,
      color: "var(--white)"
    },

    "&.green": {
      color: "var(--light-green)"
    },
    "&.orange": {
      color: "var(--orange)"
    },
    "&.blue": {
      color: "rgb(16, 57, 150)"
    }
  },

  agenda: {
    padding: 20,
    marginTop: -40,
    height: "100%",
    maxHeight: "calc(100% - 10px)",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    background: "white",
    borderRadius: 10,
    width: "calc(100% - 40px)",
    margin: "auto",

    // height: 'calc(100% - 60px)',
    // minHeight: '100%',
    "& .css-flbe84-MuiDayCalendar-weekContainer , .css-i5q14k-MuiDayCalendar-header":
      {
        justifyContent: "space-evenly"
      },
    "& .css-1u23akw-MuiButtonBase-root-MuiPickersDay-root, .css-168nijn-MuiPickersDay-root, .css-rhmlg1-MuiTypography-root-MuiDayCalendar-weekDayLabel, .css-jgls56-MuiButtonBase-root-MuiPickersDay-root":
      {
        width: 50,
        height: 50
      },
    "& .css-15v8kdh-MuiPickersFadeTransitionGroup-root-MuiDateCalendar-viewTransitionContainer, .css-14iq4xa-MuiDayCalendar-root,.css-1e81enl-MuiDateCalendar-root":
      {
        height: "100%"
      },
    "& .css-1cafy48-MuiPickersSlideTransition-root-MuiDayCalendar-slideTransition":
      {
        minHeight: "100%"
      },
    "& .css-15v8kdh-MuiPickersFadeTransitionGroup-root-MuiDateCalendar-viewTransitionContainer > div":
      {
        height: "100%"
      }
  },
  list:{
    maxHeight:'calc(60vh - 80px)',
    overflowY:'auto',

    '&::-webkit-scrollbar': {
      width: '8px',
  },

  '&::-webkit-scrollbar-track': {
      WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      borderRadius: '10px',
  }
   ,
  '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
    background:'var(--pastel-green)'
    },
  }
});
