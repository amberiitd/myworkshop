import { Route, Routes } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import MainLayout from "../components/MainLayout";
import NavBar from "../components/Navbar";
import AppSideBar from "../components/Sidebar";
import { useAppContext } from "../contexts/appContext";
import Home from "./Home";
import ImageToPdf from "./ImageToPdf";
import LockPdf from "./LockPdf";
import MergePdfs from "./MergePdfs";
import SignPdf from "./SignPdf";
import UnlockPdf from "./UnlockPdf";
import JWTUtil from "./JWTUtil";
import OCR from "./OCR";

const AppLayout = () => {
	const { windowSize } = useAppContext();
	return (
		<div className="app">
			<NavBar />
			{windowSize <= 2 && <BottomBar />}
			{windowSize > 2 && <AppSideBar />}
			<MainLayout padding={windowSize > 2 ? "64px 16px 32px 225px" : "64px 16px 32px 16px"}>
				<Routes>
					<Route path="home" element={<Home />} />
					<Route path="merge-pdfs" element={<MergePdfs />} />
					<Route path="unlock-pdf" element={<UnlockPdf />} />
					<Route path="lock-pdf" element={<LockPdf />} />
					<Route path="image-to-pdf" element={<ImageToPdf />} />
          <Route path="ocr" element={<OCR />} />
					{/* <Route path="experiment" element={<Experiment />} /> */}
					<Route path="sign-pdf" element={<SignPdf />} />
          <Route path="jwt" element={<JWTUtil />} />
				</Routes>
			</MainLayout>
		</div>
	);
};

export default AppLayout;
