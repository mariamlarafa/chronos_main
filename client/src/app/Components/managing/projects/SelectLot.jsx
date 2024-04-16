import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName?.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default function SelectLot({
  classes,
  lots,
  initialValue,
  handleChange,
  error,
  errorText,
  label,
  size
}) {
  const theme = useTheme();
  return (
    <div>
      <FormControl required className={classes} error={error}>
       {label&& <InputLabel id="lot-multiple-chip-label">Lots</InputLabel>}
        <Select
          required
          labelId="lot-multiple-chip-label"
          id="lot-multiple-chip"
          name="lots"
          multiple
          value={initialValue}
          onChange={handleChange}
          size={size?size:"medium"}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>

              {selected.map((value) => (
                <Chip size="small" key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {lots.map((lot) => (
            <MenuItem
              key={lot.name}
              value={lot.name}
              style={getStyles(lot.name, initialValue, theme)}
            >
              {lot.name}
            </MenuItem>
          ))}
        </Select>
        {error&&
                <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
