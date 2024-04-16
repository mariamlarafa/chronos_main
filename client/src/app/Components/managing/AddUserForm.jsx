import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
//modal
import Backdrop from "@mui/material/Backdrop";

import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import {
  CLIENT_ROLE,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE,
} from "../../../constants/roles";
import Loading from "../loading/Loading";
import { addUserFormStyles } from "./style";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

const AddUserForm = ({
  open,
  handleClose,
  handleSubmit,
  changeStateAccount,
  changeStateProfile,
  loadingSubmit,
}) => {
  const classes = addUserFormStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Ajouter un utilisateur
          </Typography>
          <form onSubmit={handleSubmit} method="POST">
            <Grid container spacing={2}>
              <Grid item xs={12} lg={12}>
                <TextField
                  className={classes.inputs}
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  onChange={changeStateAccount}
                  required
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <TextField
                  className={classes.inputs}
                  label="Nom"
                  name="name"
                  type="text"
                  variant="outlined"
                  onChange={changeStateProfile}
                  required
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <TextField
                  className={classes.inputs}
                  label="Prénom"
                  name="lastName"
                  type="text"
                  variant="outlined"
                  onChange={changeStateProfile}
                  required
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <TextField
                  className={classes.inputs}
                  label="Téléphone"
                  type="number"
                  inputProps={{
                    min: 0,
                    max: 99999999,
                  }}
                  name="phone"
                  variant="outlined"
                  onChange={changeStateProfile}
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <FormControl className={classes.inputs} sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    defaultValue={INTERVENANT_ROLE}
                    label="Role"
                    name="role"
                    onChange={changeStateAccount}
                  >
                    <MenuItem value={INTERVENANT_ROLE}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={SUPERUSER_ROLE}>Admin</MenuItem>
                    <MenuItem value={CLIENT_ROLE}>Client</MenuItem>
                    <MenuItem value={INTERVENANT_ROLE}>Intervenant</MenuItem>
                    <MenuItem value={PROJECT_MANAGER_ROLE}>
                      Chef de projet
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Le rôle de l'utilisateur dans l'application. Si aucun rôle
                    n'a été sélectionné, l'utilisateur prendra par défaut le
                    rôle d'intervenant.
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <button
                  className={classes.saveBtn}
                  type="submit"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? (
                    <>
                    <Loading color="white" className={classes.loadingSaveBtn} />
                    <p className="text">Ajout</p>
                    </>
                  ) : (
                    "Ajouter"
                  )}
                </button>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <button
                  className={classes.cancelBtn}
                  type="button"
                  onClick={handleClose}
                >
                  Annuler
                </button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddUserForm;
