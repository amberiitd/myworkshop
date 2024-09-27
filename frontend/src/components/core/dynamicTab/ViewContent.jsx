import { Box } from "@mui/material";
import { isEmpty } from "lodash";
import { useCallback, useMemo } from "react";
import EmptyState from "../EmptyState";
import ErrorBoundary from "../error/ErrorBoundary";
import ErrorFallback from "../error/ErrorFallback1";

const ViewContent = ({ contents, allTabsMap, inView, contentTypes }) => {
  const mappedContents = useMemo(
    () => contents.map((cId) => allTabsMap[cId]).filter((ct) => !isEmpty(ct)),
    [allTabsMap, contents]
  );

  const ContentContainer = useCallback(
    ({ contentId, type, label, sourceId }) => {
      const Content = contentTypes[type];
      return (
        <Box
          display={inView === contentId ? "block" : "none"}
          padding={2}
          width={"calc(100% - 35px)"}
          overflow={"auto"}
          height={"calc(100% - 60px)"}
        >
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Content contentId={contentId} label={label} sourceId={sourceId} />
          </ErrorBoundary>
        </Box>
      );
    },
    [contentTypes, inView]
  );
  return (
    <>
      {mappedContents.map(({ id, type, label, sourceId }) => (
        <ContentContainer key={`content-${id}`} type={type} contentId={id} label={label} sourceId={sourceId} />
      ))}
      {isEmpty(contents) && (
        <Box height={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
          <EmptyState message={"No content to show."} />
        </Box>
      )}
    </>
  );
};

export default ViewContent;