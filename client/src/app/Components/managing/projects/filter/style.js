import { createUseStyles } from "react-jss";

export const filterStyles = createUseStyles({
  filters: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  filter: {
    width: "100%",
    "& .MuiInputBase-root.MuiOutlinedInput-root": {
      paddingRight: 5,
      background: "var(--white)"
    },

    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      fontWeight: 600
      //  color:'var(--white)',
      //  gap:10,
    },
    "& .css-3jdtmo-MuiFormLabel-root-MuiInputLabel-root": {
      // top:-5,
      fontSize: 11
    },
    "& .css-xjos08-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
      color: "var(--orange) !important"
    }
  },
  managerFullName: {
    marginLeft: "10px !important",
    fontWeight: 500
  },
  filterArrowIcon: {
    width: 22
  },
  tableHeader: {
    color: "var(--white) !important",
    fontWeight: "600 !important",
    position: "relative",
    padding: "0 10px !important",
    // position: "relative",
    "& button": {
      background: "none",
      border: "none",
      borderRadius: 10,
      transition: "all 0.5s ease-in-out",
      display: "flex",
      color: "var(--white)",
      fontWeight: "600 !important",
      gap: 5,
      height: 30,
      alignItems: "center",
      width: "fit-content",
      "&:hover": {
        background: "var(--white-hover)"
      }
    }
  },

  filterBtn: {
    "& svg": {
      width: 11,
      height: 11,
      fill: "var(--bright-orange) "
    }
  },
  filterContainer: {
    position: "absolute",
    color:'black',
    background: "var(--white)",
    borderRadius: 10,
    zIndex:999,
    border:'2px solid var(--bright-orange)',
    boxShadow:' 0px 13px 15px -3px rgba(0,0,0,0.1)',
  },
  activeFilterSkeleton:{
    // backgroundColor: "var(--dark-green) !important",
    borderRadius: 10,
    width:200,
    height:40,
    marginTop:'1%'
  },
  activeFilterList:{
    marginTop:'1%',
    '& ul':{
      listStyle:'none',
      display: 'flex',
      gap:10
    },
    '& li':{
      borderRadius:20,
      // background:'var(--dark-green)'
      border:'1px solid var(--app-bg-color)',
      padding:'2px  5px 2px 20px',

    },
    '& span.title':{
      fontWeight:600,
      color:'var(--white)',
      fontSize:11,
    },
    '& span.value':{
      marginTop:5,
      display: 'flex',
      gap:5
    },
    '& .filter-value':{
      display: 'flex',
      flexDirection:'column',
      fontWeight:600,
      color:'var(--black)',
      fontSize:14,

    }
  },
  activeFilter:{
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    gap:20,
    '& button':{
      backgroundColor:'var(--app-bg-color)',
      fill:'var(--black)',
      border:'none',
      height:24,
      minWidth:24,
      width:24,
      borderRadius:'100%',
      '&:hover':{
        backgroundColor:'var(--white-hover)',
      }
    },
    '&.standalone':{
      '& .title':{
        fontSize:14,
        textTransform:'capitalize'
      }
    }
  },


});
