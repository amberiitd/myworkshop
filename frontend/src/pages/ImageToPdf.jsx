import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MergeIcon from "@mui/icons-material/Merge";
import { Button, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material";
import { isEmpty, uniqBy } from "lodash";
import { degrees, PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddFileButton from "../components/AddFileButton";
import { EmptySpaceUploader } from "./common/common";
import FileCardWrapper from "./common/FileCardWrapper";

const ImageToPdf = () => {
	const [addedFiles, setAddedFiles] = useState([]);
	const [finalPdfData, setFinalPdfData] = useState();
	const [exporting, setExporting] = useState(false);
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

	const embedImagesInPdf = useCallback(async () => {
		try {
			setExporting(true);
			const pdfDoc = await PDFDocument.create();
			let [width, height] = [500, 700];
			let pageAR = width / height;
			let x = width / 2,
				y = height / 2;

			for (let { rawFile: file, rotation } of addedFiles) {
				const arrayBuffer = await file.arrayBuffer();
				const page = pdfDoc.addPage([width, height]);

				let image;
				if (file.type == "image/png") {
					image = await pdfDoc.embedPng(arrayBuffer);
				} else if (file.type == "image/jpg" || file.type == "image/jpeg") {
					image = await pdfDoc.embedJpg(arrayBuffer);
				} else {
					throw Error("Incompatible image type!");
				}

				const imageAR = image.width / image.height;
				const effectiveRotation = rotation % 360;
				let drawHeight;

				if (effectiveRotation % 180) {
					[width, height] = [height, width];
					pageAR = width / height;
				}
				if (imageAR < pageAR) {
					drawHeight = height;
				} else {
					drawHeight = width / imageAR;
				}

				if (effectiveRotation == 90) {
					x = x - (1 / 2) * drawHeight;
					y = y + (1 / 2) * (drawHeight * imageAR);
				} else if (effectiveRotation == 180) {
					x = x + (1 / 2) * (drawHeight * imageAR);
					y = y + (1 / 2) * drawHeight;
				} else if (effectiveRotation == 270) {
					x = x + (1 / 2) * drawHeight;
					y = y - (1 / 2) * (drawHeight * imageAR);
				} else {
					x = x - (1 / 2) * (drawHeight * imageAR);
					y = y - (1 / 2) * drawHeight;
				}
				page.drawImage(image, {
					x,
					y,
					width: drawHeight * imageAR,
					height: drawHeight,
					rotate: degrees(-1 * effectiveRotation),
				});
			}
			const bytes = await pdfDoc.save();
			setFinalPdfData(new Blob([bytes], { type: "application/pdf" }));
		} catch (error) {
			console.error(error);
		}
		setExporting(false);
	}, [addedFiles]);

	const lockFileSection = useMemo(() => Boolean(finalPdfData), [finalPdfData]);

	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				Image to PDF
			</Typography>
			<HeaderRibbon
				files={addedFiles}
				finalPdfData={finalPdfData}
				exporting={exporting}
				onAdd={handleAddFiles}
				fileTypes={["image/png", "image/jpeg"]}
				onEmbedImagesInPdf={embedImagesInPdf}
				onCancel={() => setFinalPdfData(null)}
			/>
			<AddedFiles
				files={addedFiles}
				onRemove={!lockFileSection && onRemove}
				onAdd={!lockFileSection && handleAddFiles}
				onRotate={!lockFileSection && onRotate}
			/>
		</>
	);
};

export default ImageToPdf;

const AddedFiles = ({ files, onAdd, onRemove, onRotate }) => {
	return (
		<>
			<Grid container marginTop={2} spacing={2}>
				{files.map((file) => (
					<Grid item key={`file-${file.rawFile.name}`}>
						<ImageCard file={file} onRemove={onRemove} onRotate={onRotate} />
					</Grid>
				))}
				{isEmpty(files) && (
					<Grid item xs={12}>
						<EmptySpaceUploader onAdd={onAdd} fileTypes={["image/png", "image/jpeg"]} />
					</Grid>
				)}
			</Grid>
		</>
	);
};

const ImageCard = ({ file: { rawFile: file, rotation = 0 }, onRemove, onRotate }) => {
	const canvasRef = useRef();

	useEffect(() => {
		const imageUrl = URL.createObjectURL(file);

		let [canvasWidth, canvasHeight] = [(2.2 * 170) / 3, 170];
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		const image = new Image();
		image.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			let [imageWidth, imageHeight] = [image.width, image.height];
			const imageAR = imageWidth / imageHeight;
			const effectiveRotation = rotation % 360;
			let canvasAR = canvasWidth / canvasHeight,
				drawHeight;

			ctx.translate(canvas.width / 2, canvas.height / 2);
			if (effectiveRotation) {
				ctx.rotate((Math.PI * effectiveRotation) / 180);
			}
			if (effectiveRotation % 180) {
				[canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];
				canvasAR = canvasWidth / canvasHeight;
			}
			if (imageAR < canvasAR) {
				drawHeight = canvasHeight;
			} else {
				drawHeight = canvasWidth / imageAR;
			}

			ctx.drawImage(
				image,
				(-1 / 2) * (imageAR * drawHeight),
				(-1 / 2) * drawHeight,
				imageAR * drawHeight,
				drawHeight
			);
			ctx.restore();
		};
		image.src = imageUrl;
	}, [file, rotation]);

	return (
		<FileCardWrapper name={file.name} onRemove={onRemove} onRotate={onRotate}>
			<canvas
				ref={canvasRef}
				style={{
					boxShadow:
						"0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
				}}
			/>
			{/* <img src={imageUrl} style={{ transform: `rotate(${rotation}deg)` }} width={"100%"} /> */}
		</FileCardWrapper>
	);
};

const HeaderRibbon = ({ files, onAdd, fileTypes, onEmbedImagesInPdf, finalPdfData, exporting, onCancel }) => {
	const download = useCallback(() => {
		if (!finalPdfData) return;
		const url = URL.createObjectURL(finalPdfData);
		window.open(url);
	}, [finalPdfData]);
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
						disabled={Boolean(finalPdfData) || exporting}
						fileTypes={fileTypes}
					/>
					{files.length > 0 && (
						<Button
							size="small"
							startIcon={exporting ? <CircularProgress size={"small"} /> : <MergeIcon fontSize="small" />}
							onClick={onEmbedImagesInPdf}
							disabled={files.length < 1 || Boolean(finalPdfData)}
						>
							Export
						</Button>
					)}
					{finalPdfData && (
						<>
							<Button size="small" startIcon={<FileDownloadIcon fontSize="small" />} onClick={download}>
								Download
							</Button>
							<Button size="small" color="error" title="Cancel" onClick={onCancel}>
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
