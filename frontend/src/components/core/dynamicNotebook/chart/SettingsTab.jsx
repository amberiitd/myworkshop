import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Grid, Tab, Tabs } from "@mui/material";
import { uniqueId } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { randomColor } from "../../../../util/general";
import EmptyState from "../../EmptyState";
import { useDynamicNotebookContext } from "../dynmamicNotebookContext";
import LayerSettingsCard from "./LayerSettingsCard";
import { v4 as uuidv4 } from "uuid";

const CustomTabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const SettingsTab = ({ contentId, entityId }) => {
  const [tab, setTab] = useState(0);

  return (
    <Box width={400} maxHeight={500} overflow={"auto"} padding={"0 10px"}>
      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        sx={{ borderBottom: 1, fontSize: 14, minHeight: "unset", height: "40px" }}
      >
        <Tab value={0} label={"Setup"} sx={{ fontSize: "inherit", padding: 0, lineHeight: 1 }} />
        <Tab value={1} label={"Style"} sx={{ fontSize: "inherit", padding: 0, lineHeight: 1 }} />
      </Tabs>
      <CustomTabPanel value={0} index={tab} style={{ maxHeight: 400, overflow: "auto" }}>
        <ChartSetup contentId={contentId} entityId={entityId} />
      </CustomTabPanel>
      <CustomTabPanel value={1} index={tab}>
        <EmptyState />
      </CustomTabPanel>
    </Box>
  );
};

export default SettingsTab;

const ChartSetup = ({ contentId, entityId }) => {
  const { onAddChartLayer, noteEntities } = useDynamicNotebookContext();
  const listRef = useRef(null);

  const layers = useMemo(() => {
    return noteEntities.find((ent) => ent.id === entityId)?.layers || [];
  }, [noteEntities, entityId]);
  const [lastLayerCount, setLastLayerCount] = useState(layers.length);

  useEffect(() => {
    if (listRef.current && listRef.current.lastElementChild && layers.length > lastLayerCount) {
      listRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" });
    }
    setLastLayerCount(layers.length);
  }, [layers]);

  return (
    <Grid container spacing={1} ref={listRef}>
      <Grid item xs={12} display={"flex"}>
        <Button
          sx={{ ml: "auto" }}
          variant="outlined"
          size="small"
          onClick={() => {
            onAddChartLayer({
              contentId,
              entityId,
              data: {
                id: "layer-" + uuidv4(),
                label: "Unnamed Layer",
                chartType: "line",
                showMark: false,
                chartColor: randomColor(),
              },
            });
          }}
          endIcon={<AddIcon fontSize="small" />}
        >
          Layer
        </Button>
      </Grid>

      {layers.map((l, index) => (
        <Grid item xs={12} key={`${l.id}-${index}`}>
          <LayerSettingsCard contentId={contentId} entityId={entityId} {...l} />
        </Grid>
      ))}
    </Grid>
  );
};
