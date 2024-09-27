import { Box, Button, IconButton, Modal, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useAddFiles from "../hooks/useAddFiles";
import { useCallback, useEffect, useRef, useState } from "react";
import { isEmpty, noop } from "lodash";
import useRenderPDF from "../hooks/useRenderPDF";
import CloseIcon from "@mui/icons-material/Close";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LockIcon from "@mui/icons-material/Lock";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toast } from "react-toastify";

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

const LockPdf = () => {
	const [file, setFile] = useState();
	const canvasRef = useRef();
	const { render, renderPlaceHolder } = useRenderPDF(canvasRef);
	const [locked, setLocked] = useState();
	const [locking, setLocking] = useState(false);
	const [passwordModal, setPasswordModal] = useState({ open: false, onSubmit: noop, onCancel: noop });

	const { triggerRef } = useAddFiles(async (files) => {
		if (isEmpty(files)) return;
		setFile(files[0]);
		const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
		if (pdfDoc.isEncrypted) {
			toast.error("Pdf file is already encrypted!");
			renderPlaceHolder(<LockIcon style={{ fill: "grey" }} />, "PDF", 250);
		} else {
			await render(files[0], { maxHeight: 250, maxWidth: 250, scale: 0.3 });
		}
	});

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			// Clears the entire canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

	const getPassword = () =>
		new Promise((resolve, reject) => {
			setPasswordModal({
				open: true,
				onSubmit: resolve,
				onCancel: reject,
			});
		}).finally(() => setPasswordModal({ open: false, onSubmit: noop, onCancel: noop }));

	const lock = async (file) => {
		const pdfDoc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
		console.log(pdfDoc);
		if (!pdfDoc.isEncrypted) {
			// fetch password and encrypt
			// try {
			// 	const PDFDocument = require("pdfkit");
			// 	const blobStream = require("blob-stream");
			// 	const passkey = await getPassword();
			// 	console.log(passkey);
			// 	// const lockedDoc = await PDFDocument.create();
			// 	// const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
			// 	// // const copiedPages = lockedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
			// 	// // copiedPages
			// 	const doc = new PDFKit({
			// 		userPassword: passkey, // The password required to open the document
			// 		ownerPassword: "default-passkey", // Optional: another password to control permissions
			// 		permissions: {
			// 			printing: "highResolution", // Allow high-resolution printing
			// 			modifying: false, // Disable modifications
			// 			copying: false, // Disable copying of content
			// 			annotating: true, // Allow annotations
			// 		},
			// 	});
			// 	const outStream = doc.pipe(blobStream());

			// 	const readableStream = new File().stream();
			// 	await readableStream.pipeTo(doc);
			// 	doc.end();
			// 	outStream.on("finish", function () {
			// 		// get a blob you can do whatever you like with
			// 		const blob = outStream.toBlob("application/pdf");
			// 		setLocked(blob);
			// 	});
			// } catch (error) {
			// 	console.error("Encryption failed!", error);
			// }
      
		} else {
			toast.info("Selected file is already encrypted.");
		}
	};

	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				Lock PDF
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
						}}
						color="error"
						startIcon={<CloseIcon fontSize="small" />}
					>
						Remove
					</Button>
					{!locked && (
						<Button
							size="small"
							onClick={() => lock(file)}
							variant="contained"
							startIcon={<LockIcon fontSize="small" />}
							disabled={false}
						>
							Encrypt
						</Button>
					)}
					{locked && (
						<Button
							size="small"
							onClick={() => {
								const url = URL.createObjectURL(locked);
								window.open(url);
								URL.revokeObjectURL(url);
							}}
							variant="contained"
							startIcon={<FileDownloadIcon fontSize="small" />}
						>
							Download
						</Button>
					)}
				</Stack>
				<PasswordModal {...passwordModal} />
			</Box>
		</>
	);
};

export default LockPdf;

const PasswordModal = ({ open, onSubmit, onCancel }) => {
	return (
		<Modal open={open} onClose={onCancel}>
			<Box sx={{ ...modalStyle, width: 400 }}>
				{/* <Typography variant="h6" fontWeight={600}>
					Create new model
				</Typography> */}
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.target);
						onSubmit(formData.get("password"));
					}}
				>
					<TextField
						type="password"
						size="small"
						label="Password"
						variant="outlined"
						name="password"
						fullWidth
						required
					/>
					<Stack spacing={1} padding={"8px 0"} direction={"row-reverse"} marginTop={3}>
						<Button
							size="small"
							variant="contained"
							startIcon={<LockIcon fontSize="small" />}
							type="submit"
						>
							Encrypt
						</Button>
						<Button size="small" variant="outlined" onClick={onCancel}>
							Cancel
						</Button>
					</Stack>
				</Box>
			</Box>
		</Modal>
	);
};
