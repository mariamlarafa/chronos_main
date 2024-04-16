import { TextField } from "@mui/material";
import React from "react";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";
import Loading from "../../../loading/Loading";
import { addUserFormStyles } from "../../style";

const SearchProjectCode = ({
  codeRef,
  errorMessage,
  loading,
  getErrorMessage
}) => {
  const projectState = useGetStateFromStore("manage", "addProject");

  const externalClasses = addUserFormStyles();

  return (
    <>
      {/* <Grid item xs={12}>
        <p className={classes.info}>
          le code ci-dessous est destiné à être le code du projet ! veuillez
          garder à l'esprit que ce code n'est qu'une suggestion de
          l'application. N'hésitez pas à adapter le code à vos besoins !
        </p>
        <p className={classes.textWarning}>
          <span className="warning">ATTENTION :</span>
          vous ne pourrez pas modifier ce code après la création.
        </p>
      </Grid> */}

      {loading && !projectState.code ? (
        <Loading color="var(--orange)" />
      ) : (
        <TextField
          error={getErrorMessage("code")?.error}
          inputRef={codeRef}
          className={externalClasses.inputs}
          label="code du  projet"
          type="text"
          id="code"
          variant="outlined"
          defaultValue={projectState.code}
          helperText={
            getErrorMessage("code")?.error && getErrorMessage("code").message
          }
          required
        />
      )}

      {/* <Autocomplete
            disablePortal
            options={projectState?.existantProjects.map(
              (project) => project.code
            )}
            isOptionEqualToValue={(option,value)=>option.code === value.code}
            error={errorMessage.error ? true : undefined}
            className={externalClasses.inputs}
            label="code du projet"
            type="text"
            id="code"
            variant="outlined"
            required
            defaultValue={`${projectState.code}`}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={codeRef}
                helperText={
                  getErrorMessage("code")?.error&&
                     getErrorMessage("code").message
                }
              />
            )}
          /> */}
    </>
  );
};

export default SearchProjectCode;
