import { Box, Typography } from "@mui/material";
import ContentItemLabel from "./ContentItemLabel";

const AllTabs = ({ inView, allTabs, allTabsMap, handleItemClick, handleDeleteTab, handleTabNameChange }) => {
  return (
    <Box maxHeight={"55%"} overflow={"auto"}>
      <Typography className="text-cut" fontSize={"inherit"} fontWeight={600}>
        All Tabs
      </Typography>

      <Box sx={{ pl: 1, pt: 1 }}>
        {allTabs.map((item) => (
          <ContentItemLabel
            tabId={item.id}
            key={`all-content-item-${item.id}`}
            style={{ padding: "0 5px" }}
            selected={inView === item.id}
            label={item.label}
            handleClick={(e) => handleItemClick(e, item)}
            handleDeleteTab={handleDeleteTab}
            handleTabNameChange={handleTabNameChange}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AllTabs;
