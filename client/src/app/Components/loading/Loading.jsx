import React from 'react'
import {style} from './style.js'
import ClipLoader from "react-spinners/ClipLoader";

const Loading = ({color="#e76009",className}) => {
    const classes = style()
  return (
    <div className={className?className:classes.loaderContainer}>
    <ClipLoader color={color} />
  </div>
  )
}

export default Loading