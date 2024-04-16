import { Grid, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import useGetUserInfo from "../../../hooks/user";
import { useUpdateUserProfileMutation } from "../../../store/api/users.api";
import { updateUserInfoProfile } from "../../../store/reducers/user.reducer";
import { styles } from "../../profile/style";
import Loading from "../loading/Loading";
import { notify } from "../notification/notification";
import UploadImage from "../upload/UploadImage";
const initialErrorState = {
  state: false,
  message: ""
};

const resetError = {
  email: initialErrorState,
  name: initialErrorState,
  lastName: initialErrorState,
  poste: initialErrorState,
  phone: initialErrorState
};

const SideLayoutInfo = () => {
  const [profileImage, setProfileImage] = useState(null);
  const classes = styles();

  const { user, profile } = useGetUserInfo();

  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [error, setError] = useState(resetError);
  // const [region, setRegion] = useState(null);
  // const [city, setCity] = useState(profile?.city?profile.city:"");
  //profile Ref attributes
  const nameRef = useRef();
  const lastNameRef = useRef();
  const postRef = useRef();
  const phoneRef = useRef();
  const hireDateRef = useRef();
  // const streetRef = useRef();
  // const cityRef = useRef();
  const addressRef = useRef();



  // useEffect(() => {
  //   setCity(profile?.city?profile.city:"")
  // }, [profile])


  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  if (!user || !profile) return <Loading />;

  // const selectRegion = (e) => {

  //   setRegion(e.target?.value);
  //   setCity("")
  // };
  // const selectCity = (e) => {
  //   setCity(e.target?.value);
  // };

  const handleEdit = () => {
    setError(resetError);
    // setRegion(null);
    // setCity(null);
    setEdit(!edit);
  };
  const saveProfile = async () => {
    if (
      !checkStringIntegrity("name", nameRef.current.value) ||
      !checkStringIntegrity("lastName", lastNameRef.current.value) ||
      !checkPhoneIntegrity(phoneRef.current.value)
    ) {
      return;
    }

    try {
      const updatedProfile = {
        name: nameRef.current.value,
        lastName: lastNameRef.current.value,
        poste: postRef.current.value,
        phone: phoneRef.current.value,
        hireDate: hireDateRef.current.value,
        address:addressRef.current.value
        // city: city?city:profile.city,
        // region:region?region: profile.region,
        // street:streetRef.current.value
      };
      console.log(updatedProfile);
      // setCity(updatedProfile.city)
      await updateUserProfile(updatedProfile).unwrap();
      //check if image exists

      dispatch(updateUserInfoProfile(updatedProfile));
      notify(NOTIFY_SUCCESS, "profile updated successfully");
      setEdit(false);
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  const checkPhoneIntegrity = (phone) => {
    if (isNaN(phone) || phone.length !== 8) {
      setError({
        ...error,
        phone: {
          state: true,
          message: "Numero invalid : doit seulement contenir 8 chiffre "
        }
      });
      return false;
    } else {
      setError({
        ...error,
        phone: initialErrorState
      });
    }
    return true;
  };

  const checkStringIntegrity = (attribute, string) => {
    if (string.length < 2 || string.length > 20) {
      setError({
        ...error,
        [attribute]: {
          state: true,
          message: `${
            attribute === "name" ? "Nom" : "Prénom"
          } invalide : doit minimum contenir 2 characters et au maximum 20`
        }
      });
      return false;
    } else {
      setError({
        ...error,
        [attribute]: {
          state: false,
          message: ""
        }
      });
      return true;
    }
  };

  const getErrorMessage = (field) => {
    if (error[field]) return error[field];
    return;
  };

  // const getRegions = () => {
  //   let regions = cities.map((city) => city.region);
  //   return regions.filter((item, index) => regions.indexOf(item) === index);
  // };
  // const getCities = () => {
  //   if (profile.region && !region){
  //     return cities.filter((item) => item.region === profile.region);

  //   }
  //   return cities.filter((item) => item.region === region);
  // };

  return (
    <>
      <div className={classes.bgTop}>
        <UploadImage
          email={user?.email}
          userImage={profile?.image}
          previewImage={profileImage}
          handleImage={setProfileImage}
        />
      </div>

      <div className={classes.bottomSide}>
        <div className={classes.profileInformation}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid className={classes.formItem} item xs={12} lg={12}>
              {!edit ? (
                <h2 className={classes.profileInfo}>
                  {`${profile.name} ${profile.lastName}`}
                </h2>
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <TextField
                        className={classes.input}
                        inputRef={nameRef}
                        variant="outlined"
                        size="small"
                        name="name"
                        inputProps={{ maxLength: 20 }}
                        defaultValue={profile.name}
                        error={getErrorMessage("name").state}
                        helperText={
                          getErrorMessage("name").state
                            ? getErrorMessage("name").message
                            : ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <TextField
                        className={classes.input}
                        inputRef={lastNameRef}
                        variant="outlined"
                        size="small"
                        name="lastName"
                        inputProps={{ maxLength: 20 }}
                        error={getErrorMessage("lastName").state}
                        helperText={
                          getErrorMessage("lastName").state
                            ? getErrorMessage("lastName").message
                            : ""
                        }
                        defaultValue={profile.lastName}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              <span className={classes.labels}>
                {/* {!edit ? "Nom complet" : "Nom et prénom"} */}
                Nom complet
              </span>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              <h2 className={classes.profileInfo}>{user.email}</h2>
              <span className={classes.labels}>Email</span>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              <Grid container alignItems="center">
                <Grid item xs={12} sm={6} lg={6}>
                  <h2 className={classes.profileInfo}>**************</h2>
                  <span className={classes.labels}>Mot de passe</span>
                </Grid>
                {edit && (
                  <Grid sx={{ textAlign: "right" }} item xs={12} sm={6} lg={6}>
                    <NavLink
                      className={classes.changePasswordBtn}
                      to="/settings/account/change-password"
                    >
                     Modifier le mot de passe
                    </NavLink>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              {!edit ? (
                <h2 className={classes.profileInfo}>
                  {profile.poste
                    ? profile.poste
                    : "Veuillez saisir votre poste"}
                </h2>
              ) : (
                <TextField
                  className={classes.input}
                  inputRef={postRef}
                  variant="outlined"
                  size="small"
                  name="poste"
                  defaultValue={profile.poste}
                />
              )}
              <span className={classes.labels}>Poste</span>
            </Grid>

            <Grid className={classes.formItem} item xs={12} lg={12}>
              {!edit ? (
                <h2 className={classes.profileInfo}>
                  {profile.phone
                    ? profile.phone
                    : "Veuillez saisir votre numéro de téléphone"}
                </h2>
              ) : (
                <TextField
                  className={classes.input}
                  inputRef={phoneRef}
                  error={getErrorMessage("phone").state}
                  variant="outlined"
                  size="small"
                  name="phone"
                  type="number"
                  inputProps={{
                    inputMode: "number",
                    pattern: '[0-9]*',
                    maxLength: 8
                  }}
                  defaultValue={profile.phone}
                  helperText={
                    getErrorMessage("phone").state
                      ? getErrorMessage("phone").message
                      : ""
                  }
                />
              )}
              <span className={classes.labels}>Téléphone</span>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              {!edit ? (
                <h2 className={classes.profileInfo}>
                  {profile.hireDate
                    ? profile.hireDate
                    : "Veuillez saisir votre date d'embauche"}
                </h2>
              ) : (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    className={classes.input}
                    label="Date d'embauche"
                    size="small"
                    slotProps={{
                      textField: { variant: "outlined", size: "small" }
                    }}
                    inputRef={hireDateRef}
                    defaultValue={
                      profile.hireDate
                        ? dayjs(profile.hireDate, "DD/MM/YYYY")
                        : dayjs()
                    }
                    // onChange={(newValue) => {
                    //   setTask({ ...task, startDate: newValue });
                    // }}
                  />
                </LocalizationProvider>
              )}
              <span className={classes.labels}>date d'embauche</span>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              {!edit ? (
                <h2 className={classes.profileInfo}>
                  {profile.address
                    ? `${profile.address}`
                    : "Veuillez saisir votre adresse"}
                </h2>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      className={classes.input}
                      type="text"
                      inputRef={addressRef}
                      size="small"
                      defaultValue={profile?.address}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Select
                      className={classes.input}
                      value={!region?profile.region?profile.region:"":region}
                      size="small"
                      onChange={selectRegion}
                    >
                      {getRegions().map((entry, key) => (
                        <MenuItem key={key} value={entry}>
                          {entry}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Select
                      className={classes.input}
                      value={city?city:""}
                      disabled={!region && !profile.region}
                      inputRef={cityRef}
                      size="small"
                      onChange={selectCity}
                    >
                      {getCities().map(({ city }, idx) => (
                        <MenuItem value={city} key={idx}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid> */}
                </Grid>
              )}
              <span className={classes.labels}>Adresse</span>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid
              className={classes.formItem}
              item
              xs={12}
              sm={12}
              md={edit ? 6 : 12}
              lg={edit ? 6 : 12}
            >
              <button
                onClick={!edit ? handleEdit : saveProfile}
                className={classes.updateProfile}
              >
                {!edit ? "Mettre à jour mon profil" : "Sauvegarder mon profil"}{" "}
              </button>
            </Grid>
            {edit && (
              <Grid
                className={classes.formItem}
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
              >
                <button
                  type="button"
                  onClick={handleEdit}
                  className={`${classes.updateProfile} orange`}
                >
                  Annuler
                </button>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default SideLayoutInfo;
