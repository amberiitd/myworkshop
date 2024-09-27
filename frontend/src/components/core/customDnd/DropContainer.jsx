import { Box } from "@mui/material";
import { DndItemType } from "../dynamicTab/DynamicTab";
import { useEffect, useMemo } from "react";
import { useDragContext } from "./DragContext";
import { useDrop } from "react-dnd";

const DropContainer = ({ itemId, children, handleDrop, accept, style }) => {
  const { dragType, isDragActive } = useDragContext();

  const [{ isOverDrop }, drop] = useDrop(
    () => ({
      accept,
      drop: ({ itemId: droppedItemId }, monitor) => {
        handleDrop(itemId, droppedItemId);
      },
      collect: (monitor) => ({
        isOverDrop: !!monitor.isOver(),
      }),
    }),
    [handleDrop]
  );

  const [borderStyle, opacity] = useMemo(() => {
    const borderStyle =
      dragType === accept && isDragActive
        ? isOverDrop
          ? "2px dashed black"
          : "2px dashed lightgrey"
        : "2px solid transparent";
    const opacity = dragType === accept && isDragActive ? 0.7 : 1;
    return [borderStyle, opacity];
  }, [dragType, isDragActive, isOverDrop]);

  return (
    <Box ref={drop} border={borderStyle} borderRadius={3} style={style} sx={{ opacity }}>
      {children}
    </Box>
  );
};

export default DropContainer;
