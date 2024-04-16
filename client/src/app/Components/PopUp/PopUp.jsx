import React from "react";
import AddBtn from "../managing/AddBtn";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import Slide from '@mui/material/Slide';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


const PopUp = ({
  open,
  handleClose,
  handleSubmit,
  title,
  text,
  btnText,
  icon,
  children,
  loading,
  btnLevel,
  className
}) => {
  return (
    <Dialog
      className={className?className:""}
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      TransitionComponent={Transition}

    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">{text}</DialogContentText>
        {children}
      </DialogContent>


      {handleSubmit&&
      <DialogActions>
        <AddBtn
        level={btnLevel}
        handleAdd={handleSubmit}
        title={btnText}
        // large="large"
        icon={icon}
        loading={loading}
        />
      </DialogActions>
      }
    </Dialog>
  );
};

export default PopUp;
