import React from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import Logo from "../../public/svgs/Kairos logo_3.svg";
import { getRolesBasedUrls } from "../../routes/urls";
import { styles } from "./style";

import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import useGetUserInfo from "../../../hooks/user";
import { toggleSideBarStatus } from "../../../store/reducers/sidebar.reducer";
import faBars from "../../public/svgs/light/bars.svg";
import faLogout from "../../public/svgs/light/right-from-bracket.svg";
const SidebarComponent = () => {
  const classes = styles();
  // const [collapse, setCollapse] = useState(true);
  const dispatch = useDispatch();
  const user = useGetUserInfo();
  const collapse = useGetStateFromStore("sidebar", "collapsed");
  const handleCollapse = () => {
    // setCollapse(!collapse);
    dispatch(toggleSideBarStatus());
  };

  return (
    <Sidebar
      breakPoint="md"
      className={classes.sidebar}
      collapsed={collapse}
      onBackdropClick={handleCollapse}
    >
      <div className={classes.sideBardTop}>
        <div className={classes.sidebarHeader}>
          {!collapse && (
            <>
              <div className={classes.imageContainer}>
                <img src={Logo} alt="logo" />
              </div>

              {/* <p className={classes.companyName}>Chronos</p> */}
            </>
          )}
          <button onClick={handleCollapse} className={classes.bars}>
            <ReactSVG src={faBars} className="bars-icon" />
          </button>
        </div>

        <Menu>
          <MenuItem
            icon={
              <div className={classes.profileImageContainer}>
                {user?.profile?.image ? (
                  <img
                    src={`${process.env.REACT_APP_SERVER_URL}${user?.profile?.image}`}
                    className={classes.profileImage}
                    alt="user avatar"
                  />
                ) : (
                  <span className="initials">
                    {user?.profile?.name[0]}
                    {user?.profile?.lastName[0]}
                  </span>
                )}
              </div>
            }
            className={classes.profile}
            component={<NavLink to="/profile/me" />}
          >
            <div className={classes.username}>
              <h3 className="name">
                {user?.profile?.name} {user?.profile?.lastName}
              </h3>
              <p className="role">
                {user?.profile?.poste ? user?.profile?.poste : ""}
              </p>
            </div>
          </MenuItem>

          {user.user &&
            getRolesBasedUrls(user?.user).map(
              ({ title, path, icon, sideBar }, key) =>
                sideBar && (
                  <MenuItem
                    key={key}
                    className={classes.link}
                    icon={<ReactSVG src={icon} className={classes.linkIcon} />}
                    component={
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? "active" : "inactive"
                        }
                        to={path}
                      ></NavLink>
                    }
                  >
                    {title}
                  </MenuItem>
                )
            )}
        </Menu>
      </div>
      <div className={classes.sideBardBottom}>
        <Menu>
          <MenuItem
            className={`${classes.link} logout`}
            icon={<ReactSVG src={faLogout} className={classes.linkIcon} />}
            component={<NavLink to="/logout" />}
          >
            Se déconnecter
          </MenuItem>
        </Menu>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
