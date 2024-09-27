import { Box, CircularProgress, Menu, MenuItem, styled, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { useCallback, useRef, useState } from "react";

export const useActionDropMenu = () => {
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
    DropMenuContainer: ({ menuItems, anchorEl, open, styleProps={} }) => {
      const handleClick = useCallback(
        async (e, index) => {
          e.stopPropagation();
          if (typeof index === "number" && menuItems[index].action) await menuItems[index].action(e);
          setAnchorEl(null);
        },
        [menuItems]
      );
      return (
        <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={(e) => handleClose(e)}
          sx={{ padding: 1, minWidth: 200, zIndex: 1501, ...styleProps }}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
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
          {isEmpty(menuItems) && <Typography fontSize={"inherit"} color={"lightgrey"} textAlign={'center'}>No Items</Typography>}
        </StyledMenu>
      );
    },
    toggleRef: (node) => {
      if (node) {
        buttonRef.current = node;
        buttonRef.current.onclick = handleOpen;
      }
    },
    open,
    anchorEl,
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
