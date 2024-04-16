import { Grid } from "@mui/material";
import React, { useState } from "react";
import useGetUserInfo from "../../../hooks/user";
import { styles } from "../../profile/style";
import UploadImage from "../upload/UploadImage";
const TopLayout = () => {
  const { user, profile } = useGetUserInfo();
  const [profileImage, setProfileImage] = useState(null);
  const classes = styles();

  return (
    <div className={classes.mainInfo}>
      <Grid container spacing={10} alignItems="center">
        <Grid item xs={12} sm={12} md={6} lg={4}>
         <div className={classes.bgTop} >

          <UploadImage
            email={user?.email}
            userImage={profile?.image}
            previewImage={profileImage}
            handleImage={setProfileImage}
            />
            </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={8}>
         <div className={classes.bgTop} >



          <div className={classes.keyFigures}>
            <div className={classes.keyFigure}>
              <h3 className={classes.keyFigureTitle}>title</h3>
              <p className={classes.keyFigureValue}>100</p>
            </div>

            <div className={classes.keyFigure}>
              <h3 className={classes.keyFigureTitle}>title</h3>
              <p className={classes.keyFigureValue}>100</p>
            </div>

            <div className={classes.keyFigure}>
              <h3 className={classes.keyFigureTitle}>title</h3>
              <p className={classes.keyFigureValue}>100</p>
            </div>
          </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default TopLayout;
