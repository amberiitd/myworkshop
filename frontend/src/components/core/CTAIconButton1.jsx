import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const CTAIconButton1 = ({
  onClick,
  shadow,
  loading,
  animateBorderOnLoading,
  type,
  title,
  icon,
  disableOnLoad,
  disabled,
  sx = {},
  buttonStyle = {},
  id,
}) => {
  return (
    <Box id={id} sx={{ position: "relative", ...sx }}>
      <Tooltip title={title}>
        <IconButton
          disabled={disabled || (loading && disableOnLoad)}
          type={type}
          size="small"
          sx={{ boxShadow: shadow ? 1 : 0, zIndex: 2, ...buttonStyle }}
          onClick={onClick}
        >
          {icon}
        </IconButton>
      </Tooltip>

      {animateBorderOnLoading && loading && (
        <CircularProgress
          size={"100%"}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
    </Box>
  );
};

export default CTAIconButton1;
