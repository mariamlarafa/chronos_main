import { createUseStyles } from "react-jss";

export const ManagingLeavesStyles = createUseStyles({
  root: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100% - 100px)", // Adjust the height as needed
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
    fontWeight: 600,
    fontSize: "20px",
    fontFamily: "'MyriadPro', sans-serif !important",
  },
  contentSection: {
    background: "var(--white)",
    borderRadius: "20px",
    paddingBottom: "20px",
    paddingLeft: "20px",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    position: "relative",
    zIndex: 1,
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
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "6%",
  },
  roleBtn: {
    margin: "10px",
  },
  tableContainer: {
    width: "90%",
  },
  detailBlock: {
    position: "relative",
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  },
  innerDetailBlock: {
    width: "100%",
    height: "200px",
    border: "1px solid gray",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius :"10px",
    marginRight :"10px",
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
});
