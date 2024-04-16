"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = void 0;

var _reactJss = require("react-jss");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = (0, _reactJss.createUseStyles)({
  sidebar: {
    height: "100%",
    '& .ps-sidebar-container': _defineProperty({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '0.75rem',
      background: 'rgb(10,82,59)'
    }, "background", 'linear-gradient(42deg, rgba(231,96,9,1) 25%, rgba(255,167,38,0.8561799719887955) 69%)')
  },
  sidebarHeader: {
    height: 50,
    padding: 14,
    borderBottom: "1px solid lightgrey",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    "& img": {
      width: "50px" // height:'100%'

    }
  },
  companyName: {
    fontWeight: "bold",
    fontSize: 16
  },
  bars: {
    height: 40,
    width: 50,
    padding: 0,
    color: "white",
    //temporarly
    backgroundColor: "#060623",
    border: "none",
    borderRadius: 10
  },
  link: {
    fontWeight: 500,
    color: "black",
    textTransform: "capitalize",
    fontSize: 14,
    "& a:hover": {
      backgroundColor: "#EFE7DE !important"
    }
  },
  linkIcon: {
    width: 18,
    height: 25,
    // color:'#754619',
    fill: "#754619"
  }
});
exports.styles = styles;