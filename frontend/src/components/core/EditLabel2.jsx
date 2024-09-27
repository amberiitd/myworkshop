import { Box, IconButton, Link, TextField, Tooltip, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import ModeRoundedIcon from "@mui/icons-material/ModeRounded";
import { trim } from "lodash";

const EditLabel2 = ({
  value,
  to,
  onChange,
  buttonSize = "small",
  fontSize = 14,
  hideEditButton,
  editorWidth = "100%",
}) => {
  const [mode, setMode] = useState("display");
  const handleSave = useCallback((e) => {
    setMode("display");
    if (onChange) onChange(trim(e.target.value));
  }, [onChange]);

  const [buttonStyle, iconStyle] = useMemo(() => {
    if (buttonSize === "xs")
      return [
        { width: 20, height: 20 },
        { width: 14, height: 14 },
      ];
    return [{}, {}];
  }, [buttonSize]);

  return (
    <Box className="toggleview-container">
      {mode === "display" && (
        <Box display="flex">
          {Boolean(to) ? (
            <Link component={RouterLink} to={to}>
              {value}
            </Link>
          ) : (
            <Typography fontSize={fontSize}>{value}</Typography>
          )}

          {!hideEditButton && (
            <Box display={"flex"} alignItems={"center"} ml={1}>
              <Tooltip title="Rename">
                <IconButton
                  className="toggleview-child"
                  size="small"
                  onClick={(e) => {
                    setMode("edit");
                    e.stopPropagation();
                  }}
                  sx={{ ...buttonStyle }}
                >
                  <ModeRoundedIcon sx={{ ...iconStyle }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      )}
      {mode === "edit" && (
        <TextField
          autoFocus
          size="small"
          variant="outlined"
          defaultValue={value}
          onBlur={handleSave}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleSave(e);
          }}
          sx={{
            width: editorWidth,
            "& .MuiOutlinedInput-root": {
              fontSize: "inherit",
            },
            "& .MuiInputBase-input": {
              padding: 0,
            },
            "& .MuiInputBase-root": {
              backgroundColor: "white",
            },
          }}
        />
      )}
    </Box>
  );
};

export default EditLabel2;
