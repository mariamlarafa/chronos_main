import { createUseStyles } from "react-jss";

export const dailyLogStyle = createUseStyles({
  dailyLogPage: {
    maxHeight: "100%",
    width: "100%",
    height: "100%",
  },
  fade: {
    transition: "all 0.3s ease-in-out",
  },
  card: {
    overflow: "hidden",
    height: "auto",
    backgroundColor: "var(--white)",
    borderRadius: 30,
    padding: 10,
    position: "relative",
    transition: "all 0.3s ease-in-out",

    "&.hidden": {
      padding: 0,
      height: 0,
      overflowY: "hidden",
    },
    "&.collapsed": {
      padding: 10,
      height: "100%",
      overflow: "hidden",
      maxHeight: "calc(100% - 20px )",
    },
    '& .list':{
      height:'100%'
    }
  },
  scrollView: {
    maxHeight: "85%",

    height: "auto",
    overflowY: "auto",

    "&::-webkit-scrollbar": {
      width: "8px",
    },

    "&::-webkit-scrollbar-track": {
      WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
      background: "var(--pastel-green)",
    },
  },
  sectionTitle: {
    marginTop: 0,
  },
  taskList: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  taskItem: {
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    // padding: "10px 0px",
    height: 35,
    paddingRight: 30,

    justifyContent: "space-between",
    border: "1px solid var(--app-bg-color)",
    transition: "all 0.3s ease-in-out",
    marginBottom: 10,
    '&.appendables':{
      paddingLeft: 30,
    },
    "&:hover": {
      backgroundColor: "var(--app-bg-color)",
      "& $hideTaskBtn": {
        width: 50,
      },
    },
    borderRadius: 10,
    "& .slider": {
      "& .MuiSlider-markLabel": {
        color: "grey",
        fontSize: 9,
      },
      width: "30%",
    },
    "& .project-name, .task-name": {
      fontSize: 13,
      // background:'red'
    },
    "& .project-name": {
      width: "20%",
    },
    "&.single .project-name": {
      width: "100%",
    },
    "&.multiple .task-name": {
      width: "40%",
    },
    "&.multiple .tache-state": {
      fontSize: 13,
      width: "10%",
    },
    "&.danger": {
      backgroundColor: "#e74c3c2e",
    },
  },
  usersTasks: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    height: "100%",
  },
  joinBtn: {
    background: "none",
    border: "none",
    width: 32,
    height: 32,
    borderRadius: "100%",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "var(--orange)",
      "& $icon": {
        fill: "white",
      },
    },
  },
  icon: {
    width: 18,
    height: 18,
  },
  sectionHeader: {
    display: "flex",
    gap: 20,
    padding: 20,
    alignItems: "center",
  },
  datePicker: {
    "& .MuiInputBase-root.MuiOutlinedInput-root": {
      height: 40,
    },
  },
  warning: {
    color: "red",
    fontWeight: 600,
    fontSize: 14,
    marginLeft: 5,
  },
  hideTaskBtn: {
    width: 0,
    overflow: "hidden",
    height: "100%",
    backgroundColor: "var(--toastify-color-progress-error)",
    border: "none",
    transition: "all 0.3s ease-in-out",
    padding: 0,
    "& div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        fill: "var(--white)",
        width: 22,
        height: 22,
      },
    },
  },
  openPickerIcon: {
    height: 18,
    width: 18,
    borderRadius: "100%",
    backgroundColor: "var(--light-green)",
    padding: 3,
    fill: "white !important",
  },
  joinableContainer:{
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    // background: 'red',
    gap: '25px',
  }
});
