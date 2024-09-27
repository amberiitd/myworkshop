import { Box, FormControl, InputLabel, Typography } from "@mui/material";
import { SketchPicker } from "react-color";
import { useDropdown } from "../../hooks/useDropdown";
//
const ColorPicker = ({ color, onChange }) => {
  const { toggleRef, DropdownContainer } = useDropdown();
  return (
    <FormControl
      className="custom-form-element"
      sx={{
        border: 1,
        height: "35.125px",
        borderRadius: "4px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        "& .MuiFormControl-root:hover": { borderBlockColor: "black" },
        cursor: "pointer",
      }}
      fullWidth
    >
      <InputLabel sx={{ fontSize: "14px", backgroundColor: "white", padding: "0 5px" }} shrink>
        Color
      </InputLabel>
      <Box
        ref={toggleRef}
        display={"flex"}
        flexWrap={"nowrap"}
        overflow={"auto"}
        height={"100%"}
        alignItems={"center"}
        padding={"0 10px 0 15px"}
        color={color}
      >
        <Typography fontSize={14}>{color}</Typography>
        <Box ml={"auto"} width={15} height={15} sx={{ backgroundColor: color }}></Box>
      </Box>
      <DropdownContainer>
        <SketchPicker color={color} onChangeComplete={onChange} styles={{}}/>
      </DropdownContainer>
    </FormControl>
  );
};

export default ColorPicker;
