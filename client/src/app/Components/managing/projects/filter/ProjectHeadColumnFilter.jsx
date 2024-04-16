import TableCell from "@mui/material/TableCell";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";
import useOutsideAlerter from "../../../../../hooks/outsideClick";
import {
  hideFilterForType,
  showFilterForType
} from "../../../../../store/reducers/manage.reducer";
import faFilter from "../../../../public/svgs/light/filter.svg";
import Filter from "./Filter";
import { filterStyles } from "./style";
const ProjectHeadColumnFilter = (props) => {
  const {
    column: {
      field,
      headerName,
      width,
      filter,
      items,
      handler,
      ref,
      title,
      type,
      filterWidth
    }
  } = props;
  const wrapperRef = useRef(null);
  const dispatch = useDispatch();
  const filterStatus = useGetStateFromStore("manage", "filters");

  useOutsideAlerter(wrapperRef, () => dispatch(hideFilterForType()));
  const classes = filterStyles();

  const showFilter = (filterType) => {
    dispatch(showFilterForType(filterType));
  };
  const hideFilter = () => {
    dispatch(hideFilterForType());
  };

  const isFiltering = filterStatus?.filter((ft) => ft.type === type)[0]?.active;

  return (
    <TableCell
      className={classes.tableHeader}
      key={headerName}
      variant="head"
      // align={column.numeric || false ? 'right' : 'left'}
      style={{ width }}
    >
      {filter ? (
        <>
          <button onClick={() => showFilter(type)}>
            {headerName}
            <ReactSVG src={faFilter} className={classes.filterBtn} />
          </button>
          {isFiltering && (
            <div
              className={classes.filterContainer}
              style={{ width: filterWidth ? filterWidth : "auto" }}
              ref={wrapperRef}
            >
              <Filter
                handleOpen={() => showFilter(type)}
                handleClose={() => hideFilter()}
                name={field}
                open={isFiltering}
                items={items}
                handleChange={handler}
                value={ref}
                label={title}
                filterType={type}
              />
            </div>
          )}
        </>
      ) : (
        `${headerName}`
      )}
    </TableCell>
  );
};

export default ProjectHeadColumnFilter;
