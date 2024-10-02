import { Box, Button, IconButton, Typography } from "@mui/material";
import * as pdfjs from "pdfjs-dist";
import AddIcon from "@mui/icons-material/Add";
import { isEmpty } from "lodash";
import useAddFiles from "../hooks/useAddFiles";
import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

const Experiment = () => {
	const canvasRef = useRef();
	const [file, setFile] = useState();
	const { triggerRef } = useAddFiles((files) => {
		if (isEmpty(files)) return;
		setFile(files[0]);
	});

	const process = useCallback(async () => {
		const arrayBuffer = await file.arrayBuffer();
		const pdfDoc = await pdfjs.getDocument({
			data: arrayBuffer,
			password: "DPJPA6624B",
		}).promise;

		const page = await pdfDoc.getPage(1);
		const viewPort = page.getViewport({ scale: 1 });
		const data = await pdfDoc.getData();
		const blob = new Blob([data], { type: "application/pdf" });

		window.open(URL.createObjectURL(blob));
    PDFDocument.load(arrayBuffer, {})

		// const canvas = canvasRef.current;
		// canvas.height = viewPort.height;
		// canvas.width = viewPort.width;

		// const ctx = canvas.getContext("2d");
		// ctx.clearRect(0, 0, canvas.width, canvas.height);

		// const ops = await page.getOperatorList();
		// // console.log(pdfjs.OPS);
		// const opsIndexed = Object.entries(pdfjs.OPS).sort((a, b) => a[1] - b[1]);
		// // try {
		// // 	const index = 6;
		// // 	console.log(ops.fnArray[index], ops.argsArray[index], opsIndexed[ops.fnArray[index] - 1][0]);
		// // 	ctx[opsIndexed[ops.fnArray[index] - 1][0]](ops.argsArray[index]);
		// // } catch (error) {
		// // 	console.error(error);
		// // }

		// // console.log(Object.entries(ops.argsArray).filter((args) => !isEmpty(args[1])));

		// console.log("done");
		// console.log(ops.argsArray[0]);
	}, [file]);

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
	}, []);
	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				Experiment
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
			{file && (
				<Box>
					{file.name}{" "}
					<Button variant="contained" size="small" onClick={process}>
						Process
					</Button>
				</Box>
			)}
			<canvas
				ref={canvasRef}
				style={{
					boxShadow:
						"0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
				}}
			/>
		</>
	);
};

export default Experiment;
