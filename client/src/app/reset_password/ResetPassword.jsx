import { Box } from "@mui/system";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ReactSVG } from "react-svg";
import useGetAuthenticatedUser from "../../hooks/authenticated";
import Loading from "../Components/loading/Loading";
import ResetAuthUser from "../Components/reset_password/ResetAuthUser";
import ResetNotAuthUser from "../Components/reset_password/ResetNotAuthUser";
import faResetSuccess from "../public/svgs/light/shield-check.svg";
import faVerified from "../public/svgs/solid/badge-check.svg";
import faChevronLeft from "../public/svgs/solid/chevron-left.svg";
import { styles } from "./style";
const ResetPassword = () => {
  const classes = styles();
  const user = useGetAuthenticatedUser();
  const [isReseted, setIsReseted] = useState(false);
  const [isVerified, setVerified] = useState(false);

  if (user.loading) return <Loading />;

  const handleResetedSuccess = () => {
    setIsReseted(true);
  };
  const handleResetedFailure = () => {
    setIsReseted(false);
  };

  const handleVerificationSuccess = () => {
    setVerified(true);
  };
  const handleVerificationFailure = () => {
    setVerified(false);
  };

  return (
    <div className={classes.resetPasswordPage}>
      <Box className={classes.box}>
        {!user?.isAuthenticated && (
          <NavLink to="/login" className={classes.goBack}>
            <ReactSVG src={faChevronLeft} className={classes.goBackIcon} />{" "}
            Se connecter
          </NavLink>
        )}
        {!isReseted && !isVerified ? (
          <>
            <h2 className={classes.pageTitle}>Réinitialiser votre mot de passe</h2>
            <h3 className={classes.text}>
              {!isReseted &&
                !isVerified &&
                (!user.isAuthenticated
                  ? "Pour réinitialiser votre mot de passe, vous devez d'abord confirmer votre compte. Veuillez saisir votre adresse e-mail dans la case ci-dessous."
                  : "Pour réinitialiser votre mot de passe, vous devez d'abord confirmer votre ancien mot de passe afin que nous puissions protéger votre compte.")}
            </h3>
          </>
        ) : (
          <>
            {isReseted && (
              <div className={classes.imageContainer}>
                <ReactSVG
                  src={faResetSuccess}
                  className={`${classes.notificationIcon} success`}
                />
              </div>
            )}
            {isVerified && (
              <div className={classes.imageContainer}>
                <ReactSVG
                  src={faVerified}
                  className={`${classes.notificationIcon} success`}
                />
              </div>
            )}
          </>
        )}
        {!isReseted ? (
          user?.isAuthenticated ? (
            <ResetAuthUser
              handleSuccess={handleResetedSuccess}
              handleFailure={handleResetedFailure}
            />
          ) : (
            <ResetNotAuthUser
              handleSuccess={handleVerificationSuccess}
              handleFailure={handleVerificationFailure}
            />
          )
        ) : (
          <div>
            <h2>Merci d'avoir réinitialisé votre mot de passe</h2>
            <p className={classes.text}>
            Votre mot de passe a été réinitialisé.
              {user?.isAuthenticated ? (
                <span>
                   Vous pouvez choisir de vous <NavLink to="/logout">déconnecter </NavLink> ou de poursuivre votre navigation

                </span>
              ) : (
                <span>vous serez redirigé vers le formulaire de connexion dans 5 secondes</span>
              )}
            </p>
          </div>
        )}
      </Box>
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
    </div>
  );
};

export default ResetPassword;
