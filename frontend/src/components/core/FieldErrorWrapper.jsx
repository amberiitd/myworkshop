import { Tooltip } from "@mui/material";

const FieldErrorWrapper = ({ error, children }) => {
  return (
    <Tooltip
      title={error?.message || ""}
      open={Boolean(error)}
      arrow
      placement="top"
      color="error"
      componentsProps={{ popper: {style: {zIndex: 1200}}, tooltip: { style: { backgroundColor: "red"} }, arrow: { style: { color: "red" } } }}
    >
      <div>{children}</div>
    </Tooltip>
  );
};

export default FieldErrorWrapper;
