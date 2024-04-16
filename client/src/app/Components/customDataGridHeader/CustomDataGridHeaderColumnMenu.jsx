import { GridColumnMenu } from '@mui/x-data-grid';
import React from 'react'

const CustomDataGridHeaderColumnMenu = (props) => {
    return (
        <GridColumnMenu
          {...props}
          slotProps={{
            // Swap positions of filter and sort items
            columnMenuFilterItem: {
              displayOrder: 0, // Previously `10`
            },
            columnMenuSortItem: {
              displayOrder: 10, // Previously `0`
            },
          }}
          slots={{
            columnMenuColumnsItem: null,

          }}
        />
      );
}

export default CustomDataGridHeaderColumnMenu