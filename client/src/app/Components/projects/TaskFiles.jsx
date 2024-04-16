import Tooltip from "@mui/material/Tooltip";
import fileDownload from "js-file-download";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants.js";
import axios from "../../../store/api/base.js";
import {
  useDeleteFileFromTaskMutation,
  useUploadFileToTaskMutation,
} from "../../../store/api/tasks.api.js";
import { updateInterventionUploadedFile } from "../../../store/reducers/task.reducer.js";
import faEmptyFolder from "../../public/svgs/light/folder-open.svg";
import faFolders from "../../public/svgs/light/folders.svg";
import faClose from "../../public/svgs/light/xmark.svg";
import faFile from "../../public/svgs/solid/file.svg";
import faPlus from "../../public/svgs/solid/plus.svg";

import PopUp from "../PopUp/PopUp.jsx";

import useGetStateFromStore from "../../../hooks/manage/getStateFromStore.js";
import { notify } from "../notification/notification.js";
import { projectTaskDetails } from "./style.js";

const TaskFiles = ({
  interventions,
  taskID,
  intervenantList,
  isProjectManager,
}) => {
  const [openFolder, setOpenFolder] = useState(false);
  const isDownloadingRef = useRef(false);
  // const { user } = useGetAuthenticatedUser();
  // const { isSuperUser, isManager } = useIsUserCanAccess();
  // const project = useGetStateFromStore("project", "projectDetails");
  const { isProjectEditable ,isUserEligibleToEdit,isUserAnIntervenant } = useGetStateFromStore(
    "project",
    "projectAccess"
  );

  const { projectID } = useParams();
  const classes = projectTaskDetails();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [uploadFileToTask] = useUploadFileToTaskMutation();
  const [deleteFileFromTask] = useDeleteFileFromTaskMutation();

  const handleOpen = () => {
    setOpenFolder(true);
  };
  const handleClose = () => {
    setOpenFolder(false);
  };

  const attachedFiles = interventions.filter((item) => item.file !== null);

  const handleDownload = async (e, url, name) => {
    try {
      if (isDownloadingRef.current) {
        return;
      }
      // Set the download in progress
      isDownloadingRef.current = true;

      // const fileName = `${name}.${url.split(".")[2]}`;
      const fileName = url.substr(url.indexOf("-") + 1);

      const res = await axios.get(url, {
        responseType: "blob",
      });
      fileDownload(res.data, fileName);
      isDownloadingRef.current = false;
    } catch (error) {
      console.log(error);
      isDownloadingRef.current = false;
    }
  };

  const handleUpload = () => {
    // Use current property of the ref to access the input element
    fileInputRef.current.click();
  };

  const handleDelete = async (intervention, file) => {
    try {
      const res = await deleteFileFromTask({
        projectID,
        taskID,
        body: {
          interventionID: intervention.id,
          file: file,
        },
      }).unwrap();
      //updating the list of files
      dispatch(
        updateInterventionUploadedFile({
          taskID,
          attribute: "file",
          file: res.file,
          intervenantID: res.interventionID,
          upload: false,
        })
      );
      handleClose();
      notify(NOTIFY_SUCCESS, res.message);
    } catch (error) {
      notify(NOTIFY_ERROR, error);
    }
  };

  const onChange = async (e) => {
    const files = e.target.files;
    const file = files[0];

    if (file?.size > 10 * 1024 * 1024) {
      notify(NOTIFY_ERROR, "Le fichier est trop volumineux");
      return;
    }

    if (file) {
      onLoad(file);
    }
    // setHideBtn(false)
  };

  const onLoad = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadFileToTask({
        projectID,
        taskID,
        body: formData,
      }).unwrap();
        console.log("dispatch upadting for the uploaded file ");
      dispatch(
        updateInterventionUploadedFile({
          taskID,
          attribute: "file",
          file: res.file,
          intervenantID: res.interventionID,
          upload: true,
        })
      );
      notify(NOTIFY_SUCCESS, res?.message);
      handleClose();
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const isDocumentsNull =
    !attachedFiles.length || !JSON.parse(attachedFiles[0].file).length;

  // const isUserAnIntervenant =
  const filesList = attachedFiles.map((item, idx) => {
    const elements = [];
    const files = item.file ? JSON.parse(item.file) : [];
    files.forEach((file, key) => {
      elements.push(
        <div className={classes.fileContainer} key={key}>
          {isUserEligibleToEdit && (
            <button
              className="delete-btn"
              onClick={() => handleDelete(item, file)}
            >
              <ReactSVG src={faClose} />
            </button>
          )}
          <div
            onClick={(e) =>
              handleDownload(
                e,
                `${process.env.REACT_APP_SERVER_URL}${file}`,
                file.split("-")[1]
              )
            }
            className={`file ${classes.fileItem}`}
          >
            <ReactSVG className={classes.fileIcon} src={faFile} />
            <Tooltip
              title={file.substr(file.indexOf("-") + 1)}
              arrow
              placement="top"
            >
              <span className="file-name">
                {" "}
                {file.substr(file.indexOf("-") + 1)}
              </span>
            </Tooltip>

          </div>
        </div>
      );
    });

    return elements;
  });

  return (
    <div className="project-details-page-task-file-list">
      <PopUp className={classes.popUp} open={openFolder} handleClose={handleClose} title={`Documents`}>
        <div className={classes.filesList}>
          {filesList}
          {((isUserEligibleToEdit || isUserAnIntervenant) && isProjectEditable ) && (
            <div
              className={`${classes.fileItem}  ${
                isDocumentsNull ? "empty-add" : "add"
              }`}
              onClick={handleUpload}
            >
              <ReactSVG src={faPlus} /> <span>Ajouter un fichier</span>
              <input
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
                onChange={onChange}
                name="file"
              />
            </div>
          )}
        </div>
      </PopUp>
      <button className={classes.taskFileBtn} onClick={handleOpen}>
        {isDocumentsNull ? (
          <>
            <ReactSVG src={faEmptyFolder} /> <span>Pas de document</span>
          </>
        ) : (
          <>
            <ReactSVG src={faFolders} /> <span>Voir les documents</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TaskFiles;
