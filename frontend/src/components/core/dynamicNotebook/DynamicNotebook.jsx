import AddIcon from "@mui/icons-material/Add";
import { Button, Grid } from "@mui/material";
import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ParameterSelector from "../../visualization/ParameterSelector";
import { useVisualContext } from "../../visualization/visualContext";
import EmptyState from "../EmptyState";
import NotebookXYChart from "./chart/NotebookXYChart";
import { useDynamicNotebookContext } from "./dynmamicNotebookContext";

const DynamicNotebook = ({ contentId, sourceId }) => {
  const { noteEntities, onAddEntity, onUpdateContent, contentState, params } = useDynamicNotebookContext();
  const { execDataMap, execParameters } = useVisualContext();
  const listRef = useRef(null);
  const [lastEntityCount, setLastEntityCount] = useState(noteEntities.length);

  useEffect(() => {
    if (!params) {
      const paramList = execParameters?.map((pd) => pd.params);
      const params = paramList && paramList[0];
      if (params) onUpdateContent({ contentId, data: { params } });
    }
  }, [params, contentId]);

  useEffect(() => {
    if (listRef.current && listRef.current.lastElementChild && noteEntities.length > lastEntityCount) {
      listRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" });
    }
    setLastEntityCount(noteEntities.length);
  }, [noteEntities]);

  return (
    <Grid container spacing={2} ref={listRef}>
      <Grid item xs={12} display={"flex"}>
        <ParameterSelector value={params} onChange={(e, params) => onUpdateContent({ contentId, data: { params } })} />

        <Button
          size="small"
          variant="contained"
          onClick={() =>
            onAddEntity({
              contentId,
              data: {
                id: uuidv4(),
                type: "xy-chart",
                label: "Unnamed Chart",
                axisLimits: { min: 0, max: 100, low: 0, high: 100 },
              },
            })
          }
          sx={{ ml: "auto" }}
        >
          Chart <AddIcon fontSize="small" />
        </Button>
      </Grid>
      {noteEntities.map((ent) => (
        <Grid key={`entity-${ent.id}`} item xs={12}>
          {ent.type === "xy-chart" ? <NotebookXYChart contentId={contentId} {...ent} /> : <>Not Implemented</>}
        </Grid>
      ))}

      {isEmpty(noteEntities) && (
        <Grid item xs={12}>
          <EmptyState message={"Please add an item."} />
        </Grid>
      )}
    </Grid>
  );
};

export default DynamicNotebook;
