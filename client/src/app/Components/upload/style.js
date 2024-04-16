import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  uploaderForm: {
    position: "relative"
  },
  uploadContainer: {
    // background: "orange",
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    transition: "all 0.3s ease-in-out",
    padding: " 48px 0",
    borderRadius: 5,
    width:'fit-content'

  },
  btnFileInput: {
    height: 150,
    width: 150,
    borderRadius: "100%",
    margin: "auto",
    border: "3px dashed black",
    background: "white",
    color: "black",
    fontWeight: 700,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  loader: {
    position: "absolute",
    // top:'50%'
    margin: "auto",
    top: "45%",
    bottom: "45%",
    left: "45%",
    right: "45%"
  },
  blur: {
    // opacity: 0.5,
    filter:'brightness(0.5)'
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: "100%",
    // overflow: "hidden",
    position: "relative",
    transition: "0.3s all ease-in-out",

    boxShadow: '0px 18px 15px -3px rgba(0,0,0,0.1)',
  },
  ctaBtn: {
    position: "absolute",
    bottom: 0,
    right:0,
    display: "flex",
    "& button": {
      backgroundColor: "white",
      width: 42,
      height: 42,
      opacity: 1,
      fontSize: 16,
      fontWeight: 600,
      borderRadius: '100%',
      border: "none",
      transition: "0.3s all ease-in-out",
      fill: "var(--orange)",
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
      "& svg": {
        width: 18
      },
      "&.br": {
        borderRight: "1px solid grey"
      },
      "&:hover": {
        opacity: 0.5
      }
    }
  },
  helpText: {
    position: "absolute",
    fontWeight: 700,
    fontSize: 14,
    top: "45%",
    left: "12.5%",
    width: "75%",
    textAlign: "center",
    zIndex: 999,
    color: "white",
    opacity: 0,
    height: 0,
    overflow: "visible",
    transition: "0.3s all ease-in-out"
  },
  profileImage: {
    borderRadius:'100%',
    transition: "0.3s all ease-in-out",
    "&:hover": {
      "& + .helpText": {
        opacity: 1
      },
      // background:"blue",
      filter: "brightness(0.2)"
    },
    width: "100%",
    height:'100%'
  },
  savingLoader:{
    position:'absolute',
    left:'40%',
    top:'40%',
  },

});
