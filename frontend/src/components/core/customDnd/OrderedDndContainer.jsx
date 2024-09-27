import { Box } from "@mui/material";
import { useDrag, useDrop } from "react-dnd";
import { DndItemType } from "../dynamicTab/DynamicTab";
import { useDragContext } from "./DragContext";

const indicatorWidth = "3px";
const DndContainer = ({ children, itemId, handleDrop, orientation = "horizontal" }) => {
  const type = DndItemType.OPEN_TAB;
  const [_, drag] = useDrag(() => ({
    type,
    item: { itemId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      didDrop: !!monitor.didDrop(),
    }),
  }));

  const { dragType, isDragActive } = useDragContext();

  const [{ isOverDropLeft }, dropLeft] = useDrop(
    () => ({
      accept: type,
      drop: ({ itemId: droppedItemId }, monitor) => {
        handleDrop(itemId, droppedItemId, "left");
      },
      collect: (monitor) => ({
        isOverDropLeft: !!monitor.isOver(),
      }),
    }),
    [handleDrop]
  );

  const [{ isOverDropRight }, dropRight] = useDrop(
    () => ({
      accept: type,
      drop: ({ itemId: droppedItemId }, monitor) => {
        handleDrop(itemId, droppedItemId, "right");
      },
      collect: (monitor) => ({
        isOverDropRight: !!monitor.isOver(),
      }),
    }),
    [handleDrop]
  );

  return (
    <Box ref={drag} position="relative">
      <div
        ref={dropLeft}
        style={{
          left: 0,
          top: 0,
          width: orientation === "horizontal" ? "50%" : "100%",
          height: orientation === "horizontal" ? "100%" : "50%",
          position: "absolute",
          zIndex: isDragActive ? 10 : -1,
        }}
      >
        <div
          style={{
            width: orientation === "horizontal" ? indicatorWidth : "100%",
            height: orientation === "horizontal" ? "100%" : indicatorWidth,
            backgroundColor: isOverDropLeft && dragType === type ? "red" : "transparent",
            position: "absolute",
            transform: `translate(${orientation === "horizontal" ? "-50%" : 0}, ${
              orientation === "horizontal" ? 0 : "-50%"
            })`,
          }}
        ></div>
      </div>

      <div
        ref={dropRight}
        style={{
          display: "flex",
          flexDirection: orientation === "horizontal" ? "row" : "column",
          justifyContent: "end",
          right: 0,
          bottom: 0,
          width: orientation === "horizontal" ? "50%" : "100%",
          height: orientation === "horizontal" ? "100%" : "50%",
          position: "absolute",
          zIndex: isDragActive ? 10 : -1,
        }}
      >
        <div
          style={{
            width: orientation === "horizontal" ? indicatorWidth : "100%",
            height: orientation === "horizontal" ? "100%" : indicatorWidth,
            backgroundColor: isOverDropRight && dragType === type ? "red" : "transparent",
            position: "absolute",
            transform: `translate(${orientation === "horizontal" ? "50%" : 0}, ${
              orientation === "horizontal" ? 0 : "50%"
            })`,
          }}
        ></div>
      </div>
      {children}
    </Box>
  );
};

export default DndContainer;
