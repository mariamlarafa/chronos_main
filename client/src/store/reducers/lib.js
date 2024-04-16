export function getPorjectAndTasksKeys(projectsArray, tasksArray, type, id) {
  let taskKeys = [];
  let projectKeys = [];

  if (type === "tasks") {
    taskKeys = Object.keys(tasksArray).filter((key) => parseInt(key) !== id);
  } else {
    taskKeys = Object.keys(tasksArray);
  }
  if (type === "projects") {
    projectKeys = Object.keys(projectsArray).filter(
      (key) => parseInt(key) !== id
    );
  } else {
    projectKeys = Object.keys(projectsArray);
  }
  return { taskKeys, projectKeys };
}

export function getUnChangedItems(keys, array) {
  return keys.filter((key) => !array[key].changed);
}

export function calculateTotalValuesForChangedItems(keys, array) {
  let total = 0;
  keys.forEach((key) => {
    if (array[key].changed) {
      total += array[key].value;
    }
  });
  return total
}
