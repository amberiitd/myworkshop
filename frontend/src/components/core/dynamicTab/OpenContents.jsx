import { Box, Divider, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import DndContainer from "../customDnd/OrderedDndContainer";
import ContentItemLabel from "./ContentItemLabel";

const OpenContents = ({
  allTabsMap,
  tabGroups,
  addNewContent,
  handleOpenItemClick,
  handleTabCancel,
  handleReposition,
}) => {
  return (
    <>
      <Box display={"flex"} paddingRight={1}>
        <Typography fontSize={"inherit"} fontWeight={600}>
          Open
        </Typography>
        {/* {addNewContent && (
          <Tooltip title="Add new comprision">
            <IconButton
              sx={{ width: 24, height: 24, padding: 0.5, ml: "auto" }}
              onClick={() => addNewContent("comparision")}
            >
              <BalanceIcon sx={{ width: 16, height: 16 }} />
            </IconButton>
          </Tooltip>
        )} */}
      </Box>

      {tabGroups.length == 1 && (
        <GroupedContents
          index={0}
          inView={tabGroups[0].inView}
          openContents={tabGroups[0].openContents}
          allTabsMap={allTabsMap}
          handleItemClick={(...args) => handleOpenItemClick(...args, 0)}
          handleTabClose={(...args) => handleTabCancel(...args, 0)}
          handleReposition={(...args) => handleReposition(...args, 0)}
        />
      )}
      {tabGroups.length > 1 &&
        tabGroups.map((tb, index) => (
          <GroupedContents
            key={`open-group-${index}`}
            showHeader
            index={index}
            inView={tb.inView}
            openContents={tb.openContents}
            allTabsMap={allTabsMap}
            handleItemClick={(...args) => handleOpenItemClick(...args, index)}
            handleTabClose={(...args) => handleTabCancel(...args, index)}
            handleReposition={(...args) => handleReposition(...args, index)}
          />
        ))}
    </>
  );
};

export default OpenContents;

const GroupedContents = ({
  index,
  showHeader,
  inView,
  openContents,
  allTabsMap,
  handleItemClick,
  handleTabClose,
  handleReposition,
}) => {
  const contents = useMemo(
    () => openContents.map((cId) => allTabsMap[cId]).filter((ct) => !isEmpty(ct)),
    [allTabsMap, openContents]
  );
  return (
    <Box
      paddingLeft={1}
      paddingTop={1}
      // overflow={'auto'}
    >
      {showHeader && (
        <Divider textAlign={"left"}>
          <Typography fontSize={"inherit"} fontWeight={600}>
            Group {index + 1}
          </Typography>
        </Divider>
      )}
      {contents.map(({ id, label, content }) => (
        <DndContainer key={id} itemId={id} orientation="vertical" handleDrop={handleReposition}>
          <ContentItemLabel
            tabId={id}
            selected={inView === id}
            style={{ padding: "0 5px" }}
            label={label}
            handleClick={handleItemClick}
            handleTabClose={handleTabClose}
          />
        </DndContainer>
      ))}
    </Box>
  );
};
