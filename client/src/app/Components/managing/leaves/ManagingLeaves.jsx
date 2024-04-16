import React, { useEffect, useState, useRef } from 'react';
import {useGetAllLeavesMutation, useUpdateLeaveMutation} from '../../../../store/api/leave.api';
import {useGetAllRemoteWorksMutation, useUpdateRemoteWorkMutation} from '../../../../store/api/remote.api';
import { useDispatch } from 'react-redux';
import Loading from '../../loading/Loading';
import {Button, Skeleton} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ManagingLeavesStyles } from './style';
import useGetAuthenticatedUser from "../../../../hooks/authenticated";
import TaskItem from "../../dailylog/TaskItem";
import {DAILY_HOURS_VALUE} from "../../../../constants/constants";
import {hideDailyTask, updateDailyHours} from "../../../../store/reducers/task.reducer";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import dayjs from "dayjs";
import useFetchDailyLog from "../../../../services/fetchers/dailyLog.fetch.service";
import {useGetUserByIdMutation} from "../../../../store/api/users.api";
import {useGetTasksForUserMutation} from "../../../../store/api/tasks.api";


function ManagingLeaves() {

    const [tasks,setTasks] = useState([]);
    const [userTasks] = useGetTasksForUserMutation();
    //aaded this
    const generalTasks = useGetStateFromStore("task", "userGeneralTasks");
    //removed this dayjs(new Date("05/06/2000")
    const [history, setHistory] = useState(dayjs(new Date("")));
    const hourDivision = useGetStateFromStore("task", "dailyLogDevisions");
    const { isLoading: loadingTasks } = useFetchDailyLog(history);

    const classes = ManagingLeavesStyles();
    const { user } = useGetAuthenticatedUser();
    const [leaves, setLeaves] = useState([]);
    const [pendingCountRemotes, setPendingCountRemotes] = useState(0);
    const [pendingCountleaves, setPendingCountleaves] = useState(0);

    const [remotes, setRemotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('leaves');
    const [selectedRow, setSelectedRow] = useState(null); // State to store the selected row
    const detailBlockRef = useRef(null); // Ref for the detail block

    const dispatch = useDispatch();

    const [getAllLeaves] = useGetAllLeavesMutation();
    const [getAllRemote] = useGetAllRemoteWorksMutation();
    const [changeRemote] = useUpdateRemoteWorkMutation();
    const [changeLeave] = useUpdateLeaveMutation();
    const [getUser] = useGetUserByIdMutation();

    useEffect(() => {
        async function loadLeaves() {
            try {
                const response = await getAllLeaves();
                const leavesArray = Object.values(response)[0]?.leaves || [];
                const formattedLeaves = [];
                for (const leave of leavesArray) {
                    const userResponse = await getUser(leave.userID);
                    const user = Object.values(userResponse)[0] || {}; // Assuming user is available
                    const currentDate = new Date();
                    const leaveCreateDate = new Date(leave.createdAt);
                    const timeDifference = currentDate - leaveCreateDate;

                    // Calculating time difference in milliseconds
                    const secondsDifference = Math.floor(timeDifference / 1000);
                    const minutesDifference = Math.floor(secondsDifference / 60);
                    const hoursDifference = Math.floor(minutesDifference / 60);
                    const daysDifference = Math.floor(hoursDifference / 24);
                    const monthsDifference = Math.floor(daysDifference / 30);
                    const yearsDifference = Math.floor(monthsDifference / 12);

                    let formattedCreateDate;

                    if (yearsDifference >= 1) {
                        formattedCreateDate = "il y a " + yearsDifference + " années";
                    } else if (monthsDifference >= 2) {
                        formattedCreateDate = "il y a " + monthsDifference + " mois";
                    } else if (daysDifference >= 30) {
                        formattedCreateDate = "il y a " + monthsDifference + " mois";
                    } else if (hoursDifference >= 24) {
                        formattedCreateDate = "il y a " + daysDifference + " jours";
                    } else if (minutesDifference >= 60) {
                        formattedCreateDate = "il y a " + hoursDifference + " heures";
                    } else {
                        formattedCreateDate = "il y a " + minutesDifference + " minutes";
                    }

                    formattedLeaves.push({
                        ...leave,
                        createDate: formattedCreateDate,
                        username: user.profile.lastName + " " + user.profile.name,
                        role: user.user.role
                    });
                }
                setLeaves(formattedLeaves);
                setPendingCountleaves(formattedLeaves.filter(leave => leave.status === 'En cours').length);
                const remoteResponse = await getAllRemote();
                const remoteArray = Object.values(remoteResponse)[0]?.remoteWorks || [];
                const formattedRemotes = [];
                for (const remote of remoteArray) {
                    const userResponse = await getUser(remote.userID);
                    const user = Object.values(userResponse)[0] || {}; // Assuming user is available
                    const currentDate = new Date();
                    const remoteCreateDate = new Date(remote.createdAt);
                    const timeDifference = currentDate - remoteCreateDate;

                    // Calculating time difference in milliseconds
                    const secondsDifference = Math.floor(timeDifference / 1000);
                    const minutesDifference = Math.floor(secondsDifference / 60);
                    const hoursDifference = Math.floor(minutesDifference / 60);
                    const daysDifference = Math.floor(hoursDifference / 24);
                    const monthsDifference = Math.floor(daysDifference / 30);
                    const yearsDifference = Math.floor(monthsDifference / 12);

                    let formattedCreateDate;

                    if (yearsDifference >= 1) {
                        formattedCreateDate = "il y a " + yearsDifference + " années";
                    } else if (monthsDifference >= 2) {
                        formattedCreateDate = "il y a " + monthsDifference + " mois";
                    } else if (daysDifference >= 30) {
                        formattedCreateDate = "il y a " + monthsDifference + " mois";
                    } else if (hoursDifference >= 24) {
                        formattedCreateDate = "il y a " + daysDifference + " jours";
                    } else if (minutesDifference >= 60) {
                        formattedCreateDate = "il y a " + hoursDifference + " heures";
                    } else {
                        formattedCreateDate = "il y a " + minutesDifference + " minutes";
                    }

                    formattedRemotes.push({
                        ...remote,
                        createDate: formattedCreateDate,
                        username: user.profile.lastName + " " + user.profile.name,
                        role: user.user.role,
                    });
                }
                setRemotes(formattedRemotes);
                setPendingCountRemotes(formattedRemotes.filter(remote => remote.status === 'En cours').length);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        loadLeaves();
    }, [dispatch, getAllLeaves, getAllRemote,userTasks]);


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleRowClick = async (row) => {
        if(activeTab === 'leaves'){
            const userinfo = {
                startDate: row?.row?.dateDebut,
                endDate: row?.row?.dateFin,
                userId: row?.row?.userID
            };
            const tasksss = await userTasks(userinfo);
            const taskss = Object.values(tasksss)[0]?.data || [];
            setTasks(taskss);
        }else{
            const userinfo = {
                startDate: row?.row?.remoteDate,
                endDate: new Date(new Date(row?.row?.remoteDate).setDate(new Date(row?.row?.remoteDate).getDate() + 1)),
                userId: row?.row?.userID
            };
            const tasksss = await userTasks(userinfo);
            const taskss = Object.values(tasksss)[0]?.data || [];
            setTasks(taskss);
        }

        setSelectedRow(row?.row);
        setTimeout(() => {
            detailBlockRef.current.scrollIntoView({behavior: 'smooth'});
        }, 100); // Adjust the timeout duration as needed
    };

    const columnsTableLeave = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'username', headerName: 'Nom et Prénom', width: 150 },
        { field: 'role', headerName: 'role', width: 150 },
        { field: 'type', headerName: 'Type', width: 90, renderCell: (params) => {
                if (params.value === 'Annuelle') {
                    return (
                        <div style={{
                            color: "#ddfaf4",
                            backgroundColor: "orange",
                            borderRadius: "5px",
                            padding: "5px"
                        }}>Annuelle</div>
                    );
                } else if (params.value === 'Maternité') {
                    return (
                        <div style={{
                            color: "#ddfaf4",
                            backgroundColor: "green",
                            borderRadius: "5px",
                            padding: "5px"
                        }}>Maternité</div>
                    );
                } else {
                    return (
                        <div style={{
                            color: "#ddfaf4",
                            backgroundColor: "red",
                            borderRadius: "5px",
                            padding: "5px"
                        }}>Maladie</div>
                    );
                }

            }
        },
        {
            field: 'status',
            headerName: 'Status de la demande',
            width: 180,
            renderCell: (params) => {
                let statusColor = '';
                switch (params.value) {
                    case 'En cours':
                        statusColor = 'orange';
                        break;
                    case 'Accepté':
                        statusColor = 'green';
                        break;
                    case 'Refusé':
                        statusColor = 'red';
                        break;
                    default:
                        statusColor = '';
                        break;
                }
                return <div style={{ color: statusColor }}>{params.value}</div>;
            }
        },
        { field: 'createDate', headerName: 'Date creation', width: 200,renderCell: (params) => {
                return <div style={{color: "#46efcc"}}>{params.value}</div>;
            }
        },
    ];

    const columnsTableRemote = [
        { field: 'reference', headerName: 'Référence', width: 150 },
        { field: 'username', headerName: 'Nom et Prénom', width: 150 },
        { field: 'role', headerName: 'role', width: 250 },
        { field: 'createDate', headerName: 'Date creation', width: 200 },
        {
            field: 'status',
            headerName: 'Etat de demande',
            width: 120,
            renderCell: (params) => {
                let statusColor = '';
                switch (params.value) {
                    case 'En cours':
                        statusColor = 'orange';
                        break;
                    case 'Accepté':
                        statusColor = 'green';
                        break;
                    case 'Refusé':
                        statusColor = 'red';
                        break;
                    default:
                        statusColor = '';
                        break;
                }
                return <div style={{ color: statusColor }}>{params.value}</div>;
            }
        },
    ];
    const hideTask = (id) => {
        dispatch(hideDailyTask({ id }));
    };
    const handleAccept = async () => {
        if (selectedRow && selectedRow.status === 'En cours') {
            try {
                const updatedStatus = 'Accepté';
                if (activeTab === 'leaves') {
                    const updatedLeaves = leaves.map(leave => {
                        if (leave.id === selectedRow.id) {
                            return { ...leave, status: updatedStatus };
                        }
                        return leave;
                    });
                    setLeaves(updatedLeaves);

                    // Update the leave with only status and id fields
                    const { id, status } = updatedLeaves.find(leave => leave.id === selectedRow.id);
                    const responseUpdate = await changeLeave({ id, status });
                }
                else if (activeTab === 'remote') {
                    const updatedRemotes = remotes.map(remote => {
                        if (remote.id === selectedRow.id) {
                            return { ...remote, status: updatedStatus };
                        }
                        return remote;
                    });
                    setRemotes(updatedRemotes);

                    // Assuming changeRemote is also updated to accept only status and id
                    // Update the remote with only status and id fields
                    const { id, status } = updatedRemotes.find(remote => remote.id === selectedRow.id);
                    changeRemote({ id, status });
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };
    const handleRefuse = async () => {
        if (selectedRow && selectedRow.status === 'En cours') {
            try {
                const updatedStatus = 'Refusé';
                if (activeTab === 'leaves') {
                    const updatedLeaves = leaves.map(leave => {
                        if (leave.id === selectedRow.id) {
                            return { ...leave, status: updatedStatus };
                        }
                        return leave;
                    });
                    setLeaves(updatedLeaves);

                    // Update the leave with only status and id fields
                    const { id, status } = updatedLeaves.find(leave => leave.id === selectedRow.id);
                    const responseUpdate = await changeLeave({ id, status });
                }
                else if (activeTab === 'remote') {
                    const updatedRemotes = remotes.map(remote => {
                        if (remote.id === selectedRow.id) {
                            return { ...remote, status: updatedStatus };
                        }
                        return remote;
                    });
                    setRemotes(updatedRemotes);

                    // Assuming changeRemote is also updated to accept only status and id
                    // Update the remote with only status and id fields
                    const { id, status } = updatedRemotes.find(remote => remote.id === selectedRow.id);
                    changeRemote({ id, status });
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };


    if (loading) return <Loading />;
    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <span className={classes.spanT}>Gestion de demande</span>
            </div>
            <div className={classes.contentSection}>
                <div className={classes.tabs}>
                    <div className={classes.roleBtn}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={activeTab === 'leaves'}
                            onClick={() => handleTabChange('leaves')}
                        >
                            Les demande de Congé ({pendingCountleaves})
                        </Button>
                    </div>
                    <div className={classes.roleBtn}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={activeTab === 'remote'}
                            onClick={() => handleTabChange('remote')}
                        >
                            Les demande de TT ({pendingCountRemotes})
                        </Button>
                    </div>
                </div>
                <div className={classes.tableContainer}>
                    {activeTab === 'leaves' && (
                        <DataGrid
                            rows={leaves}
                            columns={columnsTableLeave}
                            pageSize={5}
                            autoHeight
                            onRowClick={(row) => handleRowClick(row)}
                        />
                    )}
                    {activeTab === 'remote' && (
                        <DataGrid
                            rows={remotes}
                            columns={columnsTableRemote}
                            pageSize={5}
                            autoHeight
                            onRowClick={(row) => handleRowClick(row)}
                        />
                    )}
                </div>
                {selectedRow && (
                    <div>
                        <div ref={detailBlockRef} className={classes.detailBlock}>
                            <h1>Les tâches en cours</h1>
                            <div className={classes.innerDetailBlock}>
                                <div>
                                    {!loadingTasks ? (
                                        <div>
                                            {tasks.slice(0, 4).map((daily, idx) => (
                                                <TaskItem
                                                    extra={true}
                                                    historyDate={history}
                                                    id={daily.id}
                                                    key={idx}
                                                    task={daily}
                                                    value={hourDivision.tasks[daily.id]?.value}
                                                    handleHide={(e) => hideTask(daily.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Skeleton className={classes.generalTasks}/>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className={classes.buttonContainer}>
                            <div className={classes.roleBtn}>
                                <Button variant="contained" color="secondary" onClick={() => handleRefuse()}>
                                    Refuser
                                </Button>
                            </div>
                            <div className={classes.roleBtn}>
                                <Button variant="contained" color="primary" onClick={() => handleAccept()}>
                                    Accepter
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagingLeaves;
