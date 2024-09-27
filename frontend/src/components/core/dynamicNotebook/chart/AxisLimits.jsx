import {
  Box,
  FormControl,
  InputLabel,
  Slider
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { useDynamicNotebookContext } from "../dynmamicNotebookContext";

const AxisLimits = ({ contentId, entityId, axisLimits, disableAxisLimits }) => {
  const { onUpdateEntity } = useDynamicNotebookContext();

  const minDistance = useMemo(() => {
    return 10;
  }, [axisLimits]);

  const handleChange = useCallback(
    (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) {
        return;
      }

      if (newValue[1] - newValue[0] < minDistance) {
        if (activeThumb === 0) {
          const clamped = Math.min(newValue[0], 100 - minDistance);
          axisLimits = { ...axisLimits, min: clamped, max: clamped + minDistance };
        } else {
          const clamped = Math.max(newValue[1], minDistance);
          axisLimits = { ...axisLimits, min: clamped - minDistance, max: clamped };
        }
      } else {
        axisLimits = { ...axisLimits, min: newValue[0], max: newValue[1] };
      }
        onUpdateEntity({
          contentId,
          entityId,
          data: { axisLimits },
        })
    },
    [minDistance, axisLimits]
  );
  return (
    <FormControl
      // className="custom-form-element"
      sx={{
        border: 1,
        height: "35.125px",
        borderRadius: "4px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        "& .MuiFormControl-root:hover": { borderBlockColor: "black" },
        cursor: "pointer",
      }}
    >
      <InputLabel sx={{ fontSize: "14px", backgroundColor: "white", padding: "0 5px", zIndex: 0 }} shrink>
        XAxis Limits
      </InputLabel>
      <Box display={"flex"} flexWrap={"nowrap"} height={"100%"} alignItems={"center"} padding={"0 10px 0 15px"}>
        <Slider
          value={[axisLimits.min, axisLimits.max]}
          disabled={disableAxisLimits}
          disableSwap
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={axisLimits.low}
          max={axisLimits.high}
          sx={{ width: 200 }}
          size="small"
        />
      </Box>
    </FormControl>
  );
};

export default AxisLimits;