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
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";
import * as pdfjs from "pdfjs-dist";

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

const UnlockPdf = () => {
	const [file, setFile] = useState();
	const canvasRef = useRef();
	const { render, renderPlaceHolder } = useRenderPDF(canvasRef);
	const [unlocked, setUnlocked] = useState();
	const [unlocking, setUnlocking] = useState(false);
	const [passwordModal, setPasswordModal] = useState({ open: false, onSubmit: noop, onCancel: noop });

	const { triggerRef } = useAddFiles((files) => {
		if (isEmpty(files)) return;
		setFile(files[0]);
		renderPlaceHolder(<LockIcon style={{ fill: "grey" }} />, "PDF", 250);
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

	const unlock = async (file) => {
		const arrayBuffer = await file.arrayBuffer();
		const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
		console.log(pdfDoc);
		if (pdfDoc.isEncrypted) {
			// fetch password and decrypt
			try {
				pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";

				const passkey = await getPassword();
				console.log(passkey);
				const decryptedDoc = await PDFDocument.create();
				const readablePdfDoc = await pdfjs.getDocument({ data: arrayBuffer, password: passkey }).promise;

				const blob = new Blob([await readablePdfDoc.saveDocument()], { type: "application/pdf" });
        // decryptedDoc.
				// const totalPages = readablePdfDoc.numPages;
				// console.log(totalPages);
				// for (let i = 1; i < totalPages + 1; i++) {
				// 	const page = await readablePdfDoc.getPage(i); // Get the current page
				// 	const viewport = page.getViewport({ scale: 1 });
				// 	const newPage = decryptedDoc.addPage([viewport.width, viewport.height]);
				// 	const ctx = newPage.getContext("2d");
				//   newPage.
				//   await page.render({
				//     canvasContext: ctx,
				//     viewport,
				//   }).promise;
				// }

				// const descryptedBytes = await decryptedDoc.save();
				// const blob = new Blob([descryptedBytes], { type: "application/pdf" });
				setUnlocked(blob);
				render(blob, { maxHeight: 250, maxWidth: 250, scale: 0.3 });
				console.log(passkey);
			} catch (error) {
				console.error(error);
				console.error("Unlocking failed!");
			}
		} else {
			await render(file, { maxHeight: 250, maxWidth: 250, scale: 0.3 });
			toast.info("Selected file is not password protected.");
		}
	};

	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				Unlock PDF
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
					{!unlocked && (
						<Button
							size="small"
							onClick={() => unlock(file)}
							variant="contained"
							startIcon={<LockOpenIcon fontSize="small" />}
							disabled={false}
						>
							Unlock
						</Button>
					)}
					{unlocked && (
						<Button
							size="small"
							onClick={() => {
								window.open(unlocked);
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

export default UnlockPdf;

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
							startIcon={<LockOpenIcon fontSize="small" />}
							type="submit"
						>
							Unlock
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
