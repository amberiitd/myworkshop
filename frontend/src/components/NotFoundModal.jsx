import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const notFoundModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const NotFoundModal = ({ notfound }) => {
  return (
    <Modal open={notfound}>
      <Box sx={{ ...notFoundModalStyle, width: 400 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Model not found
        </Typography>
        <Stack spacing={1} padding={'8px 0'} direction={"row-reverse"} marginTop={3}>
          <Button size="small" variant="contained" LinkComponent={RouterLink} to={"/app/home"}>
            Go to dashboard
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
