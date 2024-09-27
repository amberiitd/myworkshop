import { createTheme } from "@mui/material";
import { createContext, useState, useMemo } from "react";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        bg: {
          [100]: "#28282B",
        },
        primary: {
          100: "#080808",
          900: "#FFFFFF",
        },
      }
    : {
        bg: {
          [100]: "#BED3E5",
        },
        primary: {
          100: "#FFFFFF",
          900: "#080808",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      primary: {
        main: colors.primary[900],
      },
      background: {
        default: colors.primary[100],
      },
    },
    typography: {
      fontFamily: "ArtifaktElement-Regular",// ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 16,
    },
  };
};

export const ColorModeContext = createContext({});

export const useMode = () => {
  const [mode, setMode] = useState("light");
  const toggleColorMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return { theme, toggleColorMode };
};
