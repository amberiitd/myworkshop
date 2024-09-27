import { Box, Card, CardContent, Divider, Tooltip, Typography } from "@mui/material";
import { forwardRef, useMemo } from "react";
import KeyValue from "../KeyValue";
import ContentItemLabel from "./ContentItemLabel";

const AllContents = ({ inView, allContents, handleItemClick }) => {
  const groupedSources = useMemo(
    () =>
      Object.entries(
        allContents?.reduce((p, c) => {
          if (p[c.nodeName]) {
            p[c.nodeName].push(c);
          } else p[c.nodeName] = [c];
          return p;
        }, {})
      ),
    [allContents]
  );
  return (
    <Box maxHeight={"55%"} overflow={"auto"}>
      <Typography className="text-cut" fontSize={"inherit"} fontWeight={600}>
        Sources
      </Typography>

      {/* <Box sx={{ pl: 1, pt: 1 }}>
        {allContents.map((item) => (
          <TabLabel
            tabId={item.id}
            key={`all-content-item-${item.id}`}
            style={{ padding: "0 5px" }}
            selected={inView === item.id}
            label={item.label}
            handleClick={(e) => handleItemClick(e, item)}
          />
        ))}
      </Box> */}

      {groupedSources.length == 1 && (
        <GroupedSources
          nodeName={groupedSources[0][0]}
          handleItemClick={handleItemClick}
          sources={groupedSources[0][1]}
        />
      )}
      {groupedSources.length > 1 &&
        groupedSources.map((sg, index) => (
          <GroupedSources
            key={`source-group-${index}`}
            nodeName={sg[0]}
            sources={sg[1]}
            showHeader
            handleItemClick={handleItemClick}
          />
        ))}
    </Box>
  );
};

export default AllContents;

const GroupedSources = ({ nodeName, showHeader, sources, handleItemClick }) => {
  return (
    <Box paddingLeft={1} paddingTop={1}>
      {showHeader && (
        <Divider textAlign={"left"} sx={{ "& .MuiDivider-wrapper": { maxWidth: "50%" } }}>
          <Typography className="text-cut" fontSize={"inherit"} fontWeight={600}>
            {nodeName || "Unknown"}
          </Typography>
        </Divider>
      )}
      {sources.map((item, index) => (
        <Tooltip
          key={`source-item-${nodeName}-${index}`}
          title={
            <DetailsCard
              nodeName={item.nodeName}
              predictorType={item.predictorType}
              preset={item.preset}
              label={item.label}
            />
          }
          enterDelay={1500}
          placement="right"
          arrow
        >
          <TabLabelWrapper
            tabId={item.id}
            style={{ padding: "0 5px" }}
            label={item.label}
            handleClick={(e) => handleItemClick(e, item)}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

const TabLabelWrapper = forwardRef(({ tabId, handleClick, label, style, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      <ContentItemLabel tabId={tabId} handleClick={handleClick} label={label} style={style} {...props} />
    </div>
  );
});

const DetailsCard = ({ ...props }) => {
  return (
    <Card>
      <CardContent>
        <KeyValue data={props} singleColumn />
      </CardContent>
    </Card>
  );
};
