import WifiOffIcon from "@mui/icons-material/WifiOff";
import { Snackbar, Stack, Typography, useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  const xxl = useMediaQuery("(min-width:1800px)");
  const xl = useMediaQuery("(min-width:1200px) and (max-width:1799px)");
  const md = useMediaQuery("(min-width:800px) and (max-width:1199px)");
  const sm = useMediaQuery("(min-width:400px) and (max-width:799px)");
  const xs = useMediaQuery("(max-width:399px)");

  const windowSize = useMemo(() => {
    if (xxl) return 5;
    if (xl) return 4;
    if (md) return 3;
    if (sm) return 2;
    if (xs) return 1;
    return null;
  }, [xl, md, sm, xs]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const turnOn = () => {
      setIsOnline(true);
    };
    const turnOff = () => setIsOnline(false);
    window.addEventListener("online", turnOn);
    window.addEventListener("offline", turnOff);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", turnOn);
      window.removeEventListener("offline", turnOff);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        windowSize,
        isOnline,
      }}
    >
      {children}
      <Snackbar
        open={!isOnline}
        message={
          <Stack direction={"row"} spacing={1} fontSize={14}>
            <Typography fontSize={"inherit"}>You are offline!</Typography>
            <WifiOffIcon fontSize={"small"} />
          </Stack>
        }
      />
    </AppContext.Provider>
  );
};

export default AppContextProvider;
