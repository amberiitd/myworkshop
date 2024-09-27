import { useTheme } from "@emotion/react";
import { useMemo } from "react";
import { tokens } from "../../contexts/theme";

const VerticalBreak = () => {
 const theme = useTheme();
 const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
 return (
   <span
     style={{
       width: "2px",
       margin: "auto 10px",
       backgroundColor: 'rgba( 238,238,238 )',
       boxShadow: 2,
       borderRadius: 1,
       height: 30
     }}
   >
   </span>
 );
};


export default VerticalBreak;

