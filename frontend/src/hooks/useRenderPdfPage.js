import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const useRenderPage = () => {
	const [totalPage, setTotalPage] = useState(0);
	const [pdfDocument, setPdfDocument] = useState();
	const eventBus = useMemo(() => new pdfjsViewer.EventBus(), []);
  const [currentPageContainerId, setCurrentPageContainerId] = useState();

	return {
		initalize: useCallback(
			async (file) => {
				if (!pdfDocument) {
					let loadingTask;
					pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
					if (file instanceof File) {
						const fileData = await file.arrayBuffer();
						loadingTask = pdfjsLib.getDocument({ data: fileData });
					} else {
						loadingTask = pdfjsLib.getDocument(file);
					}
					let doc = await loadingTask.promise;
					setPdfDocument(doc);
					setTotalPage(doc.numPages);
				}
			},
			[pdfDocument]
		),
		render: useCallback(
			async (containerId, options = { pageNumber: 1 }) => {
				const { pageNumber } = options;
				if (!pdfDocument) return;
				try {
					const container = document.getElementById(containerId),
						pageContainerId = `${containerId}/page-${pageNumber}-container`;
          
          setCurrentPageContainerId(pageContainerId)
					let exists;
					for (let pageContainer of container.children) {
						if (pageContainer.id === pageContainerId) {
							pageContainer.style.display = "block";
							exists = true;
						} else {
							pageContainer.style.display = "none";
						}
					}
					if (exists) return;
					const pageContainer = document.createElement("li");
					pageContainer.id = pageContainerId;
					pageContainer.className = "pdfViewer singlePageView";
          pageContainer.style.position = "relative";
					container.appendChild(pageContainer);

					// start render
					console.log("rendering page: ", pageNumber);
					const SCALE = 1.0;
					const pdfPage = await pdfDocument.getPage(pageNumber);
					const newPdfPageView = new pdfjsViewer.PDFPageView({
						container: pageContainer,
						id: pageNumber,
						scale: SCALE,
						defaultViewport: pdfPage.getViewport({ scale: SCALE }),
						eventBus,
					});

					// Document loaded, retrieving the page.
					newPdfPageView.setPdfPage(pdfPage);
					newPdfPageView.draw();
				} catch (error) {
					console.error(error);
					toast.error("Error rendering page!");
				}
			},
			[pdfDocument]
		),
		destroy: useCallback((containerId) => {
			const container = document.getElementById(containerId);
			container.innerHTML = '';
      setPdfDocument(null);
      setTotalPage(0);
		}, []),
		totalPage,
    currentPageContainerId,
	};
};

export default useRenderPage;
