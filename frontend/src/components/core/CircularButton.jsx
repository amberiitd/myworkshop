import { Button, Tooltip } from "@mui/material";

function CircularButton({ title, onClick, variant = "contained", icon, ...props }) {
  return (
    <Tooltip title={title}>
      <Button
        onClick={onClick}
        variant={variant}
        sx={{ borderRadius: "50%", padding: 1, minWidth: "unset" }}
        {...props}
      >
        {icon}
      </Button>
    </Tooltip>
  );
}

export default CircularButton;
