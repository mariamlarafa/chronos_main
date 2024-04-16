import { useDispatch } from "react-redux";
import { notify } from "../../app/Components/notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../constants/constants";
import { useCreateProjectMutation } from "../../store/api/projects.api";
import { clearAddProjectState } from "../../store/reducers/manage.reducer";

const useCreateProject = () => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const dispatch = useDispatch()
  async function create(newProject, projectCode, projectState) {
    try {
      const {
        name: { value: nameValue },
        startDate: { value: startDateValue },
        manager: { value: managerValue },
        priority: { value: priorityValue },
        phase: { value: phaseValue },
        lot: { value: lotValue },
      } = newProject;

      const project = {
        code: projectCode,
        name: nameValue,
        startDate: startDateValue,
        manager: managerValue,
        priority: priorityValue,
        phase: phaseValue,
        lot: lotValue,
        active: true,
        prevPhase: projectState.linkedProjectID
          ? projectState.linkedProjectID
          : null,
      };
      if (projectState.customCode !== projectState.code) {
        project.isCodeCustomized = true;
      } else {
        project.isCodeCustomized = false;
      }
      const data = await createProject(project).unwrap();
      notify(NOTIFY_SUCCESS, data?.message);
      dispatch(clearAddProjectState());

      return data;
    } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
        return null
    }
  }

  const submitProject = async (props) => {
    // console.log({...props});
    const { newProject, projectCode, projectState } = props;
    return await create(newProject, projectCode, projectState);
  };

  return { creatingProject: isLoading, submitProject };
};

export default useCreateProject;
