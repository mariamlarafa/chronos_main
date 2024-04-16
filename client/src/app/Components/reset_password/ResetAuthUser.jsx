import { Grid, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import {
  useCheckCurrentPasswordMutation,
  useResetUserPasswordMutation
} from "../../../store/api/auth/authentification";
import { notify } from "../notification/notification";
import { styles } from "./styles";

const ResetAuthUser = ({handleSuccess,handleFailure}) => {
  const classes = styles();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [currentIsValid, setCurrentIsValid] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState({
    error: false,
    message: ""
  });
  const [checkCurrentPassword] =
    useCheckCurrentPasswordMutation();
  const [resetUserPassword] = useResetUserPasswordMutation();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!currentIsValid) {
        const res = await checkCurrentPassword({
          currentPassword: currentPasswordRef.current.value
        }).unwrap();
        if (res.matched) {
          setCurrentIsValid(true);
          setCurrentPasswordError({ error: false, message: "" });
        }
      } else {
        // const changes= await
        const passwordChanged = await resetUserPassword({
          password: newPasswordRef.current.value,
          confirmPassword: confirmPasswordRef.current.value
        }).unwrap();
        passwordChanged.isChanged&&notify(NOTIFY_SUCCESS,passwordChanged.message)
        handleSuccess()
      }
    } catch (error) {
    //   setCurrentIsValid(false);
    handleFailure()
      setCurrentPasswordError({
        error: true,
        message: "your current password is wrong"
      });
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  return (
    <div className={classes.authUserForm}>
      <form method="POST" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {
            currentPasswordError.error&&
            <Grid item xs={12} lg={12}>
              <span className={classes.errorText}>{currentPasswordError.message}</span>
            </Grid>
          }
          <Grid item xs={12} lg={12}>
            {!currentIsValid && (
              <TextField
                required
                error={currentPasswordError.error}
                size="small"
                type="password"
                label="Mot de passe actuel"
                name="password"
                inputRef={currentPasswordRef}

                className={classes.input}
              />
            )}
          </Grid>
          {currentIsValid && (
            <>
              <Grid item xs={12} lg={12}>
                <TextField
                error={currentPasswordError.error}
                  size="small"
                  type="password"
                  label="Nouveau mot de passe"
                  name="password"
                  inputRef={newPasswordRef}
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <TextField
                error={currentPasswordError.error}
                  size="small"
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  name="password"
                  inputRef={confirmPasswordRef}
                  className={classes.input}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} lg={12}>
            <button type="submit">
              {currentIsValid ? "Modifier le mot de passe" : "Vérifier le mot de passe actuel"}
            </button>
          </Grid>
        </Grid>
      </form>

    </div>
  );
};

export default ResetAuthUser;
