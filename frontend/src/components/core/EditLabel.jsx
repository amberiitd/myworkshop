import { isEmpty, trim } from "lodash";
import { useCallback } from "react";

const EditLabel = ({ defaultValue, onSave, disabled, fontSize }) => {
  const handleSave = useCallback(
    (e) => {
      if (disabled) return;
      const newval = trim(e.target.innerText);
      if (isEmpty(newval)) {
        e.target.innerText = defaultValue;
      } else if (onSave && newval !== defaultValue) onSave(newval);
      e.target.blur();
    },
    [defaultValue, onSave, disabled]
  );

  return (
    <div
      suppressContentEditableWarning
      className={"nodrag text-cut editable-div"}
      contentEditable={!disabled}
      onBlur={handleSave}
      onKeyUp={(e) => {
        if (e.key === "Enter") handleSave(e);
      }}
      style={{
        display: "flex",
        cursor: "auto",
        margin: "0 5px",
        fontSize,
        fontFamily: "ArtifaktElement-Regular",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      {defaultValue}
    </div>
  );
};

export default EditLabel;
