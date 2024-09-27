import { CircularProgress, Menu, MenuItem, styled, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";

export const useRightClickMenu = () => {
  const buttonRef = useRef();
  const [menuPosition, setMenuPosition] = useState(null);

  const handleOpen = (event) => {
    event.preventDefault();
    setMenuPosition(menuPosition === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null);
  };
  const handleClose = () => {
    setMenuPosition(null);
  };
  const open = Boolean(menuPosition);

  return {
    DropMenuContainer: ({ menuItems, open }) => {
      const handleClick = useCallback(
        async (e, index) => {
          e.stopPropagation();
          if (typeof index === "number" && menuItems[index].action) await menuItems[index].action();
          handleClose(null);
        },
        [menuItems]
      );
      return (
        <StyledMenu
          anchorReference="anchorPosition"
          anchorPosition={menuPosition !== null ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined}
          open={open}
          onClose={(e) => handleClose(e)}
          sx={{ padding: 1, width: 200 }}
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          style={{ padding: 5, zIndex: 1501 }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={`menu-item-${index}`}
              onClick={(e) => handleClick(e, index)}
              sx={{ margin: "1px 0", fontSize: 14 }}
              selected={item.selected}
              disabled={item.disabled}
            >
              {item.icon && <item.icon fontSize="small" sx={{ marginRight: 1 }} />}
              <Typography variant="body2" fontSize={"inherit"}>
                {item.label}
              </Typography>
              {item.loading && <CircularProgress size={12} sx={{ ml: "auto" }} />}
            </MenuItem>
          ))}
        </StyledMenu>
      );
    },
    toggleRef: (node) => {
      if (node) {
        buttonRef.current = node;
        // buttonRef.current.onContextMenu = handleOpen;
        buttonRef.current.addEventListener('contextmenu', handleOpen);
      }
    },
    open,
  };
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",

    minWidth: 180,
    "& .MuiMenu-list": {
      padding: "8px",
    },
    "& .MuiMenuItem-root": {
      borderRadius: "6px",
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
      },
      "&:active": {},
    },
  },
}));
