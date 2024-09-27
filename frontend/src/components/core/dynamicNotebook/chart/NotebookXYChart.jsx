import { Box } from "@mui/material";
import {
  BarPlot,
  ChartsAxisHighlight,
  ChartsGrid,
  ChartsLegend,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
  ResponsiveChartContainer,
} from "@mui/x-charts";
import { isEmpty, sortBy } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import ErrorBoundary from "../../error/ErrorBoundary";
import ErrorFallback from "../../error/ErrorFallback1";
import { useDynamicNotebookContext } from "../dynmamicNotebookContext";
import ToolPanel from "./ToolPanel";
import { generateSeriesIdSuffix, parseToXColumn, shouldRefreshDataset } from "./util";

const NotebookXYChart = ({ contentId, id, label, layers = [], axisLimits }) => {
  const { dataSources, onUpdateEntity } = useDynamicNotebookContext();
  const [localLayers, setLocalLayers] = useState([]);
  const [dataset, setDataset] = useState([]);
  // const [axisLimits, setAxisLimits] = useState([{ min: 0, max: 100 }]);
  const [xAxis, series] = useMemo(() => {
    const xAxis = [];
    const series = [];
    const filteredlayers = layers.filter((l) => l.datasource && l.xkey && l.ykey);
    const idSuffix = generateSeriesIdSuffix(filteredlayers);
    for (let l of filteredlayers) {
      if (!l.xkey || !l.ykey) continue;
      const [_, xtype] = parseToXColumn(l.xkey);
      if (xAxis.length === 0)
        xAxis.push({
          id: "x-axis-id",
          dataKey: "x",
          scaleType: l.chartType === "bar" ? "band" : "linear",
          valueFormatter: (v) => (xtype === "datetime" ? moment.unix(v / 1000).format("YYYY-MM-DD") : `${v}`),
        });
      else {
        if (l.chartType === "bar") {
          xAxis[0].scaleType = "band";
        }
      }

      series.push({
        id: l.id + "-" + idSuffix,
        xAxisKey: "x-axis-id",
        type: l.chartType,
        dataKey: l.id,
        label: l.label,
        showMark: Boolean(l.showMark),
        color: l.chartColor,
        connectNulls: true
      });
    }
    return [xAxis, series];
  }, [layers]);

  const refreshDataset = (layers, dataSources) => {
    if (isEmpty(dataSources)) {
      setDataset([]);
      return;
    }
    let datasetMap = {};
    let min = Infinity;
    let max = -1*Infinity;
    const rowbase = layers.reduce((p, c) => {
      if (!c.datasource || !c.xkey || !c.ykey) return p;
      p[c.id] = null;
      return p;
    }, {});
    for (let l of layers) {
      if (!l.datasource || !l.xkey || !l.ykey || !l.sourceId || isEmpty(dataSources[l.sourceId])) continue;
      const dataUnit = dataSources[l.sourceId];
      const [xname, _] = parseToXColumn(l.xkey);
      const xpoints = dataUnit[l.datasource]?.dataset?.map((row) => row[xname]) || [];
      const ypoints = dataUnit[l.datasource]?.dataset?.map((row) => row[l.ykey]) || [];
      for (let i = 0; i < ypoints.length; i++) {
        const yval = ypoints[i] == null ? null : ypoints[i];
        if (yval == null) continue;

        if (xpoints[i] < min) min = xpoints[i];
        if (xpoints[i] > max) max = xpoints[i];
        if (!datasetMap[xpoints[i]]) {
          datasetMap[xpoints[i]] = { x: xpoints[i], ...rowbase };
        }
        datasetMap[xpoints[i]][l.id] = yval;
      }
    }
    min = min === Infinity ? 0 : min;
    onUpdateEntity({
      contentId,
      entityId: id,
      data: { axisLimits: { low: min, min, high: max, max } },
    });
    setDataset(sortBy(Object.values(datasetMap), (v) => v["x"]));
  };

  useEffect(() => {
    if (shouldRefreshDataset(localLayers, layers)) {
      refreshDataset(layers, dataSources);
      setLocalLayers(layers.map((l) => ({ xkey: l.xkey, ykey: l.ykey, datasource: l.datasource })));
    }
  }, [layers]);

  useEffect(() => {
    refreshDataset(layers, dataSources);
  }, [dataSources]);

  return (
    <Box paddingTop={2} boxShadow={1} minWidth={570}>
      <ToolPanel
        dataset={dataset}
        contentId={contentId}
        entityId={id}
        label={label}
        axisLimits={axisLimits}
        disableAxisLimits={xAxis[0]?.scaleType === "band"}
      />
      <Box paddingLeft={3} height={400}>
        <ErrorBoundary fallback={<ErrorFallback message={"Something went wrong!"} />}>
          <ResponsiveChartContainer
            dataset={dataset}
            series={series || []}
            // xAxis={xAxis}
            xAxis={
              !isEmpty(xAxis)
                ? [{ min: axisLimits.min, max: axisLimits.max, ...xAxis[0] }]
                : [{ min: axisLimits.min, max: axisLimits.max }]
            }
            yAxis={isEmpty(series) ? [{ min: 0, max: 100 }] : null}
            height={400}
          >
            <ChartsLegend direction="row" />
            <ChartsGrid horizontal />
            <BarPlot />
            <LinePlot />
            <MarkPlot />
            <ChartsTooltip trigger="axis" />
            <ChartsAxisHighlight x="line" />
            <ChartsXAxis disableTicks />
            <ChartsYAxis />
          </ResponsiveChartContainer>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default NotebookXYChart;
