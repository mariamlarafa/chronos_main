import { useMemo } from "react";
import useGetStateFromStore from "../manage/getStateFromStore";

const useSelectFilterItems = () => {
  const projects = useGetStateFromStore("manage", "projectsList");

  const selectStates = () => {
    const list = [];
    projects.forEach((project) => {
      let exist = list.filter((item) => item === project.state);
      if (!exist.length) {
        list.push(project.state);
      }
    });
    return list;
  };
  const selectManagers = () => {
    const list = [];
    projects.forEach((project) => {
      let exist = list.filter(
        (item) => item.fullName === project.manager.fullName
      );
      if (!exist.length) {
        list.push(project.manager);
      }
    });
    return list;
  };

  const selectLots = () => {
    // function getDifferentLots(list1, list2) {
      // return list2.filter((element) => !list1.includes(element));
    // }
    // var list = [];
    // // projects.forEach((project) => {
    // //   if (!project.lots.every((lot) => list.includes(lot))) {
    // //     const lotsToAdd = getDifferentLots(list, project.lots);
    // //     list = list.concat(lotsToAdd);
    // //   }
    // // });
    return ["GO","CM","GO&CM"];
  };

  const selectPhases = () => {
    const list = [];
    projects.forEach((project) => {
      let exist = list.filter((item) => item === project.activePhase);
      if (!exist.length) {
        if (project.activePhase) {
          list.push(project.activePhase);
        }
      }
    });
    return list;
  };
  const managers = useMemo(() => selectManagers(), [projects]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const states = useMemo(() => selectStates(), [projects]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lots = useMemo(() => selectLots(), [projects]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const phase = useMemo(() => selectPhases(), [projects]);

  return { managers, states, lots, phase };
};

export default useSelectFilterItems;
