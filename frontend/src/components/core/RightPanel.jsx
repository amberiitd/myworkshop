import { Box, Slide, Stack, Typography } from "@mui/material";

const RightPanel = ({children, open, width=300, height='calc(100% - 110px)', padding=0}) => {
  return (
    <Slide in={Boolean(open)} direction="left" sx={{ top: 71 }}>
      <Box
        height={height}
        width={width}
        border={1}
        borderColor={'whitesmoke'}
        borderRadius={2}
        position={"absolute"}
        right={5}
        top={5}
        boxShadow={2}
        style={{ backgroundColor: "white" }}
        padding={padding}
      >
        {children}
      </Box>
    </Slide>
  );
};

export default RightPanel;
