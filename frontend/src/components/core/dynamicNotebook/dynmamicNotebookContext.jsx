import { createContext, useContext } from "react";

const DynamicNotebookContextAPI = createContext();
export const useDynamicNotebookContext = () => useContext(DynamicNotebookContextAPI);

const DynamicNotebookContext = ({ children, value }) => {
  return <DynamicNotebookContextAPI.Provider value={value || {}}>{children}</DynamicNotebookContextAPI.Provider>;
};

export default DynamicNotebookContext;

