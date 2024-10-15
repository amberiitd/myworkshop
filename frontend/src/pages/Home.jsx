import LockOpenIcon from "@mui/icons-material/LockOpen";
import MergeIcon from "@mui/icons-material/Merge";
import { Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DrawIcon from '@mui/icons-material/Draw';
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import ScanIcon from "../components/icons/ScanIcon";

const Home = () => {
	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				Home
			</Typography>
			<AllTools />
		</>
	);
};

export default Home;

const AllTools = () => {
	return (
		<>
			<Stack direction={"row"} padding={"4px 0"}>
				<Typography fontWeight={600}>All Tools</Typography>
			</Stack>
			<Divider sx={{ marginBottom: 1 }} />
			<Grid container spacing={2}>
				<Grid item>
					<ToolCard
						label={"Merge PDFs"}
						icon={<ToolIcon icon={MergeIcon} iconProps={{ style: { transform: "rotate(90deg)" } }} />}
						to={"/app/merge-pdfs"}
					/>
				</Grid>
				<Grid item>
					<ToolCard label={"Unlock PDF"} icon={<ToolIcon icon={LockOpenIcon} />} to={"/app/unlock-pdf"} />
				</Grid>
				<Grid item>
					<ToolCard label={"Lock PDF"} icon={<ToolIcon icon={LockIcon} />} to={"/app/lock-pdf"} />
				</Grid>
				<Grid item>
					<ToolCard
						label={"Image to PDF"}
						icon={<ToolIconPair icon1={ImageIcon} icon2={PictureAsPdfIcon} />}
						to={"/app/image-to-pdf"}
					/>
				</Grid>
        <Grid item>
					<ToolCard
						label={"Sign PDF"}
						icon={<ToolIcon icon={DrawIcon} />}
						to={"/app/sign-pdf"}
					/>
				</Grid>
        <Grid item>
					<ToolCard
						label={"PDF OCR"}
						icon={<ToolIcon icon={ScanIcon} />}
						to={"/app/ocr"}
					/>
				</Grid>
        <Grid item>
					<ToolCard
						label={"JWT Util"}
						icon={<ToolIcon icon={TokenOutlinedIcon} />}
						to={"/app/jwt"}
					/>
				</Grid>
			</Grid>
		</>
	);
};

const ToolCard = ({ icon, label, to }) => {
	return (
		<Card
			component={RouterLink}
			to={to}
			sx={{
				":hover, :focus": {
					boxShadow: 3,
				},
				display: "block",
				borderRadius: 2,
				textDecoration: "none",
				width: 150,
				height: 132,
			}}
		>
			<CardContent>
        {icon}
				<Typography marginTop={2}>{label}</Typography>
			</CardContent>
		</Card>
	);
};

const ToolIconPair = ({ icon1: Icon1, icon2: Icon2 }) => {
	return (
		<Stack direction={"row"} alignItems={"center"}>
			<Icon1
				sx={{
					padding: 1,
					backgroundColor: "hsl(215, 15%, 92%)",
					borderRadius: 1,
				}}
			/>
			<ArrowForwardIcon fontSize="small" />
			<Icon2
				sx={{
					padding: 1,
					backgroundColor: "hsl(215, 15%, 92%)",
					borderRadius: 1,
				}}
			/>
		</Stack>
	);
};

const ToolIcon = ({ icon: Icon, iconProps = { style: {} } }) => {
	const { style: iconStyle } = iconProps;
	return (
		<Icon
			sx={{
				...iconStyle,
				padding: 1,
				backgroundColor: "hsl(215, 15%, 92%)",
				borderRadius: 1,
			}}
		/>
	);
};
