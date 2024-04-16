import { Grid, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { useRequestResetPasswordMutation } from "../../../store/api/auth/authentification";
import Loading from "../loading/Loading";
import { notify } from "../notification/notification";
import { styles } from "./styles";

const ResetNotAuthUser = ({ handleSuccess, handleFailure }) => {
  const emailRef = useRef();
  const classes = styles();

  // const [password, setPasswordError] = useState({
  //   error: false,
  //   message: ""
  // });

  const [requestResetPassword, { isLoading }] =
    useRequestResetPasswordMutation();


  const handleVerificationSuccess = ()=>{
    setIsEmailVerified(true);
    handleSuccess()
  }
  const handleVerificationFailure = ()=>{
    setIsEmailVerified(false);
    handleFailure()
  }

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const handleSubmitEmailForm = async (e) => {
    e.preventDefault();

    try {
      const res = await requestResetPassword({
        email: emailRef.current.value
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      handleVerificationSuccess()

    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
      handleVerificationFailure()
    }
  };

  const EmailVerificationForm = () => {
    return (
      <form method="POST" onSubmit={handleSubmitEmailForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              required
              type="email"
              className={classes.input}
              name="email"
              variant="outlined"
              label="Adresse Email"
              inputRef={emailRef}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <button type="submit" className={classes.emailSendBtn}>
              Réinitialiser le mot de passe
            </button>
          </Grid>
        </Grid>
      </form>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className={classes.authUserForm}>
      {!isEmailVerified ? (
        <EmailVerificationForm />
      ) : (
        <>
        <h3 className={classes.titleAction}>Addresse Email vérifié </h3>
          <div className={classes.validContainer}>
          votre email a été vérifié et nous vous avons envoyé un lien de demande pour pouvoir réinitialiser votre mot de passe.
          pour pouvoir réinitialiser votre mot de passe. Vous pouvez fermer cette page en toute sécurité.
        </div>
        </>
      )}

    </div>
  );
};

export default ResetNotAuthUser;
