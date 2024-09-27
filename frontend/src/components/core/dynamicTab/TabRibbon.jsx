import { Box, Divider, IconButton, Tabs, Tooltip } from "@mui/material";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import DndContainer from "../customDnd/OrderedDndContainer";
import TabLabel from "./TabLabel";
import AddIcon from "@mui/icons-material/Add";

const TabRibbon = ({
  inView,
  tabs,
  allTabsMap,
  handleTabClick,
  handleTabClose,
  handleReposition,
  onAddTab,
  handleOpenInNewTabGroup
}) => {
  const contents = useMemo(() => tabs.map((cId) => allTabsMap[cId]).filter((ct) => !isEmpty(ct)), [allTabsMap, tabs]);
  const tabIndex = useMemo(() => {
    return contents.findIndex((tb) => tb.id === inView);
  }, [inView, contents]);
  // if (isEmpty(tabs)) return null;
  return (
    <Box
      display={"flex"}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        fontSize: "12px",
        paddingRight: 1,
        // backgroundColor: "white",
        paddingTop: 0.5,
      }}
    >
      <Tabs value={tabIndex} sx={{ minHeight: "unset", width: "100%", alignItems: "center" }} variant="scrollable">
        {contents.map(({ label, id }, index) => (
          <Box display={"flex"} key={`tab-${id}`} >
            <DndContainer itemId={id} handleDrop={handleReposition} orientation="horizontal">
              {/* <Box sx={{ display: "flex", borderColor: "whitesmoke" }}> */}
              <TabLabel
                tabId={id}
                label={label}
                handleClick={handleTabClick}
                handleTabClose={handleTabClose}
                handleOpenInNewTabGroup={handleOpenInNewTabGroup}
                style={{
                  backgroundColor: index === tabIndex ? "lightgrey" : "white",
                  borderRadius:
                    index === tabIndex
                      ? "5px 5px 0 0"
                      : index === tabIndex - 1
                      ? "0 0 5px 0 "
                      : index === tabIndex + 1
                      ? "0 0 0 5px"
                      : 0,
                }}
              />
              {/* </Box> */}
            </DndContainer>
            <Divider
              orientation="vertical"
              sx={{
                height: "14px",
                mt: "5px",
                borderColor: index === tabIndex || index === tabIndex - 1 ? "transparent" : "lightgrey",
                backgroundColor: "transparent",
              }}
            />
          </Box>
        ))}
        <IconButton
          title="New tab"
          size="small"
          sx={{ width: 24, height: 24, padding: 0.5, fontSize: 16, marginLeft: "2px" }}
          onClick={onAddTab}
        >
          <AddIcon fontSize={"inherit"} />
        </IconButton>
      </Tabs>
      {/* <Box ml={"auto"}>
        <Tooltip title="Split screen">
          <IconButton onClick={handleAddTabGroup} sx={{ width: 24, height: 24, padding: 0.5 }}>
            <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="black">
              <path d="M760-760H599h5-4 160Zm-240 0q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v400h-80v-400H600v640q-33 0-56.5-23.5T520-200v-560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm160-640H200v560h160v-560Zm0 0H200h160ZM760-40v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
            </svg>
          </IconButton>
        </Tooltip>
      </Box> */}
    </Box>
  );
};

export default TabRibbon;
