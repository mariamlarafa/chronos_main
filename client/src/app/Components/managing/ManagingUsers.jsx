import { Grid, MenuItem, Select, Switch } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useGetUsersList from "../../../hooks/manage/usersList";
import {
  useAddNewUserMutation,
  useBanUserMutation,
  useChangeRoleMutation,
  useGetUserListMutation,
  useUnBanUserMutation
} from "../../../store/api/users.api";
import {
  addNewUSerToList,
  setUsersList,
  updateUserInList
} from "../../../store/reducers/manage.reducer";
import AddBtn from "./AddBtn";
//modal

import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import {
  CLIENT_ROLE,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../../constants/roles";
import { useResetUserEmailMutation } from "../../../store/api/auth/authentification.js";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faAddUser from "../../public/svgs/light/user-plus.svg";
import PopUp from "../PopUp/PopUp.jsx";
import {
  CustomCancelIcon,
  CustomEditIcon,
  CustomSaveIcon
} from "../icons/index.jsx";
import { notify } from "../notification/notification";
import AddUserForm from "./AddUserForm";
import { listStyle } from "./style";

// ];

const newUserInitialState = {
  account: {
    email: "",
    role: INTERVENANT_ROLE
  },
  profile: {
    name: "",
    lastName: ""
  }
};
const label = { inputProps: { "aria-label": "bannir l'utilisateur" } };

const ManagingUsers = () => {
  const [getUserList] = useGetUserListMutation();
  const usersList = useGetUsersList();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [newUser, setNewUser] = useState(newUserInitialState);
  const [addNewUser] = useAddNewUserMutation();
  const [banUser, { isLoading: banningUser }] = useBanUserMutation();
  const [unBanUser] = useUnBanUserMutation();
  const [changeRole, { isLoading: changingUserRole }] = useChangeRoleMutation();
  const dispatch = useDispatch();
  const [roleChange, setRoleChange] = useState({ email: "", state: false });
  const classes = listStyle();
  const [confirmRoleChange, setConfirmRoleChange] = useState(false);
  const [confirmBanUser, setConfirmBanUser] = useState(false);
  const [resetUserEmail] = useResetUserEmailMutation();
  const [userRole, setUserRole] = useState({
    role: undefined,
    email: undefined
  });
  const [userToBan, setUserToBan] = useState({
    ban: undefined,
    email: undefined
  });

  useEffect(() => {
    async function userList() {
      try {
        const res = await getUserList().unwrap();
        dispatch(setUsersList(res.users));
      } catch (error) {
        console.log(error);
      }
    }

    userList();
  }, [getUserList, dispatch]);

  useEffect(() => {
    if (usersList.length) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [usersList]);

  const handleModelOpen = () => {
    setNewUser(newUserInitialState);
    setOpenModal(true);
  };
  const handleModelClose = () => {
    setNewUser(newUserInitialState);
    setOpenModal(false);
    setTimeout(() => {
      setLoadingSubmit(false);
    }, 300);
  };

  const handleChangeAccount = (e) => {
    setNewUser({
      ...newUser,
      account: { ...newUser.account, [e.target.name]: e.target.value }
    });
  };
  const handleChangeProfile = (e) => {
    setNewUser({
      ...newUser,
      profile: { ...newUser.profile, [e.target.name]: e.target.value }
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      setLoadingSubmit(true);
      const res = await addNewUser(newUser).unwrap();
      if (res?.createdUSer) {
        const { createdUSer, message } = res;
        if (createdUSer) dispatch(addNewUSerToList(createdUSer));
        setNewUser(newUserInitialState);
        handleModelClose();
        notify(NOTIFY_SUCCESS, message);
      }
    } catch (error) {
      handleModelClose();
      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  const handleBanUser = async (e) => {
    try {
      dispatch(updateUserInList(userToBan));
      const resp = await banUser({ email: userToBan.email }).unwrap();
      closeConfirmBanUser();
      notify(NOTIFY_SUCCESS, resp?.message);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const getSelectRoleForUser = (email) => {
    if (roleChange.email === email) return true;
    return false;
  };

  const loadRoleChangeInput = (email) => {
    setRoleChange({
      email: email.currentTarget.getAttribute("data-email"),
      state: true
    });
  };

  const handleRoleChange = async () => {
    try {
      const resp = await changeRole(userRole).unwrap();
      dispatch(updateUserInList(userRole));
      notify(NOTIFY_SUCCESS, resp?.message);
      setRoleChange({
        email: "",
        state: false
      });
      setConfirmRoleChange(false);
      setUserRole({ email: undefined, role: undefined });
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleConfirmBanUser = async (ban, email) => {
    if (!ban){

      try {
        const  resp = await unBanUser({ email: email }).unwrap();
        dispatch(updateUserInList({email,ban:false}));
        notify(NOTIFY_SUCCESS,resp.message)

      } catch (error) {
        console.error(error)
        notify(NOTIFY_ERROR,error?.data.message)
      }

    }else{
      console.log("banning");
      setUserToBan({ email, ban });
      setConfirmBanUser(true);

    }
  };
  const closeConfirmBanUser = () => {
    setConfirmBanUser(false);
    setUserToBan({ email: undefined, ban: undefined });
  };
  const handleConfirmRoleChange = (newRole, email) => {
    setUserRole({ email: email, role: newRole });
    setConfirmRoleChange(true);
  };

  const closeConfirmRoleChange = () => {
    setConfirmRoleChange(false);
    setUserRole({ email: undefined, role: undefined });
  };

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleChangeEmail = async (oldEmail, newEmail) => {
    try {
      const res = await resetUserEmail({ oldEmail, newEmail }).unwrap();
      notify(NOTIFY_SUCCESS, res.message);
      return true
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
      return false
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

  };

  const processRowUpdate = (newRow) => {
    const user  = usersList.filter((user) => newRow.id === user.id)[0]
    const oldEmail = user.email;
    if (user?.email === newRow?.email) return user
    const changed = handleChangeEmail(oldEmail, newRow.email);
    if (changed){
      const updatedRow = { ...newRow, isNew: false };
      return updatedRow;
    }else{
      return  user
    }
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //column for the header of the list
  const columns = [
    { field: "id", headerName: "ID", width: 10 },
    {
      field: "name",
      headerName: "Nom",
      width: 150,
      editable: false
    },
    {
      field: "lastName",
      headerName: "Prénom",
      width: 150,
      editable: false
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true
    },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      editable: false,
      renderCell: (params) => {
        const { email, role } = params.row;
        let ch
        switch (role) {
          case SUPERUSER_ROLE :
            ch  = "Administrateur"
            break
          case INTERVENANT_ROLE  :
             ch  = "Intervenant"
             break
          case PROJECT_MANAGER_ROLE  :
            ch = "Chef de projet"
            break
          default :
            ch = "Client"
          }


        return (
          <>
            <PopUp
              loading={changingUserRole}
              open={confirmRoleChange}
              handleClose={closeConfirmRoleChange}
              handleSubmit={handleRoleChange}
              title={"Confirmation"}
              icon={faSave}
              text={`Êtes-vous sûr de vouloir changer l'utilisateur du rôle ${
                role === SUPERUSER_ROLE
                  ? "Administrateur"
                  : role.replace("_", " ").toLowerCase()
              } au role de ${userRole?.role?.replace("_", " ")}?
            Gardez à l'esprit que changer le rôle d'un utilisateur aura pour conséquence de lui ajouter/supprimer certains privilèges. `}
              btnText={"Confirmer"}
              btnLevel="danger"
            />
            {getSelectRoleForUser(email) ? (
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={role}
                onChange={(e) => handleConfirmRoleChange(e.target.value, email)}
                name={email}
                inputProps={{ "data-id": email }}
                size="small"
              >
                <MenuItem value={role}>
                  <em>{role === SUPERUSER_ROLE ? "Administrateur" : role}</em>
                </MenuItem>
                {[
                  SUPERUSER_ROLE,
                  INTERVENANT_ROLE,
                  CLIENT_ROLE,
                  PROJECT_MANAGER_ROLE
                ].map(
                  (item) =>
                    item !== role && (
                      <MenuItem value={item} key={item}>
                        {item === SUPERUSER_ROLE
                          ? "Administrateur"
                          : item.replace("_", " ")}
                      </MenuItem>
                    )
                )}
              </Select>
            ) : (
              <button
                data-email={email}
                onClick={loadRoleChangeInput}
                className={classes.roleBtn}
              >
                {ch}
              </button>
            )}
          </>
        );
      }
    },
    {
      field: "active",
      headerName: "Statut",
      width: 200,
      // editable:true,
      renderCell: (params) => {
        const active = params.row?.active;
        if (active) {
          return <span className={classes.safeLabel}>Vérifié</span>;
        } else {
          return <span className={classes.redLabel}>non-vérifié</span>;
        }
      }
    },
    {
      field: "isBanned",
      headerName: "Actif",
      width: 100,
      renderCell: (params) => {
        const isBanned = params.row?.isBanned;
        const email = params.row?.email;
        return (
          <>
            <PopUp
              loading={banningUser}
              open={confirmBanUser}
              handleClose={closeConfirmBanUser}
              handleSubmit={handleBanUser}
              title={"Confirmation"}
              icon={faSave}
              text={`êtes-vous sûr de vouloir bannir l'utilisateur ${userToBan.email} du système ?
            Gardez à l'esprit que le bannissement de l'utilisateur entraînera la suppression de tout accès au système. Cependant, les données antérieures de l'utilisateur resteront intactes.`}
              btnText={"Confirmer"}
              btnLevel="danger"
            />
            <Switch
              {...label}
              value={isBanned}
              checked={!isBanned}
              id={email}
              onChange={(e) => handleConfirmBanUser(!e.target.checked, email)}

              // defaultValue={isBanned?true:false}
            />
          </>
        );
      }
    },
    {
      field: "phone",
      headerName: "Téléphone",
    width:100,
      editable: false
    },
    {
      field: "poste",
      headerName: "Poste",
     width:100,
      editable: false
    },
    {
      field: "address",
      headerName: "Adresse",
     width:100,
      editable: false
    },
    {
      field: "hireDate",
      headerName: "Date d'embauche",
     width:100,
      editable: false
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<CustomSaveIcon className={classes.icon} />}
              label="Save"
              sx={{
                color: "primary.main"
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CustomCancelIcon className={classes.icon} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }
        // if (!row.isSuperUser)
        if (!row.isSuperUser) {
          return [
            <GridActionsCellItem
              icon={<CustomEditIcon className={classes.icon} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          ];
        } else {
          return [];
        }
      }
    }
  ];

  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <AddUserForm
        loadingSubmit={loadingSubmit}
        open={openModal}
        handleClose={handleModelClose}
        handleSubmit={handleAddUser}
        changeStateAccount={handleChangeAccount}
        changeStateProfile={handleChangeProfile}
      />
      <Grid item xs={12} md={12} lg={12}>
        <AddBtn
          title="Ajouter un utilisateur"
          icon={faAddUser}
          handleAdd={handleModelOpen}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12} sx={{ height: "100%" }}>
        <DataGrid
          className={classes.list}
          rows={usersList}
          // rows={testGridSupport()}
          columns={columns}
          loading={loading}
          autoHeight={true}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100
              }
            }
          }}
          pageSizeOptions={[100]}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-row .MuiDataGrid-cell:hover": {
              cursor: "pointer !important",
            },
          }}
        />
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
    </Grid>
  );
};

export default ManagingUsers;
