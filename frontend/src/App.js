import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AppContextProvider from "./contexts/appContext";
import { useMode } from "./contexts/theme";
import AppLayout from "./pages/HomeLayout";

function App() {
	const { theme } = useMode();

	return (
		<ThemeProvider theme={theme}>
			<AppContextProvider>
				<BrowserRouter>
					<Routes>
						<Route path="app/*" element={<AppLayout />} />
						<Route path="*" element={<Navigate to="/not-found" />} />
					</Routes>
				</BrowserRouter>

				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					closeOnClick
					pauseOnFocusLoss
					pauseOnHover
					theme={"light"}
				/>
			</AppContextProvider>
		</ThemeProvider>
	);
}

export default App;
