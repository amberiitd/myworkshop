import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import stringify from "json-stable-stringify";
import { isEmpty, startCase } from "lodash";
import { useEffect, useMemo } from "react";
import ColorPicker from "../../ColorPicker";
import EditLabel from "../../EditLabel";
import { useDynamicNotebookContext } from "../dynmamicNotebookContext";
import { parseToXColumn } from "./util";
import DeleteIcon from "@mui/icons-material/Delete";
import CTAIconButton2 from "../../CTAIconButton2";
import useCollapse from "../../../../hooks/useCollapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";
const LayerSettingsCard = ({
  contentId,
  entityId,
  label,
  id,
  sourceId,
  datasource = "",
  chartType = "",
  xkey = "",
  ykey = "",
  showMark,
  open = true,
  chartColor = null,
}) => {
  const { onRemoveChartLayer, onUpdateChartLayer, dataSources, groupedSources } = useDynamicNotebookContext();
  const dataUnit = useMemo(() => (dataSources && dataSources[sourceId]) || {}, [sourceId, dataSources]);
  const columns = useMemo(
    () =>
      Object.keys(
        ((dataUnit && dataUnit[datasource]?.dataset) || []).reduce((pre, cur) => {
          for (let k of Object.keys(cur)) pre[k] = true;
          return pre;
        }, {})
      ),
    [dataUnit, datasource]
  );
  const xcolumns = useMemo(() => {
    if (dataUnit && dataUnit[datasource]?.settings?.x_axis_key) return dataUnit[datasource].settings.x_axis_key;
    else return columns;
  }, [dataUnit, datasource, columns]);

  const { CollapseContainer, toggleRef, expanded } = useCollapse({
    expanded: Boolean(open),
    onToggle: (isOpen) => {
      onUpdateChartLayer({ contentId, entityId, layerId: id, data: { open: isOpen } });
    },
  });

  useEffect(() => {
    if (!xkey && !isEmpty(xcolumns)) {
      onUpdateChartLayer({ contentId, entityId, layerId: id, data: { xkey: xcolumns[0] } });
    }
  }, [xcolumns]);
  
  return (
    <Card>
      <CardHeader
        title={
          <Box display={"flex"}>
            <EditLabel
              defaultValue={label}
              fontSize={"14px"}
              onSave={(label) => {
                onUpdateChartLayer({ contentId, entityId, layerId: id, data: { label } });
              }}
            />
            <CTAIconButton2
              title={"Remove layer"}
              onClick={() => onRemoveChartLayer({ contentId, entityId, layerId: id })}
              icon={<DeleteIcon fontSize="small" color="error" />}
              sx={{ ml: "auto" }}
              color={"error"}
              // variant="contained"
            />
            <IconButton size="small" ref={toggleRef} sx={{ ml: 1 }}>
              <KeyboardArrowDownIcon fontSize="small" style={{ transform: expanded ? "rotate(180deg)" : "unset" }} />
            </IconButton>
          </Box>
        }
      />
      <CollapseContainer>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id={`chart-layer-${id}-datasource`} sx={{ fontSize: "14px" }}>
                  Source
                </InputLabel>
                <Select
                  labelId={`chart-layer-${id}-source`}
                  label="Source"
                  value={sourceId}
                  size="small"
                  sx={{ fontSize: "14px" }}
                  onChange={(e) => {
                    onUpdateChartLayer({ contentId, entityId, layerId: id, data: { sourceId: e.target.value } });
                  }}
                >
                  {Object.entries(groupedSources).map((ent, index) => [
                    <Divider>
                      <Typography fontSize={10}>{ent[1][0]?.nodeName}</Typography>
                    </Divider>,
                    ent[1].map(({ label, id }) => (
                      <MenuItem key={`source-item-${id}`} value={id ?? null} sx={{ fontSize: "inherit" }}>
                        {label}
                      </MenuItem>
                    )),
                  ])}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth disabled={isEmpty(sourceId)}>
                <InputLabel id={`chart-layer-${id}-Attribute`} sx={{ fontSize: "14px" }}>
                  Attribute
                </InputLabel>
                <Select
                  labelId={`chart-layer-${id}-Attribute`}
                  label="Attribute"
                  value={datasource}
                  size="small"
                  sx={{ fontSize: "14px" }}
                  onChange={(e) => {
                    onUpdateChartLayer({ contentId, entityId, layerId: id, data: { datasource: e.target.value } });
                  }}
                >
                  {Object.keys(dataUnit).map((sname, index) => (
                    <MenuItem key={`source-item-${sname}`} value={sname} sx={{ fontSize: "inherit" }}>
                      {sname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id={`chart-layer-${id}-chart-type`} sx={{ fontSize: "14px" }}>
                  Chart Type
                </InputLabel>
                <Select
                  labelId={`chart-layer-${id}-chart-type`}
                  label="Chart Type"
                  value={chartType}
                  size="small"
                  sx={{ fontSize: "14px" }}
                  onChange={(e) => {
                    onUpdateChartLayer({ contentId, entityId, layerId: id, data: { chartType: e.target.value } });
                  }}
                >
                  {["bar", "line"].map((ch, index) => (
                    <MenuItem key={`source-item-${ch}`} value={ch} sx={{ fontSize: "inherit" }}>
                      {startCase(ch)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {datasource && (
              <>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={`chart-layer-${id}-x`} sx={{ fontSize: "14px" }}>
                      x
                    </InputLabel>
                    <Select
                      labelId={`chart-layer-${id}-x`}
                      label="x"
                      value={stringify(xkey)}
                      size="small"
                      sx={{ fontSize: "14px" }}
                      onChange={(e) => {
                        onUpdateChartLayer({
                          contentId,
                          entityId,
                          layerId: id,
                          data: { xkey: JSON.parse(e.target.value) },
                        });
                      }}
                    >
                      {xcolumns.map((col, index) => (
                        <MenuItem
                          key={`column-y-item-${JSON.stringify(col)}`}
                          value={stringify(col)}
                          sx={{ fontSize: "inherit" }}
                        >
                          {parseToXColumn(col)[0]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={`chart-layer-${id}-y`} sx={{ fontSize: "14px" }}>
                      y
                    </InputLabel>
                    <Select
                      labelId={`chart-layer-${id}-y`}
                      label="y"
                      value={ykey}
                      size="small"
                      sx={{ fontSize: "14px" }}
                      onChange={(e) => {
                        onUpdateChartLayer({ contentId, entityId, layerId: id, data: { ykey: e.target.value } });
                      }}
                    >
                      {columns.map((cname, index) => (
                        <MenuItem key={`column-y-item-${cname}`} value={cname} sx={{ fontSize: "inherit" }}>
                          {cname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showMark}
                        onChange={(e, showMark) =>
                          onUpdateChartLayer({ contentId, entityId, layerId: id, data: { showMark } })
                        }
                      />
                    }
                    label={<Typography fontSize={"14px"}>Show marks</Typography>}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ColorPicker
                    color={chartColor}
                    onChange={(color) => {
                      onUpdateChartLayer({
                        contentId,
                        entityId,
                        layerId: id,
                        // data: { chartColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` },
                        data: { chartColor: color.hex },
                      });
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </CollapseContainer>
    </Card>
  );
};

export default LayerSettingsCard;
