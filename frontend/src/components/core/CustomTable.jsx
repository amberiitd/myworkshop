import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useMemo } from "react";
import { isEmpty, startCase } from "lodash";
import { IconButton, Skeleton, Stack } from "@mui/material";
import MenuButton from "./MenuButton";
import { useScrollShadow } from "../../hooks/useScrollShadow";

function createColDef(data) {
  if (!Array.isArray(data)) return [];
  const colMap = {};

  for (const row of data) {
    for (const [key, val] of Object.entries(row)) {
      if (colMap[key]) continue;
      colMap[key] = { key };
    }
  }

  return Object.values(colMap);
}

function SimpleTable({
  rowIdKey,
  colDef,
  dataset = [],
  loading,
  rowActionItems,
  maxHeight = "600px",
  rowActionOrientation = "menu",
  sx={}
}) {
  const localColDef = useMemo(() => colDef || createColDef(dataset), [colDef, dataset]);
  const { ref } = useScrollShadow();

  if (loading) return <TableSkeleton sx={sx} />;
  return (
    <TableContainer ref={ref} component={Paper} sx={{ maxHeight, overflow: "auto", fontSize: "small", ...sx }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {localColDef.map(({ key, label }) => (
              <TableCell key={`col-${key}`} sx={{ fontWeight: 600, fontSize: "inherit" }}>
                {startCase(label || key)}
              </TableCell>
            ))}
            {!isEmpty(rowActionItems) && (
              <TableCell key={`col-action`} sx={{ fontWeight: 600, fontSize: "inherit" }}>
                Action
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataset.map((row, index) => (
            <TableRow
              key={rowIdKey ? `row-${row[rowIdKey]}` : `row-${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              selected={Boolean(row.selected)}
            >
              {localColDef.map(({ key, valueGetter }) => (
                <TableCell key={`row-cell-${key}`} sx={{ fontSize: "inherit" }}>
                  {valueGetter ? valueGetter(row[key], row) : row[key]}
                </TableCell>
              ))}
              <RowAction rowActionItems={rowActionItems} orientation={rowActionOrientation} row={row} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableSkeleton = ({sx}) => {
  return (
    <TableContainer component={Paper} sx={{ height: "100%", overflow: "auto", fontSize: "small", ...sx }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {Array.from(Array(4)).map((_, index) => (
              <TableCell key={`skeleton-col-${index}`} sx={{ fontWeight: 600, fontSize: "inherit" }}>
                <Skeleton width={100} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(Array(4)).map((_, index) => (
            <TableRow key={`row-${index}`} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              {Array.from(Array(4)).map((_, index) => (
                <TableCell key={`row-cell-${index}`} sx={{ fontSize: "inherit" }}>
                  <Skeleton width={100} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RowAction = ({rowActionItems = [], orientation = "menu", row = {}}) => {
  if (isEmpty(rowActionItems)) return null;

  return (
    <TableCell sx={{ fontSize: "inherit" }}>
      {orientation === "menu" && (
        <MenuButton
          menuItems={rowActionItems.map((act) => ({
            ...act,
            action: () => act.action(row),
            disabled: typeof act.disabled === "function" ? act.disabled(row) : Boolean(act.disabled),
          }))}
        />
      )}
      {orientation === "spread" && (
        <Stack direction={"row"}>
          {rowActionItems.map((act) => (
            <IconButton
              size="small"
              onClick={() => act.action(row)}
              disabled={typeof act.disabled === "function" ? act.disabled(row) : Boolean(act.disabled)}
            >
              <act.icon fontSize="small" />
            </IconButton>
          ))}
        </Stack>
      )}
    </TableCell>
  );
};

export default SimpleTable;
