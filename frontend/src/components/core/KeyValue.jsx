import { Grid, Typography } from "@mui/material"
import { startCase } from "lodash";

const KeyValue = ({data, singleColumn, ...props}) => {
  return <Grid container {...props}>
    {Object.entries(data).map((e, index) => <Grid item key={`grid-key-value-item-${index}`} xs={singleColumn ? 12: 6}>
      <Typography fontSize={'small'}><span style={{fontWeight: 600}}>{startCase(e[0])}: </span> {e[1]}</Typography>
    </Grid>)}
  </Grid>
}

export default KeyValue;