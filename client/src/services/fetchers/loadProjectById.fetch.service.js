import { useDispatch } from "react-redux";
import { useGetProjectByIDMutation } from "../../store/api/projects.api";
import { useGetProjectTasksMutation } from "../../store/api/tasks.api";
import { useGetProjectRequestMutation } from "../../store/api/requests.api";
import { useEffect } from "react";
import { setProjectTask } from "../../store/reducers/task.reducer";
import { notify } from "../../app/Components/notification/notification";
import { NOTIFY_ERROR } from "../../constants/constants";
import {
  setProject,
  setProjectRequests,
} from "../../store/reducers/project.reducer";

function useLoadSpecificProject(id) {
  const [getProjectByID, { isLoading: loadingProjectById }] =
    useGetProjectByIDMutation();
  const [getProjectTasks, { isLoading: loadingProjectTasks }] =
    useGetProjectTasksMutation();
  const [getProjectRequest, { isLoading: loadingProjectRequets }] =
    useGetProjectRequestMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProjectTasks() {
      try {
        const res = await getProjectTasks(id).unwrap();
        dispatch(setProjectTask(res?.intervenants));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }

    async function loadProject() {
      try {
        const data = await getProjectByID(id).unwrap();


        dispatch(setProject(data));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    async function loadRequests() {
      try {
        const res = await getProjectRequest(id).unwrap();
        dispatch(setProjectRequests(res?.requests));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    if (id) {
      loadProject();
      loadProjectTasks();
      loadRequests();
    }
  }, [dispatch, getProjectByID, getProjectRequest, getProjectTasks, id]);

  return { loadingProjectById, loadingProjectTasks, loadingProjectRequets };
}

export default useLoadSpecificProject;
