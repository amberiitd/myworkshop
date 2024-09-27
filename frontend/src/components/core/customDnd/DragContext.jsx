import { createContext, useContext } from "react";
import { useDragLayer } from "react-dnd";

const DragContext = createContext();
export const useDragContext = () => useContext(DragContext);

const DragContextProvider = ({ children }) => {
  const { dragType, isDragActive } = useDragLayer((monitor) => ({
    dragType: monitor.getItemType(),
    isDragActive: monitor.isDragging(),
  }));

  return <DragContext.Provider value={{ dragType, isDragActive }}>{children}</DragContext.Provider>;
};

export default DragContextProvider;