import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, CircularProgress, IconButton, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { isEmpty } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import EmptyState from "./EmptyState";

export default function MenuButton({
  menuItems = [],
  drophr = "right",
  size = "small",
  buttonShape = "circular",
  icon,
  style = {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleToggle = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClick = useCallback(
    async (e, index) => {
      e.stopPropagation();
      if (typeof index === "number" && menuItems[index].action) {
        await menuItems[index].action();
        if (!menuItems[index].aslink) setAnchorEl(null);
      } else {
        setAnchorEl(null);
      }
    },
    [menuItems]
  );

  const [buttonStyle, iconStyle] = useMemo(() => {
    if (size === "xs")
      return [
        { width: 20, height: 20 },
        { width: 14, height: 14 },
      ];
    return [{}, {}];
  }, [size]);

  return (
    <div style={{ position: "relative", ...style }}>
      {buttonShape === "circular" && (
        <IconButton
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleToggle}
          size={size}
          sx={{ backgroundColor: open && "whitesmoke", zIndex: 100, ...buttonStyle }}
        >
          <MoreVertIcon fontSize="small" sx={{ ...iconStyle }} />
        </IconButton>
      )}
      {buttonShape === "regular" && (
        <Button
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          size={size}
          sx={{ padding: "5px", minWidth: "35px", height: 36, boxShadow: 1, border: 0, ...buttonStyle }}
          onClick={handleToggle}
        >
          {icon}
        </Button>
      )}
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={(e) => handleClick(e)}
        sx={{ padding: 1, width: 200 }}
        anchorOrigin={{
          horizontal: drophr,
          vertical: "bottom",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: drophr,
        }}
        style={{ padding: 5, zIndex: 1501 }}
      >
        
        {menuItems.map((item, index) => (
          <MenuItem
            key={`menu-item-${index}`}
            onClick={(e) => handleClick(e, index)}
            sx={{ margin: "1px 0", fontSize: 14 }}
            disabled={item.disabled}
            component={item.aslink ? RouterLink : undefined}
            to={item?.to}
          >
            <item.icon fontSize="small" sx={{ marginRight: 1 }} />
            <Typography variant="body2" fontSize={"inherit"}>
              {item.label}
            </Typography>
            {item.loading && <CircularProgress size={12} sx={{ ml: "auto" }} />}
          </MenuItem>
        ))}
        {isEmpty(menuItems) && <EmptyState message={"No items"} size="xs" />}
      </StyledMenu>
    </div>
  );
}

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
