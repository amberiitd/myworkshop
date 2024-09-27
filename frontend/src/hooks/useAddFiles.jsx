import { isEmpty } from "lodash";
import { useRef } from "react";

const useAddFiles = (onChange, fileTypes) => {
	const inputRef = useRef();
	const buttonRef = useRef();

	return {
		triggerRef: (node) => {
			if (node) {
				buttonRef.current = node;
				buttonRef.current.onclick = () => inputRef.current.click();

				const fileInput = document.createElement("input");
				buttonRef.current.appendChild(fileInput);
				// Set attributes for the input element
				fileInput.type = "file";
				fileInput.accept = fileTypes.join(",");
				fileInput.style.display = "none";
				fileInput.addEventListener("change", async (e) => {
					if (!isEmpty(e.target.files)) {
						onChange(Array.from(e.target.files));
						inputRef.current.value = "";
					}
				});
				inputRef.current = fileInput;
			}
		},
	};
};

export default useAddFiles;
