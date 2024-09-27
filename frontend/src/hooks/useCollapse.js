import { Collapse } from "@mui/material";
import { useCallback, useRef, useState } from "react";

const useCollapse = (props = { expanded: true }) => {
  const { expanded, onToggle } = props;
  const buttonRef = useRef();
  const [expand, setExpand] = useState(expanded);
  const handleClick = useCallback(() => {
    setExpand((ex) => !ex);
    if (onToggle) onToggle(!expand);
  }, [expand, onToggle]);

  return {
    CollapseContainer: useCallback(({ children }) => <Collapse in={expand}>{children}</Collapse>, [expand]),
    toggleRef: useCallback(
      (node) => {
        if (node) {
          buttonRef.current = node;
          buttonRef.current.onclick = handleClick;
        }
      },
      [expand]
    ),
    expanded: expand,
  };
};

export default useCollapse;
