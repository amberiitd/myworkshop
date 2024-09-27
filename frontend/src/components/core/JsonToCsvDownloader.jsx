import { Tooltip } from "@mui/material";
import Papa from "papaparse";
import React, { useCallback } from "react";
import { ExportIcon } from "../icons/ExportIcon";
import CTAIconButton2 from "./CTAIconButton2";

const JsonToCsvDownloader = ({ jsonData, sx = {} }) => {
  const downloadCSV = useCallback(() => {
    const csv = Papa.unparse(jsonData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;

    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    URL.revokeObjectURL(url);
  }, [jsonData]);

  return <CTAIconButton2 title="Export to csv" shadow onClick={downloadCSV} icon={<ExportIcon fontSize="small"/>} sx={{ ...sx }} />;
};

export default JsonToCsvDownloader;
