import BarChartIcon from "@mui/icons-material/BarChart";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Stack, Tooltip } from "@mui/material";
import { useMemo } from "react";
import { useDropdown } from "../../../../hooks/useDropdown";
import EditLabel from "../../EditLabel";
import JsonToCsvDownloader from "../../JsonToCsvDownloader";
import MenuButton from "../../MenuButton";
import { useDynamicNotebookContext } from "../dynmamicNotebookContext";
import AxisLimits from "./AxisLimits";
import SettingsTab from "./SettingsTab";

const ToolPanel = ({ contentId, entityId, label, axisLimits, disableAxisLimits, dataset }) => {
  const { DropdownContainer, toggleRef, open } = useDropdown();
  const { onRemoveEntity, onUpdateEntity } = useDynamicNotebookContext();

  const menuItems = useMemo(
    () => [
      {
        label: "Delete",
        icon: DeleteIcon,
        action: async () => {
          onRemoveEntity({ contentId, entityId });
        },
      },
    ],
    []
  );

  return (
    <Box display={"flex"} padding={"0 20px"}>
      <Stack spacing={1} direction={"row"}>
        <MenuButton menuItems={menuItems} drophr="left" />
        <BarChartIcon sx={{ fontSize: 30 }} />
        <EditLabel
          defaultValue={label}
          onSave={(value) => {
            onUpdateEntity({ contentId, entityId, data: { label: value } });
          }}
        />
        <Tooltip title="Add plots">
        <Button
          variant={open ? "contained" : "outlined"}
          ref={toggleRef}
          size="small"
          startIcon={<EditIcon sx={{ fontSize: "14px" }} />}
          sx={{ fontSize: "14px" }}
        >
          Edit
        </Button>
        </Tooltip>
        <AxisLimits
          contentId={contentId}
          entityId={entityId}
          axisLimits={axisLimits}
          disableAxisLimits={disableAxisLimits}
        />
        <DropdownContainer>
          <SettingsTab contentId={contentId} entityId={entityId} />
        </DropdownContainer>
      </Stack>
      <JsonToCsvDownloader jsonData={dataset} sx={{ ml: "auto" }} />
    </Box>
  );
};

export default ToolPanel;
