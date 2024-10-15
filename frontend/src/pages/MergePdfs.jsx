import { Grid, Typography } from "@mui/material";
import { isEmpty, uniqBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import useRender from "../hooks/useRender";
import { EmptySpaceUploader } from "./common/common";
import FileCardWrapper from "./common/FileCardWrapper";
import CloseIcon from "@mui/icons-material/Close";
import { Button, CircularProgress, Divider, Stack } from "@mui/material";
import { useCallback } from "react";
import AddFileButton from "../components/AddFileButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MergeIcon from "@mui/icons-material/Merge";
import { degrees, PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";

const MergePdfs = () => {
	const [addedFiles, setAddedFiles] = useState([]);
	const handleAddFiles = (files) => {
		setAddedFiles((fls) =>
			uniqBy([...fls, ...files.map((f) => ({ rawFile: f, rotation: 0 }))], (f) => f.rawFile.name)
		);
	};
	const onRemove = (name) => {
		setAddedFiles((fls) => fls.filter((f) => f.rawFile.name !== name));
	};

	const onRotate = (name) => {
		setAddedFiles((fls) => fls.map((f) => (f.rawFile.name === name ? { ...f, rotation: f.rotation + 90 } : f)));
	};

	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				Merge PDFs
			</Typography>

			<AddedFiles files={addedFiles} onRemove={onRemove} onAdd={handleAddFiles} onRotate={onRotate} />
		</>
	);
};

export default MergePdfs;

const AddedFiles = ({ files, onAdd, onRemove, onRotate }) => {
	return (
		<>
			<HeaderRibbon files={files} onAdd={onAdd} fileTypes={["application/pdf"]} />
			<Grid container marginTop={2} spacing={2}>
				{files.map((file) => (
					<Grid item key={`file-${file.rawFile.name}`}>
						<FileCard file={file} onRemove={onRemove} onRotate={onRotate} />
					</Grid>
				))}
				{isEmpty(files) && (
					<Grid item xs={12}>
						<EmptySpaceUploader onAdd={onAdd} fileTypes={["application/pdf"]} />
					</Grid>
				)}
			</Grid>
		</>
	);
};

const FileCard = ({ file: { rawFile: file, rotation = 0 }, onRemove, onRotate }) => {
	const canvasRef = useRef();
	const { render } = useRender(canvasRef);
	const renderTaskRef = useRef();

	useEffect(() => {
    if (renderTaskRef.current ) return;
		renderTaskRef.current = render(file, { rotation }).then(() => {
			renderTaskRef.current = null;
		});
	}, [rotation]);

	return (
		<FileCardWrapper name={file.name} onRemove={onRemove} onRotate={onRotate}>
			<canvas
				ref={canvasRef}
				style={{
					boxShadow:
						"0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
				}}
			/>
		</FileCardWrapper>
	);
};

const HeaderRibbon = ({ files, onAdd, fileTypes }) => {
	const [stage, setStage] = useState("add-files");
	const [mergedData, setMergedData] = useState();
	const mergeFiles = useCallback(async () => {
		setStage("merging");
		try {
			const mergedPDF = await PDFDocument.create();

			for (let { rawFile: file, rotation } of files) {
				const arrayBuffer = await file.arrayBuffer();
				const pdfDoc = await PDFDocument.load(arrayBuffer);
				const copiedPages = await mergedPDF.copyPages(pdfDoc, pdfDoc.getPageIndices());
				copiedPages.forEach((page) => {
					page.setRotation(degrees(rotation));
					mergedPDF.addPage(page);
				});
			}
			const bytes = await mergedPDF.save();
			setMergedData(new Blob([bytes], { type: "application/pdf" }));
			setStage("merged");
		} catch (error) {
			console.error(error);
			setStage("add-files");
			toast.error(error.message);
		}
	}, [files]);

	const download = useCallback(() => {
		if (!mergedData) return;
		const url = URL.createObjectURL(mergedData);
		window.open(url);
	}, [mergedData]);
	return (
		<>
			<Stack direction={"row"} padding={"4px 0"}>
				<Stack justifyContent={"end"}>
					<Typography fontWeight={600}>Added Files</Typography>
				</Stack>
				<Stack ml={"auto"} direction={"row-reverse"} spacing={1}>
					<AddFileButton
						onChange={onAdd}
						addedFilesCount={files.length}
						disabled={stage !== "add-files"}
						fileTypes={fileTypes}
					/>
					{files.length > 0 && (
						<Button
							size="small"
							startIcon={
								stage === "merging" ? (
									<CircularProgress size={"small"} />
								) : (
									<MergeIcon fontSize="small" />
								)
							}
							onClick={mergeFiles}
							disabled={stage !== "add-files" || files.length < 2}
						>
							Merge
						</Button>
					)}
					{stage === "merged" && (
						<>
							<Button size="small" startIcon={<FileDownloadIcon fontSize="small" />} onClick={download}>
								Download
							</Button>
							<Button
								size="small"
								color="error"
								title="Cancel"
								onClick={() => {
									setMergedData(null);
									setStage("add-files");
								}}
							>
								<CloseIcon fontSize="small" />
							</Button>
						</>
					)}
				</Stack>
			</Stack>
			<Divider sx={{ marginBottom: 1 }} />
		</>
	);
};
