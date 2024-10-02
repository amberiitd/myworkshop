import { useCallback, useEffect, useState } from "react";
import { Canvas, FabricImage } from "fabric";
import { uniqueId } from "lodash";

const useFabricDraw = () => {
	const [canvasMap, setCanvasMap] = useState({});
	return {
		addElement: useCallback(
			async (containerId, type, options = {}) => {
				if (type !== "image") throw Error(`Draw for ${type} is not implemented!`);
				if (!containerId) throw Error(`Container id: ${containerId} is not valid!`);
				const canvasId = `${containerId}/draw-layer`;
				const { src } = options;

				const container = document.getElementById(containerId);
				let fbCanvas;
				if (!canvasMap[canvasId]) {
					const positionedDiv = document.createElement("div");
					positionedDiv.id = "draw-wrapper-positioned";
					positionedDiv.style.position = "absolute";
					positionedDiv.style.top = 0;
					positionedDiv.style.left = 0;
          positionedDiv.tabIndex = 0;
					// positionedDiv.style.pointerEvents ="none";

					const canvasElement = document.createElement("canvas");
					canvasElement.id = canvasId;
					canvasElement.width = container.offsetWidth;
					canvasElement.height = container.offsetHeight;
					canvasElement.style.position = "absolute";
					canvasElement.style.top = 0;
					canvasElement.style.left = 0;

					container.appendChild(positionedDiv);
					positionedDiv.appendChild(canvasElement);

					fbCanvas = new Canvas(canvasId, {
						width: container.offsetWidth,
						height: container.offsetHeight,
						// enablePointerEvents: false
					});
					setCanvasMap((cp) => ({ ...cp, [canvasId]: fbCanvas }));
					positionedDiv.addEventListener("keyup", (e) => {
						const activeObject = fbCanvas.getActiveObject();
            console.log("delete event");
						if (activeObject) {
							switch (e.key) {
								case "Backspace": // Handle delete key
									fbCanvas.remove(activeObject);
									break;
								default:
									break;
							}
						}
					});
				} else {
					fbCanvas = canvasMap[canvasId];
				}
				const image = await FabricImage.fromURL(src, {});
				// const fbc = new Canvas();
				// image.on("added", (event) => {
				// 	console.log("added", event);
				// });
				// image.on("removed", (event) => {
				// 	console.log("removed", event);
				// });
				// image.on("selected", (event) => {
				// 	console.log("selected", event);
				// });
				// image.on("modified", (event) => {
				// 	// console.log("modified", event);
				// 	// console.log({
				// 	// 	angle: event.target.angle,
				// 	// 	width: event.target.width,
				// 	// 	height: event.target.height,
				// 	//   scaleX: event.target.scaleX,
				// 	//   scaleY: event.target.scaleY,
				// 	// 	top: event.target.top,
				// 	// 	left: event.target.left,
				// 	// });
				// 	console.log(fbCanvas);
				// });

				fbCanvas.add(image);
			},
			[canvasMap]
		),
		destroy: () => {
			setCanvasMap({});
		},
		getObjects: useCallback(() => {
			const objectMap = {};
			for (let canvasId of Object.keys(canvasMap)) {
				objectMap[canvasId] = canvasMap[canvasId].getObjects().map((obj) => ({
					scaleX: obj.get("scaleX"),
					scaleY: obj.get("scaleY"),
					src: obj._element.src,
					angle: obj.get("angle"),
					width: obj.get("width"),
					height: obj.get("height"),
					top: obj.get("top"),
          bottom: canvasMap[canvasId].height -  obj.get("top"),
					left: obj.get("left"),
				}));
			}
			return objectMap;
		}, [canvasMap]),
	};
};

export default useFabricDraw;
