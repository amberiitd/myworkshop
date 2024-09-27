import AddIcon from "@mui/icons-material/Add";
import { Box, IconButton, Typography } from "@mui/material";
import useAddFiles from "../../hooks/useAddFiles";


export const EmptySpaceUploader = ({ onAdd, fileTypes }) => {
	const { triggerRef } = useAddFiles(onAdd, fileTypes);

	return (
		<Box>
			<Box display={"flex"} justifyContent={"center"} alignItems={"center"} padding={4}>
				<IconButton ref={triggerRef} sx={{ width: 100, height: 100 }}>
					<AddIcon sx={{ width: 80, height: 80 }} />
				</IconButton>
			</Box>
			<Typography textAlign={"center"} color={"grey"}>
				Click to add files
			</Typography>
		</Box>
	);
};
