import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, MenuItem, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import MenuButton from "../MenuButton";
import EditLabel2 from "../EditLabel2";

const ContentItemLabel = ({
  tabId,
  selected,
  label,
  handleClick,
  handleTabClose,
  handleDeleteTab,
  handleTabNameChange,
  variant = "div",
  ...props
}) => {
  const Wrapper = variant === "menu" ? MenuItem : Box;
  const menuItems = useMemo(() => {
    const items = [];
    if (handleDeleteTab) {
      items.push({
        label: "Delete",
        icon: DeleteIcon,
        action: async () => {
          await handleDeleteTab(tabId);
        },
      });
    }
    return items;
  }, [tabId, handleDeleteTab]);

  return (
    <Box
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
      {!handleTabNameChange && (
        <Typography fontSize={"inherit"} sx={{ padding: "0px 5px" }}>
          {label}
        </Typography>
      )}
      {handleTabNameChange && (
        <EditLabel2
          value={label}
          onChange={(value) => {
            handleTabNameChange(tabId, value);
          }}
          fontSize={12}
          buttonSize={"xs"}
        />
      )}
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
      {!isEmpty(menuItems) && (
        <Box ml={"auto"}>
          <MenuButton menuItems={menuItems} size={"xs"} />
        </Box>
      )}
    </Box>
  );
};

export default ContentItemLabel;
