import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import { Box, MenuItem, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const SideNavMenu = ({ sx }) => {
  const location = useLocation();
  // const { tabId } = useParams();
  const tabId = useMemo(() => {
    const match = /^\/app\/(\w+)\/?/.exec(location.pathname);
    return match && match[1];
  }, [location]);

  return (
    <Box
      sx={{
        ...sx,
        "& .MuiMenuItem-root": {
          borderRadius: 1,
        },
      }}
    >
      <Link to={"/app/home"} style={{ textDecoration: "none" }}>
        <MenuItem selected={tabId === "home"}>
          <ScienceRoundedIcon fontSize="small" sx={{ marginRight: 1 }} htmlColor="black" />
          <Typography variant="body2" color={"black"}>
            Home
          </Typography>
        </MenuItem>
      </Link>
      {/* <Link to={"/app/dataset"} style={{ textDecoration: "none" }}>
        <MenuItem selected={tabId === "dataset"}>
          <TableChartRoundedIcon fontSize="small" sx={{ marginRight: 1 }} htmlColor="black" />
          <Typography variant="body2" color={"black"}>
            Dataset
          </Typography>
        </MenuItem>
      </Link> */}
    </Box>
  );
};

export default SideNavMenu;
