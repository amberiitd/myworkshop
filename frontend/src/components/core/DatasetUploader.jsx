import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addFile } from "../../app/features/allFiles";
import useS3Upload from "../../hooks/useS3Upload";
import { uploadDataset } from "../../services/apiCrud";
import CTAIconButton1 from "./CTAIconButton1";

const DatasetUploader = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();

  const { uploading, upload, onCancel } = useS3Upload({
    onSuccess: async (file) => {
      const successFile = await uploadDataset({ ...file, id: uuidv4() });
      dispatch(addFile(successFile));
    },
  });

  return (
    <>
      <CTAIconButton1
        title={uploading ? "Cancel upload" : "Add dataset"}
        loading={uploading}
        animateBorderOnLoading
        onClick={() => {
          if (uploading) onCancel();
          else if (inputRef.current) inputRef.current.click();
        }}
        icon={<AddIcon className={uploading ? "rotate-45" : ""} fontSize="small" />}
        buttonStyle={{ padding: 0 }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="text/csv"
        style={{ display: "none" }}
        onChange={async (e) => {
          const fileData = e.target.files[0];
          if (fileData) {
            const path = `dataset/${moment().unix()}_${fileData.name}`;
            await upload(path, fileData);
            inputRef.current.value = "";
          }
        }}
      />
    </>
  );
};

export default DatasetUploader;
