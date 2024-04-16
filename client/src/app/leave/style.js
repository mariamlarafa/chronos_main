// style.js

import { createUseStyles } from "react-jss";

export const leaveComponentStyles = createUseStyles({
  root: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100% - 100px)", // Adjust the height as needed
  },
  redLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: "var(--toastify-icon-color-error)",
    borderRadius: 4,
    padding: "5px 0",
    width: "150px",
    textAlign: "center",
    border: "2px solid var(--toastify-icon-color-error)",
  },
  roleBtn: {
    margin :"10px",
  },
  list: {
    height: "calc(100% - 53px) !important",
    borderRadius: "30px !important",
    overflow: "hidden !important",
    background: "var(--white)",
    padding: "20px",
    margin: "20px",
    "& .MuiDataGrid-root": {
      border: "1px solid var(--gray)",
      borderRadius: "0 0 10px 10px",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "var(--white)",
      color: "var(--dark-green)",
      "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: "600 !important",
      },
    },
    "& .MuiDataGrid-virtualScroller": {
      width: "100%",
      margin: "auto",
      marginTop: "-20px",
      position: "relative",
      background: "var(--white)",
      boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
      maxHeight: "calc(100% - 50px)",
      overflow: "auto !important",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "10px",
        background: "var(--pastel-green)",
      },
      "& .MuiDataGrid-virtualScrollerContent": {
        height: "100% !important",
      },
    },
    "& .MuiDataGrid-row, .MuiDataGrid-cell ": {
      minHeight: "42px !important",
      maxHeight: "42px !important",
      border: "none !important",
    },
    "& .MuiDataGrid-footerContainer": {
      display: "none !important",
    },
  },
  titleSection: {
    backgroundColor: "var(--light-green)",
    padding: "30px",
    borderRadius: "30px 30px 0 0",
    marginBottom: "10px",
  },
  spanT: {
    margin: "10px",
    color: "white",
    fontWeight: 6,
    fontSize: "20px",
    fontFamily: "'MyriadPro', sans-serif !important",
  },
  textDesc: {
    width: "80%",
    display: "inline-block",
    marginTop: "10px",
    marginLeft: "10px",
    color: "black",
    fontWeight: 6,
    fontSize: "15px",
    fontFamily: "'MyriadPro', sans-serif !important",
  },
  tableContainer: {
    width: "82%",
    },
    orangeText: {
      float: 'right',
      backgroundColor:" #E76009",
      padding: '10px',
      color: 'white',
      paddingRight: '-20px',
      height : "100px",
      marginRight : "0px",
      width : "13%",
      borderBottomLeftRadius: '20px', // Add curved border radius to the bottom left corner
      borderBottomRightRadius: '20px'
    },
    greenText: {
      float: 'right',
      backgroundColor: "var(--light-green)",
      padding: '10px',
      color: 'white',
      paddingRight: '20px',
      height : "100px",
      width : "13%",
      borderBottomLeftRadius: '20px',
      zIndex :'1'
    },
  contentSection: {
    background: "var(--white)",
    borderRadius: "20px",
    paddingBottom: "20px",
    paddingLeft : '20px',
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    position: "relative",
    zIndex: "1",
    marginTop: "-20px",
    height: "calc(100% + 10px)",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "8px",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-track": {
      WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      borderRadius: "10px",
      backgroundColor: "var(--light-green)",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      background: "var(--pastel-green)",
    },
  },
  
  newLeaveForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px auto',
    width: '50%',
  },
  newLeaveFormItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px',
  },
  datePicker: {
    margin :"10px",
    height :"50px",
    width: 'calc(50% - 5px)', // Adjust as needed
    borderRadius: '5px',
    border: '1px solid gray', // Change border color to gray
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
});
