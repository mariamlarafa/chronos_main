import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";
import { filterStyles } from "./style";



const Filter = (props) => {
  const {
    items,
    handleChange,
    filterType,
    name,
  } = props;
  const classes = filterStyles();

  const { filterType: active } = useGetStateFromStore("manage", "addProject");
  const taskFilters = useGetStateFromStore("manage", "projectsTaskFilters");

  const getInitials = (fullName) => {
    let first;
    let second;
    const splits = fullName.split(" ");
    first = splits[0] ? splits[0][0].toUpperCase() : "";
    second = splits[1] ? splits[1][0].toUpperCase() : "";

    return `${first}${second}`;
  };

  const filterValues = ()=>{

    if (filterType === 'taskState'){
      return taskFilters
    }
    const ft = active?.filter((ft) => ft.type === filterType)
    if (!ft.length) return []
    return ft[0]?.value
   };

  return (
    <div
      className={`${classes.filter} ${
        filterType === "manager.fullName" ? "wide" : ""
      }`}
    >
      {filterType === "manager.fullName" ? (
        <List>
          {items.map((option) => {
            const labelId = `checkbox-list-managerName-label-${option?.fullName}`;
            return (
              <ListItem
                key={option?.fullName}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    value={option.fullName}
                    onChange={handleChange}
                    checked={filterValues().indexOf(option.fullName) !== -1}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    {option.image ? (
                      <Avatar
                        // sx={{ width: 32, height: 32 }}
                        alt={option?.fullName}
                        src={`${process.env.REACT_APP_SERVER_URL}${option.image}`}
                      />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {getInitials(option?.fullName)}
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={`${option?.fullName}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <List>
        {items.map((option) => {
          const labelId = `checkbox-list-managerName-label-${option}`;
          return (
            <ListItem
              key={`${name}-${option}`}
              secondaryAction={
                <Checkbox
                  edge="end"
                    value={option}
                    name={name}
                  onChange={handleChange}
                  checked={filterValues().indexOf(option) !== -1}

                  inputProps={{ "aria-labelledby": labelId }}
                />
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemText id={labelId} primary={`${option}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      )}
    </div>
  );
};

export default Filter;
