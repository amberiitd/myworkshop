import { Box, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ScanIcon from "../components/icons/ScanIcon";
import useAddFiles from "../hooks/useAddFiles";
import { isEmpty } from "lodash";
import useRender from "../hooks/useRender";
import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

const ascenderLetters = [
	"b",
	"d",
	"f",
	"h",
	"k",
	"l",
	"t",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
];
const descenderLetters = ["g", "j", "p", "q", "y"];
const shortLetters = ["a", "c", "e", "i", "m", "n", "o", "r", "s", "u", "v", "w", "x", "z"];

const OCR = () => {
	const [file, setFile] = useState();
	const canvasRef = useRef();
	const [scanned, setScanned] = useState();
	const [scanning, isScanning] = useState(false);
	const { render, renderImage } = useRender(canvasRef);

	const { triggerRef } = useAddFiles(
		async (files) => {
			if (isEmpty(files)) return;
			setFile(files[0]);
			if (files[0].type === "application/pdf") await render(files[0]);
			if (files[0].type.startsWith("image")) await renderImage(files[0]);
		},
		["application/pdf", "image/jpg", "image/jpeg", "image/png"]
	);
	const clearCanvas = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			// Clears the entire canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

	const drawTextOnPage = async (page, imageBlob, imageProps, fontProps) => {
		const {
			data: { words },
		} = await Tesseract.recognize(imageBlob, "eng");
		// console.log(words);

		for (let {
			text,
			bbox: { x0, y0, x1, y1 },
		} of words) {
			let textHeight = (y1 - y0) * imageProps.scale;
			const textWidth = (x1 - x0) * imageProps.scale;
			const textFontWidth = fontProps.timesRomanFont.widthOfTextAtSize(text, textHeight);
			const wImgX = imageProps.scale * x0,
				wImgY = imageProps.scale * (imageProps.height - y1);

			const theta =
				(wImgX == 0 ? (wImgY < 0 ? -1 * Math.PI : Math.PI) : Math.atan(wImgY / wImgX)) +
				(imageProps.rotation * Math.PI) / 180;

			const imgR = Math.sqrt(Math.pow(wImgX, 2) + Math.pow(wImgY, 2));
			let wPdfX = Math.cos(theta) * imgR + imageProps.x,
				wPdfY = Math.sin(theta) * imgR + imageProps.y;

			const hasAscender = text.split("").some((l) => ascenderLetters.includes(l));
			const hasDescender = text.split("").some((l) => descenderLetters.includes(l));

			if (hasAscender && hasDescender) {
			} else if (hasAscender) {
				const newTextHeight = (textHeight * 1.8) / 1.4;
				wPdfY -= newTextHeight - textHeight;
				textHeight = newTextHeight;
			} else if (hasDescender) {
				textHeight = (textHeight * 1.8) / 1.4;
			} else {
				const newTextHeight = textHeight * 1.8;
				wPdfY -= (newTextHeight - textHeight) / 2;
				textHeight = newTextHeight;
			}
			const scaleFactor = textWidth / textFontWidth;

			//adjust for line height
			wPdfX = wPdfX - (Math.sin((imageProps.rotation * Math.PI) / 180) * (textHeight * 0.4)) / 1.8;
			wPdfY = wPdfY + (Math.cos((imageProps.rotation * Math.PI) / 180) * (textHeight * 0.4)) / 1.8;
			// console.log({
			// 	text,
			// 	textWidth,
			// 	textHeight,
			// 	wPdfX,
			// 	wPdfY,
			// 	imageProps,
			// 	scaleFactor,
			// });

			page.drawText(text, {
				x: wPdfX,
				y: wPdfY,
				size: textHeight,
				font: scaleFactor > 1.3 ? fontProps.courierFont : fontProps.timesRomanFont,
				color: rgb(0, 0, 0),
				opacity: 0,
				rotate: degrees(imageProps.rotation),
			});
		}
	};

	const runImageOCR = async (file) => {
		const pdfDoc = await PDFDocument.create();
		let [width, height] = [500, 700];
		let pageAR = width / height;

		// midpoint as the draw coordinate
		let x = width / 2,
			y = height / 2;

		const arrayBuffer = await file.arrayBuffer();
		const page = pdfDoc.addPage([width, height]);

		// embed image
		let image;
		if (file.type == "image/png") {
			image = await pdfDoc.embedPng(arrayBuffer);
		} else if (file.type == "image/jpg" || file.type == "image/jpeg") {
			image = await pdfDoc.embedJpg(arrayBuffer);
		} else {
			throw Error("Incompatible image type!");
		}

		// calculate image dimensions
		const imageAR = image.width / image.height;
		let imageScale = 1;
		let drawHeight;
		if (imageAR < pageAR) {
			drawHeight = height;
			imageScale = drawHeight / image.height;
		} else {
			drawHeight = width / imageAR;
			imageScale = width / image.width;
		}

		// reposition draw coordinate so that midpoint of image matches with midpoint of the page
		x = x - (1 / 2) * (drawHeight * imageAR);
		y = y - (1 / 2) * drawHeight;

		// draw image
		page.drawImage(image, {
			x,
			y,
			width: drawHeight * imageAR,
			height: drawHeight,
		});

		// handle text embedding
		const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
		const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

		await drawTextOnPage(
			page,
			file,
			{ x, y, width: image.width, height: image.height, scale: imageScale, rotation: 0 },
			{ timesRomanFont, courierFont }
		);

		const pdfBytes = await pdfDoc.save();
		// Download the generated PDF
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		setScanned(URL.createObjectURL(blob));
	};

	const imageToBlob = (image) => {
		// Create a canvas element
		const canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		// Get the canvas 2D context
		const ctx = canvas.getContext("2d");

		// Draw the image on the canvas
		ctx.drawImage(image, 0, 0);

		// Convert canvas to Blob (you can specify image type here)
		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				resolve(blob);
			}, "image/png"); // You can change to 'image/jpeg' if needed
		});
	};

	const runPdfOCR = async (file) => {
		pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
		const data = await file.arrayBuffer();

		const pdfjsDoc = await pdfjsLib.getDocument({ data }).promise;
		const numPages = pdfjsDoc.numPages;

		const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
		const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
		const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

		for (let i = 1; i <= numPages; i++) {
			const page = await pdfjsDoc.getPage(i);
			const ops = await page.getOperatorList();
			const images = [];

			// console.log(ops.argsArray);
			// console.log(ops.fnArray);
			// console.log(Object.entries(pdfjsLib.OPS).sort((a, b) => a[1]-b[1]));
			// console.log(ops.fnArray.map((fn) => pdfjsLib.OPS[fn]));

			for (let j = 0; j < ops.fnArray.length; j++) {
				if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
					const imageName = ops.argsArray[j][0];
					const image = await new Promise((resolve, reject) => {
						page.objs.get(imageName, (resolvedImage) => {
							if (resolvedImage) {
								resolve(resolvedImage);
							} else {
								reject(`Error: Image ${imageName} is not resolved yet.`);
							}
						});
					});

					// Save the image or push it to the images array
					images.push(image);
					const imageData = await imageToBlob(image.bitmap);

					let transformMatrix = [1, 0, 0, 1, 0, 0];
					for (let m = j - 1; m >= 0 && ops.fnArray[m] !== pdfjsLib.OPS.save; m--) {
						if (ops.fnArray[m] === pdfjsLib.OPS.transform) {
							transformMatrix = multiplyMatrices(transformMatrix, ops.argsArray[m]);
						}
					}
					const width = Math.sqrt(Math.pow(transformMatrix[0], 2) + Math.pow(transformMatrix[1], 2)),
						height = Math.sqrt(Math.pow(transformMatrix[2], 2) + Math.pow(transformMatrix[3], 2)),
						rotation = (Math.atan2(transformMatrix[1], transformMatrix[0]) * 180) / Math.PI,
						x = transformMatrix[4],
						y = transformMatrix[5];
					// console.log(transformMatrix);
					// console.log("scaling_x", width);
					// console.log("scaling_y", height);
					// console.log("rotation", rotation);

					await drawTextOnPage(
						pdfDoc.getPage(i - 1),
						imageData,
						{ x, y, width: image.width, height: image.height, rotation, scale: width / image.width },
						{ timesRomanFont, courierFont }
					);
				}
			}
			const pdfBytes = await pdfDoc.save();

			// Download the generated PDF
			const blob = new Blob([pdfBytes], { type: "application/pdf" });
			setScanned(URL.createObjectURL(blob));
		}
	};

	const runOCR = async (file) => {
		isScanning(true);
		try {
			if (["image/jpg", "image/jpeg", "image/png"].includes(file.type)) {
				await runImageOCR(file);
			} else if (file.type === "application/pdf") {
				runPdfOCR(file);
			} else {
				throw Error(`OCR for file type <${file.type}> not implemented`);
			}
		} catch (error) {
			console.error(error);
		} finally {
			isScanning(false);
		}
	};

	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				PDF OCR
			</Typography>
			{!file && (
				<Box padding={4}>
					<Box display={"flex"} justifyContent={"center"} alignItems={"center"} padding={4}>
						<IconButton ref={triggerRef} sx={{ width: 100, height: 100 }}>
							<AddIcon sx={{ width: 80, height: 80 }} />
						</IconButton>
					</Box>
					<Typography textAlign={"center"} color={"grey"}>
						Choose PDF
					</Typography>
				</Box>
			)}

			<Box padding={4} display={file ? "block" : "none"} justifyContent={"center"}>
				<Stack direction={"row"} justifyContent={"center"}>
					<canvas
						ref={canvasRef}
						style={{
							boxShadow:
								"0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
						}}
					/>
				</Stack>
				<Stack direction={"row"} padding={2} justifyContent={"center"} spacing={1}>
					<Button
						size="small"
						onClick={() => {
							setFile(null);
							clearCanvas();
							setScanned(null);
						}}
						color="error"
						startIcon={<CloseIcon fontSize="small" />}
					>
						Remove
					</Button>
					{!scanned && (
						<Button
							size="small"
							onClick={() => runOCR(file)}
							variant="contained"
							startIcon={scanning ? <CircularProgress size={"16px"} /> : <ScanIcon fontSize="small" />}
							disabled={scanning}
						>
							Run OCR
						</Button>
					)}
					{scanned && (
						<Button
							size="small"
							onClick={() => {
								window.open(scanned);
							}}
							variant="contained"
							// startIcon={<FileDownloadIcon fontSize="small" />}
						>
							Download
						</Button>
					)}
				</Stack>
			</Box>
			<canvas id="ocr-canvas" style={{ display: "none" }} />
		</>
	);
};

export default OCR;

function multiplyMatrices(m1, m2) {
	return [
		m1[0] * m2[0] + m1[1] * m2[2], // a'
		m1[0] * m2[1] + m1[1] * m2[3], // b'
		m1[2] * m2[0] + m1[3] * m2[2], // c'
		m1[2] * m2[1] + m1[3] * m2[3], // d'
		m1[4] * m2[0] + m1[5] * m2[2] + m2[4], // e'
		m1[4] * m2[1] + m1[5] * m2[3] + m2[5], // f'
	];
}
