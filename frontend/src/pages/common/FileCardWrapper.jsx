import CloseIcon from "@mui/icons-material/Close";
import { Card, IconButton, Stack, Typography } from "@mui/material";

import RotateRightIcon from "@mui/icons-material/RotateRight";

const FileCardWrapper = ({ name, onRotate, onRemove, children }) => {
	return (
		<Card
			sx={{
				padding: 2,
				width: "168px",
				height: "218px",
				border: "1px hsl(215, 15%, 92%)",
				position: "relative",
				borderRadius: 2,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Stack position={"absolute"} top={10} right={10} spacing={0.5} direction={"row"}>
				{onRotate && (
					<IconButton size="small" onClick={() => onRotate(name)}>
						<RotateRightIcon fontSize="small" />
					</IconButton>
				)}
				{onRemove && (
					<IconButton size="small" onClick={() => onRemove(name)}>
						<CloseIcon fontSize="small" />
					</IconButton>
				)}
			</Stack>
			{children}
			<Typography
				fontSize={12}
				className="text-cut"
				padding={1}
				sx={{
					":hover": { boxShadow: 1 },
					position: "absolute",
					bottom: 5,
					left: 16,
					width: "calc(100% - 48px)",
				}}
				title={name}
        textAlign={"center"}
			>
				{name}
			</Typography>
		</Card>
	);
};

export default FileCardWrapper;
