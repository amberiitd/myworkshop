import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { isEmpty, noop } from "lodash";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import useAddFiles from "../hooks/useAddFiles";
import useRenderPDF from "../hooks/useRenderPDF";
import { upload } from "../service/upload";
import PasswordModal from "./common/PasswordModal";

const LockPdf = () => {
	const [file, setFile] = useState();
	const canvasRef = useRef();
	const { render, renderPlaceHolder } = useRenderPDF(canvasRef);
	const [locked, setLocked] = useState();
	const [locking, setLocking] = useState(false);
	const [passwordModal, setPasswordModal] = useState({ open: false, onSubmit: noop, onCancel: noop });
	const [remotePath, setRemotePath] = useState();

	const { triggerRef } = useAddFiles(async (files) => {
		if (isEmpty(files)) return;
		setFile(files[0]);
		const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
		if (pdfDoc.isEncrypted) {
			toast.error("Pdf file is already encrypted!");
			renderPlaceHolder(<LockIcon style={{ fill: "grey" }} />, "PDF");
		} else {
			await render(files[0]);
		}
	}, ["application/pdf"]);

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
		if (!pdfDoc.isEncrypted) {
			// fetch password and decrypt
			try {
				setLocking(true);
				const passkey = await getPassword();
				let path;
				if (remotePath) path = remotePath;
				else {
					path = await upload(file, "from-lock");
					setRemotePath(path);
				}

				// invoke decryption
				const { targetUrl, errorMessage } = await fetch(process.env.REACT_APP_API_HOST + "/encrypt", {
					method: "POST",
					body: JSON.stringify({ sourcePath: path, password: passkey }),
				}).then(async (res) => {
					if (res.status === 200) return res.json();
					else throw Error(JSON.stringify(await res.json()));
				});

				renderPlaceHolder(<LockIcon style={{ fill: "grey" }} />, "PDF");
				setLocked(targetUrl);
			} catch (error) {
				console.error(error);
				toast.error("Locking failed!");
			} finally {
				setLocking(false);
			}
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
							setLocked(null);
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
							startIcon={locking ? <CircularProgress size={"16px"} /> : <LockIcon fontSize="small" />}
							disabled={locking}
						>
							Encrypt
						</Button>
					)}
					{locked && (
						<Button
							size="small"
							onClick={() => {
								window.open(locked);
							}}
							variant="contained"
							startIcon={<FileDownloadIcon fontSize="small" />}
						>
							Download
						</Button>
					)}
				</Stack>
				<PasswordModal {...passwordModal} submitButtonText="Encrypt" />
			</Box>
		</>
	);
};

export default LockPdf;
