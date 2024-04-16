import { TextField } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
} from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";

import {
  NOTIFY_ERROR,
  NOTIFY_INFO,
  NOTIFY_SUCCESS,
  REQUEST_STATES_LABELS,
  REQUEST_STATES_NOT_TREATED,
  REQUEST_STATE_TRANSLATION,
} from "../../../constants/constants";
import useIsUserCanAccess from "../../../hooks/access";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import {
  useCreateProjectRequestMutation,
  useDeleteProjectRequestMutation,
  useGetProjectRequestMutation,
  useUpdateProjectRequestMutation,
} from "../../../store/api/requests.api";
import {
  removeRequestFromList,
  setProjectRequests,
  updateRequestList,
} from "../../../store/reducers/project.reducer";
import { containsOnlySpaces } from "../../../store/utils";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faTrash from "../../public/svgs/light/trash.svg";
import faAdd from "../../public/svgs/solid/plus.svg";

import PopUp from "../PopUp/PopUp.jsx";

import dayjs from "dayjs";
import faUpload from "../../public/svgs/light/upload.svg";
import CustomNoRowsOverlay from "../NoRowOverlay/CustomNoRowsOverlay";
import CustomDataGridHeaderColumnMenu from "../customDataGridHeader/CustomDataGridHeaderColumnMenu";
import {
  CustomCancelIcon,
  CustomDeleteIcon,
  CustomEditIcon,
  CustomSaveIcon,
} from "../icons";
import AddBtn from "../managing/AddBtn.jsx";
import { notify } from "../notification/notification";
import RequestFiles from "./RequestFiles";
import { projectDetails, projectTaskDetails } from "./style";

const ProjectRequests = () => {
  const dispatch = useDispatch();
  const { projectID } = useParams();
  const { isProjectEditable, isUserEligibleToEdit } = useGetStateFromStore(
    "project",
    "projectAccess"
  );
  const classesDetails = projectDetails();
  const taskStyles = projectTaskDetails();

  const fileInputRef = useRef(null);

  const [addRequest, setAddRequest] = useState(false);
  const [files, setFiles] = useState([]);
  const { user } = useGetAuthenticatedUser();
  const { isSuperUser } = useIsUserCanAccess();
  const [creatingRequest, setCreatingRequest] = useState(false);
  // const [error, setError] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(undefined);
  const [checkDelete, setCheckDelete] = useState(false);
  const requests = useGetStateFromStore("project", "projectRequest");
  const dataGridRef = useRef();


  const [getProjectRequest, { isLoading: loadingRequests }] =
    useGetProjectRequestMutation();
  const [updateProjectRequest, { isLoading: updatingRequest }] =
    useUpdateProjectRequestMutation();
  const [createProjectRequest] = useCreateProjectRequestMutation();
  const [deleteProjectRequest, { isLoading: deletingRequest }] =
    useDeleteProjectRequestMutation();

  const [rowModesModel, setRowModesModel] = React.useState({});

  const descriptionRef = useRef();

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

  const handleDeleteClick = async () => {
    try {
      const res = await deleteProjectRequest({
        projectID,
        requestID: requestToDelete,
      }).unwrap();
      dispatch(removeRequestFromList(requestToDelete));
      notify(NOTIFY_SUCCESS, res.message);
      closeCheckDelete();
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow) => {
    try {
      let body = {
        state: REQUEST_STATE_TRANSLATION.filter(
          (state) => state.label === newRow.state
        )[0]?.value,
        description: newRow.description,
      };
      const res = await updateProjectRequest({
        projectID,
        requestID: newRow.id,
        body,
      }).unwrap();

      const updatedRow = { ...res.request, isNew: false };
      notify(NOTIFY_SUCCESS, res?.message);
      return updatedRow;
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const requestCreatorsNames = () => {
    let names = [];
    requests.forEach((item) => {
      if (
        !names.includes(
          `${item?.requestCreator?.UserProfile.name} ${item?.requestCreator?.UserProfile.lastName}`
        )
      ) {
        names.push(
          `${item?.requestCreator?.UserProfile.name} ${item?.requestCreator?.UserProfile.lastName}`
        );
      }
    });

    return names;
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      editable: true,
      valueGetter: (params) => {
        return `${dayjs(params.row.createdAt)
          .locale("en-gb")
          .format("DD/MM/YYYY")}`;
      },
    },
    {
      field: "description",
      headerName: "Information",
      // width: 1000,
      // width: descriptionWidth,
      flex: 1,
      minWidth: 200,
      editable: true,
      filterable: false,
    },
    {
      field: "file",
      headerName: "Attachements",
      // type: "number",
      editable: false,
      width: 200,
      renderCell: ({ row }) => {
        return (
          <RequestFiles
            files={row.file}
            isCreator={row.requestCreator.email === user?.email}
            requestID={row.id}
          />
        );
      },
    },
    {
      field: "creatorID",
      headerName: "Émetteur",
      // type: "number",
      valueOptions: requestCreatorsNames,
      type: "singleSelect",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <div className={`${classesDetails.manager} small`}>
            {row.requestCreator?.UserProfile?.image ? (
              <img
                src={`${process.env.REACT_APP_SERVER_URL}${row.requestCreator?.UserProfile?.image}`}
                alt={`avatar for user ${row.requestCreator?.UserProfile?.name}`}
              />
            ) : (
              <span className="initials">
                {row.requestCreator?.UserProfile?.name[0]}
                {row.requestCreator?.UserProfile?.lastName[0]}
              </span>
            )}
            <p className="manager-name">
              {row.requestCreator?.UserProfile?.name}
              {row.requestCreator?.UserProfile?.lastName}
              <br />
              {/* <span className="email">
              {row.requestCreator?.email}
            </span> */}
            </p>
          </div>
        );
      },
    },

    {
      field: "state",
      headerName: "État",
      type: "singleSelect",
      valueOptions: REQUEST_STATES_LABELS,
      editable: isUserEligibleToEdit,
      width: 160,
      renderCell: (params) => {
        const status =
          params.row.state === REQUEST_STATES_NOT_TREATED ? "blocked" : "done";
        return (
          <span className={`${taskStyles.task} ${status}`}>
            {params.row.state}
          </span>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const renderActions = [];
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode && isProjectEditable) {
          renderActions.push(
            <GridActionsCellItem
              icon={<CustomSaveIcon className={taskStyles.icon} />}
              label="Enregistrer"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CustomCancelIcon className={taskStyles.icon} />}
              label="Annuler"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          );
        } else {
          if (
           ( isUserEligibleToEdit ||
            user?.email === row.requestCreator?.email) && isProjectEditable
          ) {
            renderActions.push(
              <GridActionsCellItem
                icon={<CustomEditIcon className={taskStyles.icon} />}
                label="Éditer"
                className="textPrimary"
                onClick={handleEditClick(row.id)}
                color="inherit"
              />
            );
          }
          if (isSuperUser && isProjectEditable) {
            renderActions.push(
              <GridActionsCellItem
                icon={<CustomDeleteIcon className={taskStyles.icon} />}
                label="Supprimer"
                className="textPrimary"
                onClick={() => openCheckDelete(row.id)}
                color="inherit"
              />
            );
          }
        }

        return renderActions;
      },
    },
  ];

  useEffect(() => {
    async function loadRequests() {

      try {
        const res = await getProjectRequest(projectID).unwrap();
        dispatch(setProjectRequests(res?.requests));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    loadRequests();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectID]);

  const openAddRequest = () => {
    setAddRequest(true);
  };
  const closeAddRequest = () => {
    setAddRequest(false);
    setFiles([]);
  };

  const handleSubmitRequest = async () => {
    const description = descriptionRef.current.value;
    if (
      !description ||
      description.length === 0 ||
      containsOnlySpaces(description)
    ) {
      notify(
        NOTIFY_INFO,
        "la requête ne sera pas créée parce que la description était vide "
      );
      closeAddRequest();
      return;
    }
    try {
      setCreatingRequest(true);
      var formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      formData.append("description", description);
      formData.append("projectID", projectID);

      const res = await createProjectRequest(formData).unwrap();
      closeAddRequest();
      dispatch(updateRequestList(res.newRequest));
      notify(NOTIFY_SUCCESS, res?.message);
      setTimeout(() => {
        setCreatingRequest(false);
      }, 500);
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error?.data?.message);
      closeAddRequest();
      setTimeout(() => {
        setCreatingRequest(false);
      }, 500);
    }
  };

  const closeCheckDelete = () => {
    setRequestToDelete(undefined);
    setCheckDelete(false);
  };
  const openCheckDelete = (id) => {
    setRequestToDelete(id);
    setCheckDelete(true);
  };

  const selectFiles = () => {
    fileInputRef.current.click();
  };
  const onChange = async (e) => {
    const files = Array.from(e.target.files);
    // const file = files[0];
    for (const file in files) {
      if (file[file]?.size > 10 * 1024 * 1024) {
        notify(NOTIFY_ERROR, "Le fichier est trop grande");
        return;
      }
    }
    setFiles(files);
  };

  return (
    <div className={classesDetails.card}>
      <div className={`${classesDetails.cardTitle}`}>
        {isProjectEditable && (
          <button onClick={openAddRequest}>
            <span className="text">Requetes et informations</span>
            <ReactSVG className="icon-container" src={faAdd} />
          </button>
        )}
      </div>
      <PopUp
        open={addRequest}
        handleClose={closeAddRequest}
        // handleSubmit={handleSubmitRequest}
        title="Ajouter une requête"
        // icon={faSave}
        // btnText="Ajouter"
        loading={creatingRequest}
        className={classesDetails.popUpContent}
      >
        <TextField
          label="Information"
          name="description"
          className={classesDetails.requestInput}
          inputRef={descriptionRef}
          multiline
          fullWidth
        />
        <ul className={taskStyles.fileListPreview}>
          {Array.from(files)?.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
        <div className={classesDetails.requestPopAction}>
          <button
            onClick={selectFiles}
            className={`${taskStyles.fileItem} add requests`}
          >
            <ReactSVG src={faUpload} /> Choisir des fichiers
            <input
              ref={fileInputRef}
              style={{ display: "none" }}
              type="file"
              onChange={onChange}
              name="file"
              multiple
            />
          </button>
          <AddBtn
            handleAdd={handleSubmitRequest}
            title="Ajouter"
            // large="large"
            icon={faSave}
            loading={creatingRequest}
          />
        </div>
      </PopUp>
      <PopUp
        open={checkDelete}
        handleClose={closeCheckDelete}
        handleSubmit={handleDeleteClick}
        title="Supprimer une requête"
        text="Êtes-vous sûr de vouloir supprimer cette réserve ? Vous ne pourrez plus la récupérer. "
        icon={faTrash}
        btnText="Supprimer"
        loading={deletingRequest}
        btnLevel="danger"
      />

      <DataGrid
        ref={dataGridRef}
        className={taskStyles.list}
        loading={
          loadingRequests ||
          updatingRequest ||
          creatingRequest ||
          deletingRequest
        }
        slots={{
          columnMenu: CustomDataGridHeaderColumnMenu,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        rows={requests}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[100]}
        disableRowSelectionOnClick
        onProcessRowUpdateError={(error) => notify(NOTIFY_ERROR, error.message)}
        autoHeight
        sx={{
          "--DataGrid-overlayHeight": "200px",
          "& .MuiDataGrid-row *:hover": {
            cursor: "pointer !important",
          },
        }}
      />
    </div>
  );
};

export default ProjectRequests;
