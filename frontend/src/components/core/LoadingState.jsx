import { Box, Grid, Typography } from "@mui/material";

const LoadingState = ({ message }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignContent={"center"}
      // border={bordered ? "1px dashed lightgrey" : "unset"}
      // borderRadius={2}
      padding={4}
    >
      <Box>
        <img className="blink-view" src={"/assets/icons/sp_logo.png"} width={100} />
        <Typography textAlign={"center"} sx={{ color: "grey" }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingState;
