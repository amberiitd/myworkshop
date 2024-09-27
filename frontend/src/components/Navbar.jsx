import { AppBar, Toolbar } from "@mui/material";
import { BrandName1 } from "./Brand";

export const NavLayout = ({ children }) => (
	<AppBar sx={{ backgroundColor: "unset", boxShadow: 0, padding: "0 16px", "& .MuiToolbar-root": { padding: 0 } }}>
		<Toolbar sx={{ backgroundColor: "whitesmoke" }}>{children}</Toolbar>
	</AppBar>
);

const NavBar = () => {
	return (
		<NavLayout>
      <BrandName1 />
		</NavLayout>
	);
};

export default NavBar;