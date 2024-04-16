import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { CustomPlusIcon } from "../icons";

const DateLog = (props) => {
  const { historyDate, handleDateChange } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <DatePicker
        OpenPickerIcon={<CustomPlusIcon />}
        label="Date"
        value={historyDate}
        defaultValue={historyDate}
        minDate={dayjs().subtract(7, "day")}
        maxDate={dayjs()}
        // slots={{openPickerIcon:()=><CustomPlusIcon className={classes.openPickerIcon} />}}
        slotProps={{
          textField: { variant: "standard", size: "small", readOnly: true },
        }}
        onChange={(newValue) => handleDateChange(newValue)}
      />
    </LocalizationProvider>
  );
};

export default DateLog;
