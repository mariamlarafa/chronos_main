import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import dayjs from "dayjs";
import React, { useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { ReactSVG } from "react-svg";
import * as XLSX from "xlsx";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import faExportIcon from "../../../public/svgs/light/file-export.svg";
import { CustomExcelFile, CustomFileCsvFile, CustomPDFFile } from "../../icons";
import { projectsStyles } from "../style";
import useOutsideAlerter from "../../../../hooks/outsideClick";
// import pdf from  'pdfjs'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Register fonts with pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ExportActions = ({pdfProjectList,projectTasksPDf}) => {
  const [showList, setShowList] = useState(false);
  const classes = projectsStyles();
  const projects = useGetStateFromStore("manage", "projectsList");
  const tasks = useGetStateFromStore("manage", "projectsTaskList");
  const listRef = useRef(null);

  const toggleShow = () => {
    setShowList((prev) => !prev);
  };

  const hideExportOptions = () => {
    if (showList) {
      setShowList(false);
    }
  };

  useOutsideAlerter(listRef, () => hideExportOptions());

  // const selectData =()=>{
  //     let list =[]
  //     list  =
  //     return list
  // }

  const getProjectTasks = (projectID) => {
    const projectTasksList = tasks?.filter(
      (item) => item.projectID === projectID
    );

    if (projectTasksList.length) {
      return projectTasksList[0].tasks.map((task) => task.name).toString();
    }
    return "";
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const exportableData = useMemo(() => {
    return projects.map((item) => ({
      ID: item.id,
      Code: item.code,
      "Nom  du projet": item.projectName,
      "ID complet du projet": item.projectCustomId,
      Phase: item.activePhase,
      "Etat du projet": item.state,
      "Chef de projet": item?.manager?.fullName,
      Priority: item.priority,
      "Liste des taches": getProjectTasks(item.id),

      // "Etat du projet": item.phaseStatus,
      "Requête traité": item.requestsTreated,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // console.log(pdfProjectList);
  const handleExportPdf = async () => {
    const documentDefinition = {
      defaultStyle: {
        fontSize: 9,
        bold: true,
      },
      content: [
        {
          table: {
            headerRows: 1,
            body: [
              [
                "Code",
                "Nom du projet",
                "ID complet du projet",
                "Phase",
                "Etat du projet",
                "Chef de projet",
                "Priority",
                "Liste des taches",
                "Requête traité",
              ],
              ...pdfProjectList.map((item) => [
                item.code,
                item.projectName,
                item.projectCustomId,
                item.activePhase,
                item.state,
                item.manager?.fullName,
                item.priority,
                projectTasksPDf(item.id).map(task=>task.name).toString(),
                item.requestsTreated,
              ]),
            ],
          },
        },
      ],
    };

    // Create and download the PDF
    pdfMake.createPdf(documentDefinition).download("exported_data.pdf");
  };

  const handleExcelDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportableData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    XLSX.writeFile(
      workbook,
      `list-projet-${new dayjs().format("DD/MM/YYYY")}.xlsx`
    );
    // saveAs(excelBuffer, "data.xlsx");
  };

  return (
    <div ref={listRef} className={classes.exportAction}>
      <button onClick={toggleShow} className={classes.exportBtn}>
        {" "}
        <ReactSVG src={faExportIcon} className="export-icon" /> Exporter{" "}
      </button>
      {showList && (
        <div className={classes.exportList}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleExcelDownload}>
                <ListItemIcon>
                  {/* <InboxIcon /> */}
                  <CustomExcelFile className="list-icon" />
                </ListItemIcon>
                <ListItemText primary="Format excel" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleExportPdf}>
                <ListItemIcon>
                  {/* <InboxIcon /> */}
                  <CustomPDFFile className="list-icon" />
                </ListItemIcon>
                <ListItemText primary="Format PDF" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <CSVLink
                data={exportableData}
                filename={`list-projet-${new dayjs().format("DD/MM/YYYY")}.csv`}
                className={classes.csvLink}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <CustomFileCsvFile className="list-icon" />
                  </ListItemIcon>
                  <ListItemText primary="Format csv" />
                </ListItemButton>
              </CSVLink>
            </ListItem>
          </List>
        </div>
      )}
    </div>
  );
};

export default ExportActions;
