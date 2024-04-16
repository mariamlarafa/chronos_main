
import { Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React from 'react'
import { projectTaskDetails } from './style'

import faSave from "../../public/svgs/light/floppy-disk.svg";
import { ReactSVG } from 'react-svg';
import Loading from '../loading/Loading';



const HoursPopUp = ({open,close,title,text,handleChange,defaultVal,minValue ,submit,btnText,loading}) => {
    const classes = projectTaskDetails()

  return (
    <Dialog
    open={open}
    onClose={close}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
     {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {text}
      </DialogContentText>
      <TextField
        label="heurs"
        type="number"
        className={classes.inputs}
        onChange={handleChange}
        defaultValue={defaultVal}
        inputProps={{ min: minValue}}
      />
      <button
        className={classes.persistHours}
        onClick={submit}
      >
        {
        !loading?
        <ReactSVG  className={classes.btnSaveIcon} src={faSave}/>
        :
        <Loading color='var(--white)' className={classes.btnLoader} />
    }
       {btnText}
      </button>

    </DialogContent>

  </Dialog>
  )
}

export default HoursPopUp