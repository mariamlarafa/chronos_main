import { Box, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useLoginUserMutation } from "../../store/api/auth/authentification.js";
import { setCredentials } from "../../store/reducers/auth.js";
// import logo from "../public/images/chronos.png";
import logo from '../public/svgs/Kairos logo_3.svg';
import { styles } from "./style.js";
// import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from "react";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR } from "../../constants/constants.js";
import { SUPERUSER_ROLE } from "../../constants/roles.js";
import Loading from "../Components/loading/Loading.jsx";
import { notify } from "../Components/notification/notification.js";
import { toggleSideBar } from "../../store/reducers/sidebar.reducer.js";
const Login = () => {
  const classes = styles();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate =useNavigate()

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await loginUser({
        email: emailRef.current.value,
        password: passwordRef.current.value
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      dispatch(toggleSideBar(false))
      setTimeout(() => {
          if (res?.user?.role === SUPERUSER_ROLE){
            navigate('/admin/manage/projects')

          }else{
              navigate('/profile/me')

          }
          setLoading(isLoading)
      }, 2000);
    } catch (err) {
      setLoading(isLoading)
      notify(NOTIFY_ERROR,err.data?.message)
    }
  };

  return (
    <div className={classes.loginPage}>


    <div className={classes.bg}>
      {/* <div className={classes.bgLogo}>
      <ReactSVG src={logo} alt="logo" />
      </div> */}
      <Box className={classes.loginBox}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid item xs={12} lg={12} md={12}>
              {/* <h1 className={classes.boxTitle}>Login</h1> */}
              <div className={classes.topLogo}>
        <ReactSVG src={logo} alt="logo" />

      </div>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              {loading && (
                <Loading/>
              )}
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              {/* <TextField required size="small" inputRef={emailRef} className={classes.input} id="email" name="email" label="Email" variant="outlined" /> */}
                <label className={classes.labels} htmlFor="email">
                  Addresse Email
                </label>
              <TextField
                required
                size="small"
                inputRef={emailRef}
                autoComplete="on"
                className={classes.input}
                id="email"
                name="email"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
            <label className={classes.labels} htmlFor="password">
                  Mot de passe
                </label>
              <TextField
                type="password"
                autoComplete ="true"
                required
                size="small"
                inputRef={passwordRef}
                className={classes.input}
                id="password"

                variant="outlined"

              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <NavLink className={classes.resetLink} to={"/reset-password"}>Mot de passe oublié ?</NavLink>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              <Button className={classes.loginBtn} type="submit" variant="outlined">
                Se connecter
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        /> */}
      </Box>
    </div>
    </div>
  );
};

export default Login;
