import ScreenSearchDesktopRoundedIcon from "@mui/icons-material/ScreenSearchDesktopRounded";
import { Box, Typography } from "@mui/material";

const padding = {
  "small": 2,
  "xs": 0,
  "medium": 4
}
const iconSize= {
  "small": 50,
  "xs": 24,
  "medium": 100
}
const typoSize= {
  "small": 14,
  "xs": 10,
  "medium": "unset"
}

const EmptyState = ({ message, bordered, size = "medium" }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignContent={"center"}
      border={bordered ? "1px dashed lightgrey" : "unset"}
      borderRadius={2}
      padding={padding[size]}
    >
      <Box>
        <ScreenSearchDesktopRoundedIcon
          sx={{ fontSize: iconSize[size], width: "100%", color: "lightgrey", textAlign: "center" }}
        />
        <Typography textAlign={"center"} sx={{ color: "grey", fontSize: typoSize[size]}}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;
