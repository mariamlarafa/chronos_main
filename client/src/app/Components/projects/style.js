import { createUseStyles } from "react-jss";

export const projectDetails = createUseStyles({
  projectDetailsPage: {
    height: "100%",
    width: "100%",
    display: "flex",

    alignItems: "center",
    flexDirection: "column",
  },
  card: {
    border: "none",
    position: "relative",
    backgroundColor: "var(--white)",
    borderRadius: 30,
    // overflow: "hidden",
    transition: "all 0.2s ease-in-out",
    "&.colored": {
      backgroundColor: "var(--light-green)",
    },
    "&.internal": {
      display: "flex",
      alignItems: "center",
      height: "100%",
      // paddingTop:20,
      padding: 10,
    },
    "&.transparent": {
      backgroundColor: "unset",
    },
  },
  headerSkeleton: {
    minHeight: 200,
    backgroundColor: "var(--pastel-green) !important",
    width: "100%",
    height: "100%",
    borderRadius: "30px !important",
    padding: 20,
  },
  projectHeader: {
    minHeight: 20,
    height: 60,
    background: "var(--light-green)",
    color: "var(--white)",
    width: "100%",
    maxWidth: "100%",

    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    "& .headerInfo": {
      transition: "all 0.2s ease-in-out",
      whiteSpace: "nowrap",
      textWrap: "wrap",
      "&.hidden": {
        width: "0 ",
        overflow: "hidden ",
        opacity: 0,
      },
      "&.collapsed": {
        opacity: 1,
        width: "100% !important",
      },
    },
  },
  headerContainer: {
    background: "var(--white)",
  },

  seeMoreProject: {
    background: "none",
    border: "none",
    color: "var(--white)",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 14,
    gap: 10,
    transition: "all 0.2s ease-in-out",
    borderRadius: 30,
    padding: 10,
    marginLeft: "auto",
    width: "fit-content",
    "&:hover": {
      background: "var(--pastel-green)",
    },
    "&.close": {
      backgroundColor: "var(--orange)",
      color: "var(--white)",
      "&:hover": {
        background: "var(--bright-orange)",
      },
    },
    "& svg": {
      width: 18,
      fill: "var(--white)",
    },
  },
  projectTitle: {
    margin: 0,
    fontSize: 18,
  },
  searchProjectByTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    "& .search": {
      background: "none",
      border: "none",
      "& svg": {
        width: 22,
        height: 22,
        fill: "var(--white)",
      },
    },
  },
  search: {
    width: "40%",
  },
  mainInfo: {
    backgroundColor: "var(--app-bg-color)",
    transition: "all 0.3s ease-in-out",
    overflow: "hidden",
    position: "relative",
    opacity: 0,
    "&.hidden": {
      height: 0,
      overflow: "hidden",
    },
    "&.collapsed": {
      opacity: 1,

      paddingTop: 20,
      paddingBottom: 20,
      height: "auto",
      overflow: "visible",
    },
  },
  mainInfoSkeleton: {
    minHeight: 600,
    backgroundColor: "var(--pastel-green) !important",
    width: "100%",
    height: "100%",
    borderRadius: "30px !important",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    textTransform: "capitalize",
  },
  data: {
    marginTop: 10,
    "& .label": {
      fontSize: 12,
      fontStyle: "italic",
      fontWeight: 600,
      margin: 0,
    },
    "& .value": {
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      "&.blocked": {
        color: "var(--toastify-color-error)",
      },
      "&.doing": {
        color: "var(--orange)",
      },
      "&.done": {
        color: "var(--light-green)",
      },
      "&.abandoned": {
        color: "var(--black)",
      },
    },
    "& .position": {
      "& .init": {
        height: 14,
        display: "block",
        width: "100%",
        overflow: "block",
      },
      "& .changed": {
        height: 0,
        display: "block",
        width: 0,
        overflow: "hidden",
      },
    },
    "&.w-actions": {
      display: "flex",
      gap: 10,
    },
    "& button": {
      background: "none",
      border: "none",
      width: 36,
      height: 36,
      marginLeft: "1%",
      backgroundColor: "var(--app-bg-color)",
      borderRadius: "100%",
      padding: 0,
      "&:hover": {
        backgroundColor: "var(--orange)",
        "& svg": {
          fill: "var(--white)",
        },
      },
      "& div": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    "& svg": {
      width: 18,
      height: 18,
      fill: "var(--orange)",
    },
  },
  manager: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    "&.left": {
      marginLeft: "auto",
    },
    "& img": {
      height: 52,
      width: 52,
      borderRadius: "100%",
      objectFit: "fill",
    },
    "& .initials": {
      backgroundColor: "var(--orange)",
      height: 52,
      width: 52,
      minWidth: 52,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "100%",
      color: "var(--white)",
      fontSize: 24,
    },
    "&.small": {
      height: "32px !important",
      width: "32px !important",
      fontSize: 18,
      transition: "all 0.3s ease-in-out",
      "& img": {
        height: 32,
        width: 32,
      },
      "& .initials": {
        minWidth: "32px !important",
        height: 32,
        width: 32,
        fontSize: 18,
      },
      "& .manager-name": {
        width: 0,
      },
      "&:hover": {
        marginLeft: 0,
        "& .manager-name": {
          width: 300,
          overflow: "visible",
        },
      },
    },

    "& .manager-name": {
      fontWeight: 600,
      fontSize: 16,
      overflow: "hidden",
      transition: "all 0.3s ease-in-out",
      "& .email": {
        fontWeight: 500,
        color: "grey",
      },
    },
  },
  priority: {
    position: "relative",
    // overflow: "hidden",
    display: "flex",
    justifyContent: "center",

    "& .circle": {
      width: 32,
      height: 32,
      borderRadius: "100%",
    },
  },
  priorityUpdateContainer: {
    position: "absolute ",
    bottom: "-70%",

    left: "auto",
    right: "auto",
    zIndex: 999,

    width: "auto",
    backgroundColor: "var(--white)",
    borderRadius: 15,
    border: "1px solid var(--app-bg-color)",
  },
  actions: {
    position: "absolute",
    bottom: 20,
    right: 20,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    minWidth: 100,

    "&.pr ": {
      position: "unset",
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      "& button:hover": {
        width: 100,
      },
    },
    "&.top": {
      bottom: "unset",
      top: 20,
    },
    "&.right": { right: 20 },
    "& button": {
      height: 42,
      minWidth: 42,
      width: 42,
      borderRadius: "100%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "width 0.2s ease-in-out",
      "& .text": {
        width: 0,
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
      },
      "& svg": {
        height: 20,
        width: 20,
        fill: "var(--white)",
      },
      "&:hover": {
        borderRadius: 30,
        width: "100%",
        "& .text": {
          width: "100%",
          marginLeft: 5,
        },
      },
      color: "var(--white)",
      backgroundColor: "var(--light-green)",
      border: "none",
      "&.cancel": {
        backgroundColor: "var(--toastify-color-error)",
      },
      "&[disabled]": {
        opacity: 0.7,
      },
    },
    "&.fw button": {
      width: "100%",
      borderRadius: 30,
    },
    "&.ttb": {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  dueDate: {
    display: "flex",
    "& $actions": {
      position: "unset",
      margin: 0,
      justifyContent: "flex-start",
      gap: 15,
      "& button": {
        background: "none",
        minWidth: "100%",
        width: "fit-content",
        justifyContent: "flex-start",
        display: "flex",
        "& .icon-container": {
          backgroundColor: "var(--light-green)",
          minWidth: 24,
          width: 24,
          height: 24,
          borderRadius: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        "& svg": {
          width: 11,
          height: 11,
        },
        "& .text": {
          color: "var(--light-green)",
          whiteSpace: "nowrap",
          textWrap: "nowrap",
        },
      },
    },
  },
  projectQuite: {
    borderRadius: 5,
    padding: 5,
    backgroundColor: "var(--black)",
    fontWeight: 600,
    color: "var(--white)",
    textTransform: "capitalize",
    border: "none",
    fontSize: 13,
  },
  intervenantsContainer: {
    display: "flex",
    marginTop: 1,
    alignItems: "center",

    "& button": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 52,
      border: "none",
      backgroundColor: "var(--app-bg-color)",
      height: 52,
      borderRadius: "100%",
      marginLeft: 10,
      transition: "0.2s all ease-in-out",
      "&:hover": {
        backgroundColor: "var(--orange)",
        "& svg": {
          fill: "var(--white)",
        },
      },
      "& svg": {
        width: 28,
        height: 28,
        fill: "var(--orange)",
      },
    },

    "&.small": {
      "& button": {
        width: 32,
        height: 32,
        "& svg": {
          width: 22,
          height: 22,
        },
      },
      "& .MuiAvatar-root.MuiAvatar-circular.MuiAvatar-colorDefault.MuiAvatarGroup-avatar.css-sxh3gq-MuiAvatar-root-MuiAvatarGroup-avatar":
        {
          width: 32,
          height: 32,
        },
    },
  },
  detailIntervenant: {
    backgroundColor: "var(--app-bg-color)",
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
    width: "fit-content",
    "& p": {
      fontSize: 14,
      margin: 0,
      "&.email, &.name": {
        fontWeight: 600,
        marginBottom: 10,
      },
      "&.hours": {
        color: "var(--orange)",
        border: "2px solid var(--orange)",
        borderRadius: 5,
        width: "fit-content",
        padding: 15,
        fontWeight: 600,
        fontSize: 12,
      },
    },
    "& button": {
      transition: "all 0.3s ease-in-out",
      "&[disabled]": {
        opacity: 0.5,
      },
      marginTop: 15,
      backgroundColor: "var(--toastify-color-progress-error)",
      color: "var(--white)",
      height: 40,
      borderRadius: 10,
      border: "none",
      width: "100%",
      "&:hover": {
        backgroundColor: "var(--orange)",
      },
    },
  },
  projectTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  unfinished: {
    fontSize: 14,
    fontWeight: 600,
    margin: "5px 0",
    "&.doing": {
      color: "var(--orange)",
    },

    "&.requests": {
      color: "var(--toastify-color-progress-error)",
    },
  },
  headerLots: {
    margin: 0,
    textAlign: "right",
    "& .singleLot": {
      fontWeight: 600,
      padding: 5,
    },
  },
  cardTitle: {
    position: "absolute",
    left: 20,
    zIndex: 999,
    top: -10,
    "& button": {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "var(--white)",

      border: "none",
      fontSize: 14,
      fontWeight: 600,
      backgroundColor: "var(--orange)",
      marginBottom: 15,
      borderRadius: 10,
      height: 30,
      "& .icon-container div": {
        backgroundColor: "var(--white)",
        borderRadius: "100%",
        width: 20,
        height: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      "& svg": {
        fill: "var(--orange)",
        width: 15,
        height: 15,
      },
    },
  },
  seeAllIntervenants: {
    "& .MuiPaper-root": {
      width: "600px",
    },
    "& .MuiDialogContent-root": {
      maxHeight: "500px !important",
      height: "100% !important",
      overflow: "visible !important",
      overflowX: "hidden !important",
      overflowY: "auto !important",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "10px",
        // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
        background: "var(--pastel-green)",
      },
    },
  },
  intervenantItem: {
    border: "1px solid var(--app-bg-color)",
    padding: 5,
    borderRadius: 5,
    display: "grid",
    margin: "5px 0",
    gridTemplateColumns: "10% 48% 10% auto",
    alignItems: "center",
    gap: 10,
    "& .info": {
      flexDirection: "column",
      display: "flex",
      fontSize: 13,
      "& .name": {
        fontWeight: 600,
      },
      "& .email": {
        color: "grey",
      },
    },
    "& button": {
      transition: "all 0.3s ease-in-out",
      "&[disabled]": {
        opacity: 0.5,
      },
      backgroundColor: "var(--toastify-color-progress-error)",
      color: "var(--white)",
      height: 40,
      borderRadius: 10,
      border: "none",
      width: "100%",
      "&:hover": {
        backgroundColor: "var(--orange)",
      },
    },
    "& .hours": {
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 10,
      "& svg": {
        fill: "var(--orange)",
      },
    },
  },
  standAloneIcon: {
    width: 22,
    height: 22,
    "& svg": {
      width: "100%",
    },
  },
  requestInput: {
    "& textarea": {
      height: "100px !important",
      width: "500px !important",
    },
  },
  requestPopAction: {
    display: "flex",
    justifyContent: "space-between",
  },
  popUpContent: {
    "& .MuiDialogContent-root": {
      paddingTop: '10px !important',
    },
  },
});

export const projectTaskDetails = createUseStyles({
  skeleton: {
    width: "100%",
    height: "400px !important",
    transform: " none !important",
    backgroundColor: "var(--pastel-green) !important",
    borderRadius: "30px !important",
  },
  addTaskForm: {
    position: "relative",
    background: "var(--white)",
    width: "100%",
    maxWidth: "calc(100% - 40px)",
    borderRadius: 30,
    padding: 20,
  },
  inputs: {
    width: "100%",
  },
  joiBtn: {
    minWidth: 100,
    height: "80%",
    background: "none",
    border: "none",
    backgroundColor: "var(--orange)",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--white)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "var(--pastel-orange)",
    },
  },
  joinBtnSkeleton: {
    width: 100,
    height: "80%",
  },
  intervenantsSkeleton: {
    width: 150,
    height: "80%",
  },
  persistHours: {
    width: "100%",
    height: 50,
    background: "none",
    border: "none",
    backgroundColor: "var(--orange)",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--white)",
    transition: "all 0.3s ease-in-out",
    marginTop: 10,
    "&:hover": {
      backgroundColor: "var(--pastel-orange)",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnLoader: {
    width: "20%",
    "& span": {
      height: "28px !important",
      width: "28px !important",
    },
  },
  btnSaveIcon: {
    height: 22,
    width: 22,
    "& svg": {
      height: 22,
      width: 22,
      fill: "var(--white)",
    },
  },

  icon: {
    width: 18,
    height: 18,
  },
  task: {
    fontSize: 11,
    fontWeight: 600,
    // borderRadius: 5,
    padding: 5,
    // border: "2px solid",
    background: "none",
    flex: 1,
    display: "block",
    width: "100%",
    textAlign: "left",
    "&.wb": {
      border: "none",
      textAlign: "left",
      padding: 0,
    },
    "&.doing": {
      color: "var(--orange)",
      "&:not(.wb)": {
        borderColor: "var(--orange)",
      },
    },
    "&.done": {
      color: "var(--dark-green)",
      "&:not(.wb)": {
        borderColor: "var(--dark-green)",
      },
    },
    "&.abandoned": {
      color: "var(--black)",
      "&:not(.wb)": {
        borderColor: "var(--black)",
      },
    },
    "&.blocked": {
      color: "var(--toastify-icon-color-error)",
      "&:not(.wb)": {
        borderColor: "var(--toastify-icon-color-error)",
      },
    },
  },
  list: {
    border: "none",
    padding: 0,
    "& .blocked": {
      opacity: 0.5,
      // backgroundColor: "var(--app-bg-color)"
    },
    "& .MuiDataGrid-footerContainer": {
      display: "none !important",
    },
    "& .MuiDataGrid-virtualScroller": {
      width: "100%",
      margin: "auto",
      /* z-index: 999999999999999999999999999999999999999999999999999999999999999999999999; */
      position: "relative",
      borderRadius: 15,
      // border: '1px solid var(--app-bg-color)',

      marginBottom: 20,
      maxHeight: "315px !important",
      height: "100% !important",
      overflow: "visible !important",
      overflowX: "hidden !important",
      overflowY: "auto !important",
      "&::-webkit-scrollbar": {
        width: "8px",
      },

      "&::-webkit-scrollbar-track": {
        WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "10px",
        // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
        background: "var(--pastel-green)",
      },
    },
  },
  tacheVerification: {
    padding: "3px 10px",
    width: "100%",
    textAlign: "center",
    borderRadius: 5,
    border: "1px solid var(--black)",
    color: "var(--black)",
    fontWeight: 600,
    "&.verified": {
      color: "white",
      border: "none",
      backgroundColor: "var(--light-green)",
    },
  },
  tacheDescription: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    width: "100%",
  },
  taskFileBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    color: "var(--orange)",
    background: "none",
    border: "none",
    borderRadius: 5,
    padding: 4,
    transition: "all 0.3s ease-in-out",
    "& div": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& svg": {
      width: 18,
      height: 18,
      fill: "var(--orange)",
    },
    "&:hover": {
      backgroundColor: "var(--orange)",
      color: "var(--white)",
      "& svg": {
        fill: "var(--white)",
      },
    },
  },
  popUp: {
    "& h2": {
      textAlign: "center",
    },
  },
  filesList: {
    minWidth: 300,
    minHeight: 300,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  fileListPreview: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexWrap: "wrap",
    "& li": {
      border: "1px solid var(--app-bg-color)",
      padding: 8,
      margin: "5px 0",
      fontSize: 12,
      borderRadius: 5,
      color: "var(--orange)",
    },
  },
  fileItem: {
    display: "flex",
    margin: "10px 0",
    padding: 10,
    height: 100,
    width: 100,
    alignItems: "center",
    flexDirection: "column",
    background: "var(--white)",
    justifyContent: "space-evenly",
    borderRadius: 10,
    border: "1px solid var(--app-bg-color)",
    transition: "all 0.3s ease-in-out",
    fontSize: 12,
    position: "relative",
    overflow: "hidden",

    "& .file-name": {
      width: 90,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    "& span": {
      position: "relative",
      zIndex: 5,
    },
    "& button": {
      background: "none",
      color: "var(--light-green)",
      border: "none",
      fontWeight: 600,
      fontSize: 12,
    },
    "&:hover": {
      color: "var(--white)",
      backgroundColor: "var(--light-green)",
      "& $fileIcon": {
        "& svg": {
          fill: "var(--white)",
        },
      },
      "& button": {
        color: "var(--white)",
      },
    },
    "&.empty-add": {
      margin: "auto",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      width: 250,
      maxHeight: "unset",
      height: 250,
      gap: 20,
      fontSize: 22,
      color: "#c7c7c7",
      "& svg": {
        width: 50,
        height: 50,
        fill: "var(--light-green)",
        padding: 20,
        border: "5px dashed #c7c7c7",
        borderRadius: "100%",
      },
      "&:hover": {
        color: "white",

        "& svg": {
          fill: "white",
          borderColor: "white",
        },
      },
    },
    "&.add": {
      height: 40,
      width: "100%",
      backgroundColor: "var(--light-green)",
      alignSelf: "flex-end",
      color: "var(--white)",
      "&.requests": {
        width: "50%",
        margin: 0,
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        height: 50,
        borderRadius: 5,
      },
      gap: 10,
      fontWeight: 600,
      "& div": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 22,
        width: 22,
        background: "var(--white)",
        borderRadius: "100%",
      },
      "& svg": {
        width: 15,
        height: 15,
        fill: "var(--light-green)",
      },

      "&:hover": {
        borderColor: "var(--light-green)",
        color: "var(--light-green)",
        backgroundColor: "var(--white)",
      },
    },
    "&:before": {
      width: 0,
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      background: " linear-gradient(#ffa700, #ffa700)",
      transition: "all 0.2s ease-in",
      opacity: 1,
    },
    "&.downloaded": {
      background: "linear-gradient(#ffa700, #ffa700)",
      // transition: "all 0.1s ease-in-out
      animation: "$zoomIn 0.3s ease forwards",
      color: "var(--white)",

      // anim
    },
    "&.downloading,": {
      "&:before": {
        width: "100%",
      },
    },
    // },
  },
  "@keyframes zoomIn": {
    " 0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.1)",
    },
    "80%": {
      transform: "scale(1)",
    },

    "100%": {
      transform: "scale(1)",
      background: "none",
      color: "var(--black)",
    },
  },
  fileIcon: {
    position: "relative",
    "& div": {
      width: 60,
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    width: 60,
    height: 60,
    "& svg": {
      fill: "var(--orange)",
      width: 40,
      height: 40,
      margin: "auto",
    },
  },
  fileContainer: {
    position: "relative",
    "& .delete-btn": {
      position: "absolute",
      top: 0,
      right: -9,
      zIndex: 2,
      backgroundColor: "unset",
      border: "1px solid var(--app-bg-color)",
      borderRadius: "100%",
      "& div": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      height: 22,
      width: 22,
      "&:hover": {
        backgroundColor: " var(--app-bg-color)",
      },
      "& svg": {
        fill: "var(--toastify-icon-color-error)",
        height: 18,
        width: 18,
      },
    },
  },
});

export const logStyle = createUseStyles({
  logTab: {
    width: 0,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    maxHeight: "calc(100vh - 40px)",
    right: 0,
    // bottom:0,
    background: "var(--white)",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    transition: "all 0.3s ease-in-out",
    opacity: 0,
    "&.open": {
      opacity: 1,
      padding: 20,
      width: "30%",
      zIndex: 999,
      borderLeft: "5px solid var(--orange)",
    },
    // '&.closed':{
    //   overflow:
    // },
    height: "100%",
  },
  logContainer: {
    height: "100%",
    "& .header": {
      display: "flex",
      alignItems: "center",
      gap: 20,
      "& button": {
        border: "none",
        backgroundColor: "var(--light-green)",
        borderRadius: "100%",
        width: 32,
        height: 32,
        "&:hover": {
          opacity: 0.8,
        },
        "& svg": {
          height: 18,
          width: 18,
          fill: "var(--white)",
        },
      },
    },
  },
  logList: {
    marginTop: 20,
    Bottom: 50,
    overflowY: "auto",
    height: "95%",

    "&::-webkit-scrollbar": {
      width: "8px",
    },

    "&::-webkit-scrollbar-track": {
      WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
      background: "var(--pastel-green)",
    },
  },
  logLine: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 10,
    alignItems: "center",
    fontSize: 14,
    "& p": {},
    "& .text": {
      fontSize: 13,
    },
    "& .date": {
      fontStyle: "italic",
      fontWeight: "600",
      color: "grey",
    },
    padding: "10px 0",
    borderBottom: "1px var(--app-bg-color) solid",
  },
  logInfo: {
    "& .text": {
      margin: 0,
    },
    "& .action-title": {
      fontWeight: "600",
      position: "relative",
      display: "flex",
      alignItems: "center",
      marginRight: 60,
      "&::after": {
        content: '" "',
        position: "absolute",
        backgroundColor: "var(--black)",
        height: 2,
        width: 50,
        right: -60,
      },
    },
    "& .action-date ": {
      fontWeight: "600",
      color: "grey",
    },
  },
});
