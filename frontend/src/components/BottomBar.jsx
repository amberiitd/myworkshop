import AddIcon from "@mui/icons-material/Add";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import { AppBar, Fab, Grid, MenuItem, Toolbar, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BottomBar = () => {
  const location = useLocation();
  // const { tabId } = useParams();
  const navigate = useNavigate();
  const tabId = useMemo(() => {
    const match = /^\/app\/(\w+)\/?/.exec(location.pathname);
    return match && match[1];
  }, [location]);
  return (
    <AppBar sx={{ backgroundColor: "whitesmoke", bottom: 0, left: 0, top: "unset" }}>
      {/* <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 75, right: 20 }}
        onClick={() => navigate("home?addNew=true")}
      >
        <AddIcon />
      </Fab> */}
      <Toolbar>
        <Grid container>
          <Grid item xs={6}>
            <Link to={"/app/home"} style={{ textDecoration: "none" }}>
              <MenuItem selected={tabId === "home"} sx={{ textAlign: "center" }}>
                <ScienceRoundedIcon fontSize="small" sx={{ marginRight: 1 }} htmlColor="black" />
                <Typography variant="body2" color={"black"}>
                  Experiment
                </Typography>
              </MenuItem>
            </Link>
          </Grid>
          {/* <Grid item xs={6}>
            <Link to={"/app/dataset"} style={{ textDecoration: "none" }}>
              <MenuItem selected={tabId === "dataset"} sx={{ textAlign: "center" }}>
                <TableChartRoundedIcon fontSize="small" sx={{ marginRight: 1 }} htmlColor="black" />
                <Typography variant="body2" color={"black"}>
                  Dataset
                </Typography>
              </MenuItem>
            </Link>
          </Grid> */}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default BottomBar;
