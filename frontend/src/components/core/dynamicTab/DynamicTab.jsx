import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { useCallback, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import DragContextProvider from "../customDnd/DragContext";
import OpenContents from "./OpenContents";
import AllContents from "./AllContents";
import AllTabs from "./AllTabs";
import TabRibbon from "./TabRibbon";
import ViewContent from "./ViewContent";

export const DndItemType = {
  OPEN_TAB: "open-tab",
};

const DynamicTab = ({ addNewContent, allTabs, tabGroups, groupInView, onChange, contentTypes, syncStatus }) => {
  const allTabsMap = useMemo(
    () =>
      allTabs.reduce((p, c) => {
        p[c.id] = c;
        return p;
      }, {}),
    [allTabs]
  );

  const handleTabNameChange = useCallback(
    (tabId, newLabel) => {
      const tindex = allTabs.findIndex((tb) => tb.id === tabId);
      if (isEmpty(newLabel) || tindex < 0 || allTabs[tindex].label === newLabel) return;
      allTabs[tindex] = { ...allTabs[tindex], label: newLabel };
      onChange({
        allTabs: [...allTabs],
      });
    },
    [allTabs]
  );

  const handleOpenItemClick = useCallback(
    (e, itemId, groupIndex) => {
      if (tabGroups[groupIndex].inView === itemId && groupInView === groupIndex) return;
      tabGroups[groupIndex] = { ...tabGroups[groupIndex], inView: itemId };
      onChange({
        tabGroups: [...tabGroups],
        groupInView: groupIndex,
      });
    },
    [tabGroups]
  );

  const handleSourceItemClick = useCallback(
    (e, sourceItem) => {
      const tindex = allTabs.findIndex((c) => c.sourceId === sourceItem.id);
      if (tindex < 0) {
        const nextOpenCt = {
          label: sourceItem.label,
          id: uuidv4(),
          sourceId: sourceItem.id,
          type: sourceItem.type,
        };
        tabGroups[groupInView] = {
          ...tabGroups[groupInView],
          openContents: [...tabGroups[groupInView].openContents, nextOpenCt.id],
          inView: nextOpenCt.id,
        };
        onChange({ allTabs: [nextOpenCt, ...allTabs], tabGroups });
      } else {
        let gi = 0;
        let ti = -1;
        while (
          gi < tabGroups.length &&
          (ti = tabGroups[gi].openContents.findIndex((cid) => allTabsMap[cid]?.sourceId === sourceItem.id)) < 0
        )
          gi++;
        if (gi < tabGroups.length) {
          if (tabGroups[gi].inView !== allTabs[tindex].id) {
            tabGroups[gi] = {
              ...tabGroups[gi],
              inView: tabGroups[gi].openContents[ti],
            };
            onChange({ tabGroups: [...tabGroups] });
          }
        } else {
          tabGroups[groupInView] = {
            ...tabGroups[groupInView],
            openContents: [...tabGroups[groupInView].openContents, allTabs[tindex].id],
            inView: allTabs[tindex].id,
          };
          onChange({ tabGroups: [...tabGroups] });
        }
      }
    },
    [tabGroups, groupInView, allTabs, allTabsMap]
  );

  const handleTabCancel = useCallback(
    (e, itemId, groupIndex) => {
      e?.stopPropagation();
      let grpInView = groupInView;
      tabGroups[groupIndex] = {
        ...tabGroups[groupIndex],
        openContents: tabGroups[groupIndex].openContents.filter((ctId) => ctId !== itemId),
      };

      if (isEmpty(tabGroups[groupIndex].openContents) && tabGroups.length > 1) {
        tabGroups.splice(groupIndex, 1);
        if (groupInView === groupIndex) {
          grpInView = 0;
        } else if (groupInView > groupIndex) {
          grpInView = groupInView - 1;
        }
      } else if (isEmpty(tabGroups[groupIndex].openContents)) {
        tabGroups[groupIndex].inView = null;
      } else if (!isEmpty(tabGroups[groupIndex].openContents)) {
        if (itemId === tabGroups[groupIndex].inView) {
          tabGroups[groupIndex].inView = tabGroups[groupIndex].openContents[0];
        }
      }
      onChange({
        tabGroups: [...tabGroups],
        groupInView: grpInView,
      });
    },
    [tabGroups, groupInView]
  );

  const handleReposition = useCallback(
    (anchorItemId, insertItemId, offsetPosition, groupIndex) => {
      if (anchorItemId === insertItemId) return;

      const openContents = tabGroups[groupIndex].openContents;
      const displacedItemIndex = openContents.findIndex((itemId) => itemId === insertItemId);

      let insertContentId = null;
      if (displacedItemIndex >= 0) [insertContentId] = openContents.splice(displacedItemIndex, 1);
      else {
        const tindex = allTabs.findIndex((tb) => tb.id === insertItemId);
        insertContentId = allTabs[tindex].id;
      }
      const anchorItemIndex = openContents.findIndex((itemId) => itemId === anchorItemId);
      openContents.splice(anchorItemIndex + (offsetPosition === "right" ? 1 : 0), 0, insertContentId);

      tabGroups[groupIndex].openContents = [...openContents];
      onChange({ tabGroups: [...tabGroups] });
    },
    [tabGroups, allTabs]
  );

  const handleOpenInNewTabGroup = useCallback(
    (tabId, groupIndex) => {
      let nextOpenCt = allTabs.find((tb) => tb.id === tabId);

      if (!nextOpenCt || tabGroups[groupIndex].openContents.length < 2) return;
      tabGroups[groupIndex].openContents = tabGroups[groupIndex].openContents.filter((ctId) => ctId !== tabId);
      tabGroups[groupIndex].inView = tabGroups[groupIndex].openContents[0];
      const newTabGroup = {
        openContents: [nextOpenCt.id],
        inView: nextOpenCt.id,
      };

      onChange({
        tabGroups: [...tabGroups, newTabGroup],
        groupInView: tabGroups.length,
      });
    },
    [tabGroups, groupInView, allTabs]
  );

  const handleDeleteTab = useCallback(
    (tabId) => {
      for (let gi = 0; gi < tabGroups.length; gi++) {
        for (let cid of tabGroups[gi].openContents) {
          if (cid === tabId) handleTabCancel(null, tabId, gi);
        }
      }
      onChange({
        allTabs: allTabs.filter((tb) => tb.id !== tabId),
      });
    },
    [allTabs, tabGroups, handleTabCancel]
  );

  const handleSavedTabClick = useCallback(
    (e, tabItem) => {
      // find if tab itself is open
      let gi = 0;
      while (gi < tabGroups.length && tabGroups[gi].openContents.findIndex((cid) => cid === tabItem.id) < 0) gi++;
      const tabOpen = gi < tabGroups.length;

      if (!tabOpen) {
        // if the source is not open in the current group, open the tab in the current group
        tabGroups[groupInView] = {
          ...tabGroups[groupInView],
          openContents: [...tabGroups[groupInView].openContents, tabItem.id],
          inView: tabItem.id,
        };
        onChange({ tabGroups: [...tabGroups] });
      } else if (tabOpen && (groupInView !== gi || tabGroups[gi].inView !== tabItem.id)) {
        tabGroups[gi] = {
          ...tabGroups[gi],
          inView: tabItem.id,
        };
        onChange({ tabGroups: [...tabGroups], groupInView: gi });
      }
    },
    [tabGroups, groupInView, allTabs, allTabsMap]
  );

  const handleAddTab = useCallback(
    (groupIndex) => {
      let nextOpenCt = null;
      nextOpenCt = {
        label: `New Tab`,
        id: uuidv4(),
        type: "chart_module",
      };
      tabGroups[groupIndex] = {
        ...tabGroups[groupIndex],
        openContents: [...tabGroups[groupInView].openContents, nextOpenCt.id],
        inView: nextOpenCt.id,
      };
      onChange({ allTabs: [nextOpenCt, ...allTabs], tabGroups, groupInView: groupIndex });
    },
    [tabGroups, groupInView, allTabs]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <DragContextProvider>
        <Grid container height={"calc(100%)"}>
          <Grid item xs={3} md={2} borderRight={1} borderColor={"divider"} fontSize={"12px"} height={"100%"}>
            <Stack direction={"column"} height={"100%"}>
              <OpenContents
                addNewContent={addNewContent}
                tabGroups={tabGroups}
                handleOpenItemClick={handleOpenItemClick}
                handleTabCancel={handleTabCancel}
                handleReposition={handleReposition}
                allTabsMap={allTabsMap}
              />
              <Divider sx={{ mt: 1 }} />
              {/* <AllContents allTabsMap={allTabsMap} allContents={sources} handleItemClick={handleSourceItemClick} /> */}
              <AllTabs
                inView={tabGroups[groupInView].inView}
                allTabsMap={allTabsMap}
                allTabs={allTabs}
                handleDeleteTab={handleDeleteTab}
                handleItemClick={handleSavedTabClick}
                handleTabNameChange={handleTabNameChange}
              />
              <Box mt={"auto"} display={"flex"} alignItems={"center"}>
                <FiberManualRecordIcon
                  color={syncStatus === "in-sync" ? "success" : "warning"}
                  sx={{ ml: 1, fontSize: 14 }}
                />
                <Typography fontSize={14}>{syncStatus === "in-sync" ? "Saved" : "Saving..."}</Typography>
              </Box>
            </Stack>
          </Grid>
          {/* <Divider orientation="vertical" /> */}
          <Grid item xs={9} md={10} height={"100%"}>
            <Grid container height={"100%"}>
              {tabGroups.map((tb, index) => (
                <Grid
                  item
                  key={`tab-group-${index}`}
                  height={"100%"}
                  xs={12 / tabGroups.length}
                  borderLeft={1}
                  sx={{ backgroundColor: index === groupInView ? "white" : "whitesmoke" }}
                >
                  <TabRibbon
                    inView={tb.inView}
                    tabs={tb.openContents}
                    allTabsMap={allTabsMap}
                    handleTabClick={(...args) => handleOpenItemClick(...args, index)}
                    handleTabClose={(...args) => handleTabCancel(...args, index)}
                    handleReposition={(...args) => handleReposition(...args, index)}
                    onAddTab={() => handleAddTab(index)}
                    handleOpenInNewTabGroup={(tabId) => handleOpenInNewTabGroup(tabId, index)}
                  />
                  <ViewContent
                    contents={tb.openContents}
                    allTabsMap={allTabsMap}
                    inView={tb.inView}
                    contentTypes={contentTypes}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DragContextProvider>
    </DndProvider>
  );
};

export default DynamicTab;
