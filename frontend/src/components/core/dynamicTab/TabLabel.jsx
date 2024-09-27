import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import { useRightClickMenu } from "../../../hooks/useRightClickMenu";

const TabLabel = ({
  tabId,
  selected,
  label,
  handleClick,
  handleTabClose,
  handleOpenInNewTabGroup,
  variant = "div",
  ...props
}) => {
  const menuItems = useMemo(() => {
    const items = [];
    if (handleOpenInNewTabGroup) {
      items.push({
        label: "Open in new group",
        action: async () => {
          await handleOpenInNewTabGroup(tabId);
        },
      });
    }
    return items;
  }, [handleOpenInNewTabGroup]);

  const { toggleRef, DropMenuContainer, open } = useRightClickMenu();

  return (
    <Box
      ref={toggleRef}
      className="toggleview-container"
      sx={{
        display: "flex",
        alignItems: "center",
        fontSize: "inherit",
        backgroundColor: selected ? "lightgrey" : "",
        cursor: "pointer",
        ":hover": {
          backgroundColor: selected ? "lightgrey" : "whitesmoke",
        },
        minHeight: 24,
      }}
      onClick={(e) => {
        if (handleClick) handleClick(e, tabId);
      }}
      {...props}
    >
      <Typography fontSize={"inherit"} sx={{ padding: "0px 5px" }}>
        {label}
      </Typography>
      {handleTabClose && (
        <IconButton
          className="toggleview-child"
          size="small"
          onClick={(e) => handleTabClose(e, tabId)}
          sx={{ width: 20, height: 20, ml: "auto" }}
        >
          <CloseIcon sx={{ width: 14, height: 14 }} />
        </IconButton>
      )}
      <DropMenuContainer menuItems={menuItems} open={open} />
    </Box>
  );
};

export default TabLabel;
