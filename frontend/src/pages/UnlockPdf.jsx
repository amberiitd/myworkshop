import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { isEmpty, noop } from "lodash";
import { PDFDocument } from "pdf-lib";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import useAddFiles from "../hooks/useAddFiles";
import useRender from "../hooks/useRender";
import { upload } from "../service/upload";
import FileCardWrapper from "./common/FileCardWrapper";
import PasswordModal from "./common/PasswordModal";

const UnlockPdf = () => {
	const [file, setFile] = useState();
	const canvasRef = useRef();
	const { render, renderPlaceHolder } = useRender(canvasRef);
	const [unlocked, setUnlocked] = useState();
	const [unlocking, setUnlocking] = useState(false);
	const [passwordModal, setPasswordModal] = useState({ open: false, onSubmit: noop, onCancel: noop });
	const [remotePath, setRemotePath] = useState();

	const { triggerRef } = useAddFiles(
		(files) => {
			if (isEmpty(files)) return;
			setFile(files[0]);
			renderPlaceHolder(<LockIcon style={{ fill: "grey" }} />, "PDF");
		},
		["application/pdf"]
	);

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

	const unlock = useCallback(
		async (file) => {
			const arrayBuffer = await file.arrayBuffer();
			const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
			if (pdfDoc.isEncrypted) {
				// fetch password and decrypt
				try {
					setUnlocking(true);
					const passkey = await getPassword();
					let path;
					if (remotePath) path = remotePath;
					else {
						path = await upload(file, "from-unlock");
						setRemotePath(path);
					}

					// invoke decryption
					const { targetUrl, errorMessage } = await fetch(process.env.REACT_APP_API_HOST + "/decrypt", {
						method: "POST",
						body: JSON.stringify({ sourcePath: path, password: passkey }),
					}).then(async (res) => {
						if (res.status === 200) return res.json();
						else throw Error(JSON.stringify(await res.json()));
					});

					await render(targetUrl);
					setUnlocked(targetUrl);
				} catch (error) {
					console.error(error);
					toast.error("Unlocking failed!");
				} finally {
					setUnlocking(false);
				}
			} else {
				await render(file);
				toast.info("Selected file is not password protected.");
			}
		},
		[remotePath]
	);

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
					{/* <canvas
						ref={canvasRef}
						style={{
							boxShadow:
								"0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
						}}
					/> */}
					<FileCardWrapper name={file?.name}>
						<canvas
							ref={canvasRef}
							style={{
								boxShadow:
									"0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
							}}
						/>
					</FileCardWrapper>
				</Stack>

				<Stack direction={"row"} padding={2} justifyContent={"center"} spacing={1}>
					<Button
						size="small"
						onClick={() => {
							setFile(null);
							setUnlocked(null);
							setRemotePath(null);
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
							startIcon={
								unlocking ? <CircularProgress size={"16px"} /> : <LockOpenIcon fontSize="small" />
							}
							disabled={unlocking}
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
				<PasswordModal {...passwordModal} submitButtonText="Decrypt" />
			</Box>
		</>
	);
};

export default UnlockPdf;
