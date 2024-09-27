import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { isEmpty } from "lodash";
import { useRef } from "react";

const AddFileButton = ({ onChange, addedFilesCount, disabled, fileTypes }) => {
	const inputRef = useRef();
	return (
		<>
			<Button
				disabled={disabled}
				size="small"
				variant="contained"
				title={"Add PDFs"}
				onClick={() => {
					inputRef.current.click();
				}}
				startIcon={<AddIcon fontSize="small" />}
			>
				Upload File
			</Button>
			<input
				ref={inputRef}
				type={"file"}
				accept={fileTypes.join(",")}
				style={{ display: "none" }}
				onChange={async (e) => {
					if (!isEmpty(e.target.files)) {
						onChange(Array.from(e.target.files));
						inputRef.current.value = "";
					}
				}}
			/>
		</>
	);
};

export default AddFileButton;
