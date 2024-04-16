import { Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Navigate, useNavigate, useParams } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import {
  useResetPasswordWithTokenMutation,
  useVerifyResetPasswordTokenMutation
} from "../../../store/api/auth/authentification";
import { styles as layoutStyles } from "../../reset_password/style";
import Loading from "../loading/Loading";
import { notify } from "../notification/notification";
import { styles } from "./styles";

import faSadFace from '../../public/svgs/light/face-sad-tear.svg';

import faResetPassword from "../../public/svgs/solid/badge-check.svg";
import useVerifyPasswordToken from "../../../services/fetchers/verifyresetPasswordToken.fetch.service";


const ResetPasswordNotAuthForm = () => {
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const classes = styles();
  const layoutClasses = layoutStyles();
  const params = useParams();
  const navigate = useNavigate();
  const [isReset, setIsReset] = useState(false)
  const [counter, setCounter] = useState(5)
  const [resetPasswordWithToken, { isLoading: loadingReset }] =
  useResetPasswordWithTokenMutation();
  const [password, setPasswordError] = useState({
    error: false,
    message: ""
  });
  const isLoading = useVerifyPasswordToken(setPasswordError)
  // const [first, setfirst] = useState(second)

  // useEffect(() => {
  //   async function verifyToken() {
  //     try {
  //       await verifyResetPasswordToken(params.token).unwrap();
  //     } catch (error) {
  //       console.log(error);
  //       setPasswordError({ error: true, message: error?.data?.message });
  //     }
  //   }
  //   verifyToken();
  // });

//counter logic
useEffect(() => {
  let interval;

  if (isReset) {
    interval = setInterval(() => {
      if (counter > 0) {
        setCounter((prevCount) => prevCount - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  return () => {
    clearInterval(interval); // Clear the interval when the component unmounts
  };
}, [isReset, counter]);


  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPasswordWithToken({        password: newPasswordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
        token:params.token
      }).unwrap();
      notify(NOTIFY_SUCCESS, res.message);
      setIsReset(true)
      setTimeout(() => {
          navigate('/login')

      }, 7000);

    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
      setIsReset(false)
    }
  };

  if (loadingReset || isLoading) return <Loading />;
  if (!params.token) return <Navigate to="/login" replace />;

  return (
    <div className={layoutClasses.resetPasswordPage}>
      {!password.error ? (
        <Box className={layoutClasses.box}>
            {isReset&&
              <div className={layoutClasses.imageContainer}>
              <ReactSVG
                src={faResetPassword}
                className={`${layoutClasses.notificationIcon} success`}
              />
            </div>
            }

          <h2 className={layoutClasses.pageTitle}>{!isReset?"Reset your password":"Your password has been reset"}</h2>
          <h3 className={layoutClasses.text}>
            {!isReset?"Please type in you new password and re-confirm it":
              <span>
                Congratulation you've reset you password successfully. please be careful with  your credentials.
                You'll be redirected to the login page in {counter} seconds. if something went wrong you can use this <NavLink to="/login">link</NavLink>
              </span>
            }
          </h3>

          {!isReset&&<div className={classes.authUserForm}>

            <form method="POST" onSubmit={handleResetPassword}>
              <Grid container spacing={2}>
                {password.error && (
                  <Grid item xs={12} lg={12}>
                    <span className={classes.errorText}>
                      {password.message}
                    </span>
                  </Grid>
                )}
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={password.error}
                    size="small"
                    type="password"
                    label="New Password"
                    name="password"
                    inputRef={newPasswordRef}
                    className={classes.input}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={password.error}
                    required
                    size="small"
                    type="password"
                    label="Confirm new password"
                    name="password"
                    inputRef={confirmPasswordRef}
                    className={classes.input}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <button type="submit" className={classes.emailSendBtn}>
                    {" "}
                    Reset your password{" "}
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>}
        </Box>
      ) : (
        <Box className={layoutClasses.box}>
          <div className={layoutClasses.imageContainer}>
                <ReactSVG
                  src={faSadFace}
                  className={`${layoutClasses.notificationIcon} failed`}
                />
              </div>
          <h2 className={classes.titleAction}>Oopps! Something happened</h2>
          <h3 className={classes.errorText}>{password.message}</h3>
          <NavLink to='/login'>Go to login</NavLink>
        </Box>
      )}

    </div>
  );
};

export default ResetPasswordNotAuthForm;
