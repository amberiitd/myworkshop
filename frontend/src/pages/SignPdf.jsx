import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DrawIcon from "@mui/icons-material/Draw";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, IconButton, Modal, Stack, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { degrees, PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { toast } from "react-toastify";
import useAddFiles from "../hooks/useAddFiles";
import { useDropdown } from "../hooks/useDropdown";
import useFabricDraw from "../hooks/useFabricDraw";
import useRenderPage from "../hooks/useRenderPdfPage";

const SignPdf = () => {
	const [file, setFile] = useState();
	const [pageNumber, setPageNumber] = useState();
	const [finalPdf, setFinalPdf] = useState();
	const { initalize, render: renderPage, totalPage, destroy, currentPageContainerId } = useRenderPage();
	const { addElement, destroy: destroyDraw, getObjects } = useFabricDraw();
	const { triggerRef } = useAddFiles(
		async (files) => {
			if (isEmpty(files)) return;
			setFile(files[0]);
			await initalize(files[0]);
			setPageNumber(1);
		},
		["application/pdf"]
	);

	const onRefresh = () => {
		// first destroy
		destroy("pdf-page-list");

		// then remove state
		setFile(null);
		setPageNumber(null);
		destroyDraw();
		setFinalPdf(null);
	};

	useEffect(() => {
		if (pageNumber) renderPage("pdf-page-list", { pageNumber });
	}, [pageNumber]);

	// useLayoutEffect(() => {
	// 	const insertDrawLayer = async () => {
	// 		await wait(100);
	// 		const pageContainer = document.getElementById("pdf-page-list");
	// 		let drawLayer = document.getElementById("page-draw-layer");
	// 		if (drawLayer) {
	//       drawLayer.style.display = "block";
	// 			drawLayer.width = pageContainer.offsetWidth;
	// 			drawLayer.height = pageContainer.offsetHeight;
	//       drawLayer.style.position ="absolute";
	// 			drawLayer.style.left = `calc(50% - 16px - ${drawLayer.width / 2}px)`;
	// 			drawLayer.style.top =  `${pageContainer.offsetTop}px`;
	// 		}
	// 	};

	// 	insertDrawLayer();
	// }, [pageNumber]);

	const finishSign = useCallback(async () => {
		const imageMap = getObjects();
		if (isEmpty(imageMap) || !Object.values(imageMap).some((images) => !isEmpty(images))) {
			toast.warn("No signs inserted!");
			setFinalPdf(null);
			return;
		}
		const arrayBuffer = await file.arrayBuffer();
		const pdfDoc = await PDFDocument.load(arrayBuffer, {});
		for (let i = 1; i < pdfDoc.getPageCount() + 1; i++) {
			const canvasId = `pdf-page-list/page-${i}-container/draw-layer`;
			const page = pdfDoc.getPage(i - 1);
			for (let image of imageMap[canvasId] || []) {
				// const imageBytes = base64ToUint8Array(image.src.split(",")[1]);
				const embededImage = await pdfDoc.embedPng(image.src);

				const dpiRatio = 72 / 96;
				const options = {
					x: (image.left - image.scaleY * image.height * Math.sin((image.angle * Math.PI) / 180)) * dpiRatio,
					y:
						(image.bottom - image.scaleY * image.height * Math.cos((image.angle * Math.PI) / 180)) *
						dpiRatio,
					width: image.scaleX * image.width * dpiRatio,
					height: image.scaleY * image.height * dpiRatio,
					rotate: degrees(-1 * image.angle),
				};
				// console.log(options);
				page.drawImage(embededImage, options);
			}
		}
		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);
		setFinalPdf(url);
		toast.success("Signed pdf ready to download :)");
	}, [file, getObjects]);

	return (
		<>
			<Stack
				className="blurred-background"
				direction={"row"}
				paddingBottom={4}
				alignItems={"center"}
				position={"sticky"}
				top={16}
				zIndex={2}
			>
				<Typography variant="h6" fontWeight={600}>
					Sign PDF
				</Typography>

				{file && (
					<>
						<Stack direction={"row"} ml={2} spacing={1}>
							<Button size="small" variant="contained" onClick={finishSign}>
								Finish
							</Button>
							{finalPdf && (
								<>
									<Button
										size="small"
										variant="outlined"
										onClick={() => window.open(finalPdf)}
										startIcon={<FileDownloadIcon fontSize="small" />}
									>
										Download
									</Button>
									<Button size="small" onClick={() => setFinalPdf()} color="error">
										<CloseIcon fontSize="small" />
									</Button>
								</>
							)}
						</Stack>
						<Stack direction={"row"} ml={"auto"} mr={3} spacing={1} alignItems={"center"}>
							<IconButton
								size="small"
								onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
								disabled={pageNumber < 2}
							>
								<KeyboardArrowLeftIcon fontSize="small" />
							</IconButton>
							<Typography>{pageNumber}</Typography>
							<IconButton
								size="small"
								onClick={() => setPageNumber((page) => Math.min(totalPage, page + 1))}
								disabled={pageNumber === totalPage}
							>
								<KeyboardArrowRightIcon fontSize="small" />
							</IconButton>
						</Stack>
						<Box>
							<SignButton
								onAddSign={async (url) => {
									await addElement(currentPageContainerId, "image", { src: url });
								}}
							/>
							<IconButton title="Remove" size="small" color="error" onClick={onRefresh} sx={{ ml: 0.5 }}>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Box>
					</>
				)}
			</Stack>

			{!file && (
				<Box paddingTop={4} paddingBottom={4}>
					<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
						<IconButton ref={triggerRef} sx={{ width: 100, height: 100 }}>
							<AddIcon sx={{ width: 80, height: 80 }} />
						</IconButton>
					</Box>
					<Typography textAlign={"center"} color={"grey"}>
						Choose PDF
					</Typography>
				</Box>
			)}

			<Box
				id={"pdf-viewer-1"}
				display={file ? "flex" : "none"}
				padding={"32px 16px"}
				justifyContent={"center"}
				position={"relative"}
				sx={{ backgroundColor: "whitesmoke", overflowX: "auto" }}
			>
				<ul id="pdf-page-list" style={{ padding: 0 }}></ul>
				{/* <canvas id="page-draw-layer" /> */}
			</Box>
			<Box paddingBottom={4}></Box>
		</>
	);
};

export default SignPdf;

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	// border: '2px solid #000',
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
};

const SignButton = ({ onAddSign }) => {
	const signPadRef = useRef();
	const buttonRef = useRef();
	const [addedSigns, setAddedSigns] = useState([]);
	const { handleOpen, handleClose, DropdownContainer } = useDropdown();
	const [openModal, setModal] = useState(false);
	const handleClick = useCallback(
		(event) => {
			if (isEmpty(addedSigns)) {
				setModal(true);
			} else {
				handleOpen(event);
			}
		},
		[addedSigns]
	);
	return (
		<>
			<IconButton ref={buttonRef} size="small" color="success" title="Sign" onClick={handleClick}>
				<DrawIcon fontSize="small" />
			</IconButton>
			<DropdownContainer sx={{ padding: "8px 0" }}>
				<Stack direction={"row"} justifyContent={"center"} sx={{ backgroundColor: "whitesmoke" }}>
					<img height={50} src={addedSigns[0]} style={{ padding: "16px" }} />
				</Stack>
				<Stack spacing={1} padding={"0 16px 16px 16px"} direction={"row-reverse"} marginTop={1}>
					<Button
						size="small"
						variant="contained"
						onClick={async (event) => {
							await onAddSign(addedSigns[0]);
							handleClose(event);
						}}
					>
						Insert
					</Button>
					<Button
						size="small"
						variant="outlined"
						onClick={() => {
							handleClose();
							setModal(true);
						}}
					>
						Re-Sign
					</Button>
				</Stack>
			</DropdownContainer>
			<Modal open={openModal} onClose={() => setModal(false)}>
				<Box sx={{ ...modalStyle, width: 400 }}>
					<Box sx={{ backgroundColor: "whitesmoke", position: "relative" }}>
						<SignaturePad
							ref={signPadRef}
							maxWidth={1.5}
							canvasProps={{
								style: { height: 200, width: "100%" },
							}}
						/>
						<Stack
							direction={"row-reverse"}
							borderTop={"1px solid lightgrey"}
							paddingTop={1}
							position={"absolute"}
							bottom={10}
							width={"calc(100% - 32px)"}
							left={16}
						>
							<Button size="small" onClick={() => signPadRef.current.clear()}>
								Clear
							</Button>
						</Stack>
					</Box>

					<Stack spacing={1} padding={"8px 0"} direction={"row-reverse"} marginTop={3}>
						<Button
							size="small"
							variant="contained"
							onClick={async (e) => {
								console.log("event fired");
								e.preventDefault();
								const sign = signPadRef.current.getTrimmedCanvas().toDataURL();
								setAddedSigns([sign]);
								setModal(false);
								await onAddSign(sign);
							}}
						>
							Create
						</Button>
						<Button size="small" variant="outlined" onClick={() => setModal(false)}>
							Cancel
						</Button>
					</Stack>
				</Box>
			</Modal>
		</>
	);
};
