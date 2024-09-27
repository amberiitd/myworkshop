import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SideNavMenu from "./SideNavMenu";

const AppSideBar = () => {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <section
      style={{
        width: "calc(225px - 32px)",
        height: "calc(100% - 80px - 16px)",
        boxShadow: 1,
        position: "fixed",
        // border: '1px solid green',
        top: 0,
        padding: "80px 16px 16px 16px",
      }}
    >
      <SideNavMenu />
    </section>
  );
};

export default AppSideBar;
