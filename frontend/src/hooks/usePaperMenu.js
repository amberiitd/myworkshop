import { ClickAwayListener, Grow, Menu, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { isEmpty } from "lodash";
import { useCallback, useRef, useState } from "react";
import EmptyState from "../components/core/EmptyState";

export const usePaperMenu = () => {
  const buttonRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(
    (event) => {
      const anchor = event?.currentTarget;
      setAnchorEl((preAnchor) => {
        return event ? anchor : preAnchor;
      });
      setOpen((prevOpen) => !prevOpen && (Boolean(anchor) || Boolean(anchorEl)));
    },
    [anchorEl]
  );
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = useCallback(
    (event) => {
      const anchor = event?.currentTarget;
      setAnchorEl((preAnchor) => {
        return event ? anchor : preAnchor;
      });
      setOpen((prevOpen) => (Boolean(anchor) || Boolean(anchorEl)));
    },
    [anchorEl]
  );

  return {
    DropdownContainer: useCallback(
      ({ children }) => (
        <Grow
          in={Boolean(anchorEl) && open}
          style={{
            transformOrigin: "top",
          }}
        >
          <Paper sx={{ position: "absolute", minWidth: anchorEl?.offsetWidth || "unset", width: 250, zIndex: 2 }}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList>
                {children}
                {isEmpty(children) && <EmptyState message={"No users found"} size="small" />}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
        // </Menu>
      ),
      [anchorEl, open]
    ),
    toggleRef: (node) => {
      if (node) {
        buttonRef.current = node;
        buttonRef.current.onclick = handleToggle;
      }
    },
    toggleOpen: handleOpen,
    toggleClose: handleClose,
    toggle: handleToggle,
    open,
  };
};
