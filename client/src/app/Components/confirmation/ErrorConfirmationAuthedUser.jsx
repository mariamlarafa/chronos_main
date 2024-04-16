import { Box } from "@mui/system";
import React from "react";

import { NavLink } from "react-router-dom";
import { styles } from "./style";

const ErrorConfirmationAuthedUser = () => {
  const classes = styles();
  return <Box className={classes.card}>
    <h2 className={classes.boxTitle}>
        We're sorry but seems you're not meant to be here
    </h2>
    <p>in 5 seconds you'll be redirected to your home page. if something went wrong you can click the  <NavLink to='/'>link </NavLink> </p>
  </Box>;
};

export default ErrorConfirmationAuthedUser;
