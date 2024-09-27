import * as pdfjs from "pdfjs-dist";
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { wait } from "../util";

const useRenderPDF = (canvasRef) => {
	const renderTaskRef = useRef();

	const renderPlaceHolder = async (icon, message, height = 170) => {
		const tempDiv = document.createElement("div");
		tempDiv.style.display = "none";
		document.body.appendChild(tempDiv);

		const root = createRoot(tempDiv);
		root.render(icon);
		await wait(1);

		const svgElement = tempDiv.querySelector("svg");

		const canvas = canvasRef.current;
		canvas.height = height;
		canvas.width = (height * 2.2) / 3;
		const ctx = canvas.getContext("2d");

		// Convert SVG node to a data URL
		const svgData = new XMLSerializer().serializeToString(svgElement);
		const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(svgBlob);

		const image = new Image();
		image.onload = () => {
			try {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				const iconWidth = 50;
				const iconHeight = 50;
				const iconX = (canvas.width - iconWidth) / 2;
				const iconY = (canvas.height - iconHeight) / 2 - 20;
				ctx.drawImage(image, iconX, iconY, iconWidth, iconHeight);

				// Draw the text below the icon
				ctx.font = "20px ArtifaktElement-Regular";
				ctx.fillStyle = "grey";
				ctx.textAlign = "center";
				const textX = canvas.width / 2;
				const textY = iconY + iconHeight + 30;
				ctx.fillText(message, textX, textY);

				URL.revokeObjectURL(url);
			} catch {
				root.unmount();
				tempDiv.remove();
			}
		};

		image.src = url;
	};

	const renderView = async (file, option = { rotation: 0, maxWidth: 168, maxHeight: 170, scale: 0.2 }) => {
		try {
			const { rotation, maxWidth, maxHeight, scale } = option;
			pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
			const fileData = await file.arrayBuffer();
			const pdfDoc = await pdfjs.getDocument({ data: fileData }).promise;
			const firstPage = await pdfDoc.getPage(1);
			const viewport = firstPage.getViewport({ scale, rotation });
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");

      if (viewport.width < viewport.height) {
				canvas.height = Math.min(maxHeight, viewport.height);
				canvas.width = (canvas.height * viewport.width) / viewport.height;
			} else {
				canvas.width = Math.min(maxWidth, viewport.width);
				canvas.height = (canvas.width * viewport.height) / viewport.width;
			}

			// Ensure no other render tasks are running.
			if (renderTaskRef.current) {
				await renderTaskRef.current.promise;
			}

      context.clearRect(0, 0, canvas.width, canvas.height);
			renderTaskRef.current = firstPage.render({
				canvasContext: context,
				viewport,
			});
			await renderTaskRef.current.promise;
		} catch (error) {
			if (error.name === "RenderingCancelledException") {
				console.log("Rendering cancelled.");
			} else {
				console.error("Render error:", error);
				renderPlaceHolder(
					<ErrorOutlineIcon style={{ fill: "grey" }} />,
					"Error loading!",
					option.maxHeight
				);
			}
		}
	};

	return {
		render: renderView,
		renderPlaceHolder,
	};
};

export default useRenderPDF;
