import { useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { useUpdateUserProfilePictureMutation } from "../../../store/api/users.api";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import Loading from "../loading/Loading";
import { notify } from "../notification/notification";
import { styles } from "./style";
import { useDispatch } from "react-redux";
import { updateUserInfoProfile } from "../../../store/reducers/user.reducer";
const UploadImage = ({ email, userImage, previewImage, handleImage }) => {
  const fileInputRef = useRef(null);
  const classes = styles();
  const formRef = useRef();
  const [hideBtn, setHideBtn] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch=useDispatch()
  const [updateUserProfilePicture, { isLoading }] =
    useUpdateUserProfilePictureMutation();

  const handleButtonClick = () => {
    // Use current property of the ref to access the input element
    fileInputRef.current.click();
  };

  const onChange = async (e) => {

    const files = e.target.files;
    const file = files[0];


    if (!file?.type.includes('image')) {
      notify(NOTIFY_ERROR, "Le fichier doit être une image");
      return
    }

    if (file?.size > 5 * 1024 * 1024) {
      notify(NOTIFY_ERROR, "L'image est trop volumineuse");
      return
    }
    await getBase64(file);
    setHideBtn(false)

  };

  const getBase64 = async (file) => {
    if (file) {
      let reader = await new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        onLoad(reader.result);
      };
    }
  };
  const onLoad = (fileString) => {
    handleImage(fileString);

    // handleSubmit()
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      const formData = new FormData();
      formData.append("profileImage", fileInputRef.current.files[0]);
      formData.append("email", email);

      const newImg =await updateUserProfilePicture(formData).unwrap();

      notify(NOTIFY_SUCCESS, "Mise à jour réussie de la photo de profil");
      setLoading(false)
      setHideBtn(true)
      dispatch(updateUserInfoProfile({image:newImg.url}))
    } catch (error) {
      setHideBtn(false)

      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  return (

      <form
        className={classes.uploaderForm}
        ref={formRef}
        onSubmit={handleSubmit}
        method="PATCH"
        encType="multipart/form-data"
      >
        <div  className={classes.uploadContainer} onClick={(!userImage && !previewImage)?handleButtonClick:undefined}>
          {!userImage && !previewImage && (
            <p className={classes.btnFileInput}>Select File</p>
          )}
          {(userImage || previewImage) && (
            <div className={classes.imageContainer} onClick={handleButtonClick}>
              <img
                src={
                  previewImage
                    ? previewImage
                    : `${process.env.REACT_APP_SERVER_URL}${userImage}`

                }
                className={
                  classes.profileImage + " " + (isLoading || loading ? classes.blur : "")
                }

                alt="profile avatar"
                title="profile avatar"
              />
              <span className={`${classes.helpText} helpText`}>
              Cliquez pour modifier l'image
              </span>
              <div className={classes.ctaBtn}>
                {previewImage &&!hideBtn && (
                  <button
                    className="br"
                    type="submit"
                    disabled={isLoading || loading}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from propagating to the parent div

                      return false; // Prevent the click event from further propagation
                    }}
                  >
                    <ReactSVG src={faSave} />
                  </button>
                )}

              </div>
              {
              (loading || isLoading)&&
              <div className={classes.savingLoader}>
              <Loading color="white"/>
              </div>
              }

            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          style={{ display: "none" }}
          type="file"
          onChange={onChange}
          name="profileImage"
        />
      </form>

  );
};

export default UploadImage;
