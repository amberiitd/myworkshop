import { Button, Tooltip } from "@mui/material";
import { forwardRef } from "react";

const CTAIconButton2 = forwardRef(
  ({ onClick, icon, shadow, title, sx = {}, variant = "text", disabled, color=undefined, ...props }, ref) => {
    return (
      <Tooltip title={title || ""}>
        <Button
          ref={ref}
          disabled={Boolean(disabled)}
          size={"small"}
          sx={{ padding: "5px", minWidth: "35px", boxShadow: Boolean(shadow) ? 1 : "unset", border: 0, ...sx }}
          onClick={onClick}
          variant={disabled ? "contained" : variant}
          color={color}
          {...props}
        >
          {icon}
        </Button>
      </Tooltip>
    );
  }
);

export default CTAIconButton2;
