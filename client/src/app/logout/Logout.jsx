import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/reducers/auth";
import { clearManageList } from "../../store/reducers/manage.reducer";
import { logoutStyle } from "./style";

const Logout = () => {
  const dispatch = useDispatch();
  const classes = logoutStyle();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      dispatch(logout());
      dispatch(clearManageList());
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      navigate("/login");
    }, 4000);
  });

  return (
    <div className={classes.logoutPage}>
      <div className={classes.logoutCard}>
        <div className={classes.cardTitle}>
          <h1 className="title">Déconnexion en cours </h1>
          <div className="snippet" data-title="dot-floating">
            <div className="stage">
              <div className="dot-floating"></div>
            </div>
          </div>
        </div>
        <p className={classes.textPrimary}>
          la session est terminée avec succès.
        </p>
        <p className={classes.text}>
        A bientôt !
        </p>
      </div>
    </div>
  );
};

export default Logout;
