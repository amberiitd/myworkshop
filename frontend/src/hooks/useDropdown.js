import { Menu } from "@mui/material";
import { useCallback, useRef, useState } from "react";

export const useDropdown = () => {
  const buttonRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return {
    DropdownContainer: useCallback(
      ({ children, sx = {} }) => (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ "& .MuiList-padding": { padding: 0 }, ...sx }}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          
        >
          {children}
        </Menu>
      ),
      [anchorEl, open]
    ),
    toggleRef: (node) => {
      if (node) {
        buttonRef.current = node;
        buttonRef.current.onclick = handleOpen;
      }
    },
    open,
    handleOpen,
    handleClose
  };
};
