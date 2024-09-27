import { Button, ButtonGroup } from "@mui/material";
import { useMemo } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useActionDropMenu } from "../../hooks/useActionDropMenu";
import { isEmpty } from "lodash";

const ButtonSelect = ({ onDisplay = 0, value, onChange = () => {}, options = [], sx = {}, buttonStyle={} }) => {
  const { DropMenuContainer, toggleRef, anchorEl, open } = useActionDropMenu();
  const menuItems = useMemo(
    () =>
      options.slice(onDisplay, options.length).map((op) => ({
        ...op,
        action: async (e) => {
          onChange(e, op.value);
        },
        selected: value === op.value,
      })),
    [options, value]
  );
  const dropLabel = useMemo(() => menuItems.find((item) => item.value === value)?.label, [value, menuItems]);
  return (
    <>
      <ButtonGroup size="small" fullWidth sx={{ fontSize: "80%", ...sx }}>
        {options.slice(0, onDisplay).map((item) => (
          <Button
            className="text-cut"
            key={`button-group-item-${item.value}`}
            variant={value === item.value ? "contained" : "outlined"}
            sx={{ fontSize: "inherit", padding: "5px", ...buttonStyle }}
            onClick={(e) => onChange(e, item.value)}
          >
            {item.label}
          </Button>
        ))}
        {!isEmpty(menuItems) && (
          <Button
            // className="text-cut"
            ref={toggleRef}
            variant={dropLabel ? "contained" : "outlined"}
            sx={{ fontSize: "inherit", padding: "5px", width: "unset" }}
            endIcon={<ArrowDropDownIcon />}
          >
            {dropLabel || menuItems[0].label}
          </Button>
        )}
      </ButtonGroup>
      <DropMenuContainer anchorEl={anchorEl} open={true} menuItems={menuItems} />
    </>
  );
};

export default ButtonSelect;
