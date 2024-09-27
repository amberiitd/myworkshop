import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import { Box, Typography } from "@mui/material";

const ErrorFallback = ({ message="Something went wrong!", bordered }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignContent={"center"}
      border={bordered ? "1px dashed lightgrey" : "unset"}
      borderRadius={2}
      padding={4}
    >
      <Box>
        <ReportRoundedIcon
          color="error"
          sx={{ fontSize: 50, width: "100%", textAlign: "center" }}
        />
        <Typography textAlign={"center"} color={"error"}fontSize={16}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default ErrorFallback;
