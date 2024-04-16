import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Loading from "../Components/loading/Loading";

import useGetAuthenticatedUser from "../../hooks/authenticated";
import { useGetAuthenticatedUserInfoMutation } from "../../store/api/users.api";
import { setUserInfo } from "../../store/reducers/user.reducer";
import SideLayoutInfo from "../Components/profile/SideLayoutInfo";
import SideLayoutMain from "../Components/profile/SideLayoutMain";
import { styles } from "./style";

const UserProfile = () => {
  const classes = styles();
  const { user, loading } = useGetAuthenticatedUser();
  const [getAuthenticatedUserInfo] =
    useGetAuthenticatedUserInfoMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadUserInfo() {
      try {
        if (user?.email) {
          const { data } = await getAuthenticatedUserInfo({
            email: user.email
          });
          dispatch(setUserInfo(data));
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <Loading />;
  return (
    <div className={classes.profileContainer}>
      {/* left right layout */}
      <Grid container spacing={5} sx={{marginTop:0,height:'100%'}}>
        <Grid sx={{height:'100%'}} item xs={12} sm={12} md={12} lg={6} xl={4}  className={classes.gridItem}>
          <div className={classes.hoverCard}>

          <SideLayoutInfo />
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={8} className={classes.gridItem} sx={{opacity:0.4 ,height:'100%'}}>
          <div className={classes.hoverCard}>

          <SideLayoutMain />
          </div>
        </Grid>
      </Grid>

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

export default UserProfile;
