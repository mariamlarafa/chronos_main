import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import React from 'react';
import { toolbarStyle } from './style';


const CustomDataGridToolbar = () => {
    const classes = toolbarStyle()
    const CustomExportButton = React.useMemo(
        () => () => <button className={classes.customExportButton}>Download</button>,
        [classes.customExportButton]
      );

    return (
        <GridToolbarContainer className={classes.toolbarContainer}>
       <GridToolbarExport iconslots={{ exportButton: CustomExportButton }} />
        </GridToolbarContainer>
      );
}

export default CustomDataGridToolbar