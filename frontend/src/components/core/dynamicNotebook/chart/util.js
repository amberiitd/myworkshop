import { isEqual } from "lodash";

export function shouldRefreshDataset(preLayers, curLayers) {
  if (preLayers.length !== curLayers.length) return true;
  for (let i = 0; i < preLayers.length; i++) {
    if (
      !isEqual(preLayers[i].xkey, curLayers[i].xkey) ||
      preLayers[i].ykey !== curLayers[i].ykey ||
      preLayers[i].datasource !== curLayers[i].datasource
    )
      return true;
  }
  return false;
}

export function generateSeriesIdSuffix(layers = []) {
  const prefix = "suffix-";
  return (
    prefix +
    layers
      .map((l, index) =>
        !l.xkey || !l.ykey ? "" : `l${index}<d:${l.datasource}><x:${parseToXColumn(l.xkey)[0]}><y:${l.ykey}>`
      )
      .join(";")
  );
}

export function parseToXColumn(col) {
  if (typeof col === "string") {
    return [col, col === "ds" ? "datetime" : "default"];
  } else if (typeof col === "object") {
    return [col.name, col.type];
  } else {
    return [null, null];
  }
}
