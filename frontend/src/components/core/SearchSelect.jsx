import { Box, CircularProgress, MenuItem, TextField } from "@mui/material";
import Chip from "@mui/material/Chip";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePaperMenu } from "../../hooks/usePaperMenu";
import EmptyState from "./EmptyState";

export default function SearchSelect({
  onChange = () => {},
  defaultValue = [],
  onSearch = () => {},
  options = [],
  loading = false,
  rootStyle = {},
  renderOption = (opt) => opt.value,
}) {
  const inputRef = useRef();
  const [selected, setSelected] = useState(defaultValue);
  const [focusedOptionIndex, setFocusOptionIndex] = useState(-1);
  const [inputText, setInputText] = useState("");
  const { open, toggleOpen, DropdownContainer, toggleClose, toggle } = usePaperMenu();

  const onSelect = useCallback(
    (event, user) => {
      toggleClose();
      inputRef.current.focus();
      const newSelected = [...selected, user];
      setSelected(newSelected);
      onChange(newSelected);
      setInputText("");
      setFocusOptionIndex(0);
      onSearch("");
    },
    [selected]
  );

  const removeSelection = useCallback((e, user) => {
    inputRef.current.focus();
    const newSelected = selected.filter((u) => u.value !== user.value);
    setSelected(newSelected);
    onChange(newSelected);
    onSearch("");
  }, [selected]);

  const handleKeyEvents = useCallback(
    (e) => {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (open && focusedOptionIndex >= 0 && options.length > 0) onSelect(e, options[focusedOptionIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (open)
          setFocusOptionIndex((idx) => (idx < 0 ? idx : Math.min((idx + 1) % options.length, options.length - 1)));
        else toggleOpen(e);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (open)
          setFocusOptionIndex((idx) => (idx < 0 ? idx : Math.max((idx - 1 + options.length) % options.length, 0)));
        else toggleOpen(e);
      } else if (e.key === "Backspace") {
        if (isEmpty(inputText)) removeSelection(e, selected[selected.length - 1]);
      }
    },
    [options, focusedOptionIndex, open, toggleOpen, inputText, selected]
  );

  useEffect(() => {
    setTimeout(() => inputRef.current.focus(), 0);
  }, []);

  useEffect(() => {
    if (options.length) setFocusOptionIndex(0);
    else setFocusOptionIndex(-1);
  }, [options]);

  return (
    <>
      <TextField
        autoFocus={true}
        inputRef={inputRef}
        fullWidth
        label="Emails"
        variant="outlined"
        value={inputText}
        placeholder={isEmpty(selected) ? "Add people by email" : undefined}
        inputProps={{ style: { padding: "7px 0", width: "unset" } }}
        InputProps={{
          startAdornment: (
            <>
              {selected.map((op) => (
                <Chip
                  key={op.value}
                  label={op.label}
                  onDelete={(e) => removeSelection(e, op)}
                  sx={{ margin: "4px 8px 4px 0" }}
                />
              ))}
            </>
          ),
          sx: {
            flexWrap: "wrap",
            padding: 2,
            alignItems: "start",
            ...rootStyle,
          },
        }}
        onClick={(e) => {
          toggle(e);
        }}
        onChange={(e) => {
          toggleOpen();
          setInputText(e.target.value);
          onSearch(e.target.value);
        }}
        onKeyDown={handleKeyEvents}
      />
      <DropdownContainer>
        {!loading &&
          options.map((user, index) => (
            <MenuItem
              key={`${user.value}`}
              onClick={(e) => {
                onSelect(e, user);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") onSelect(e, user);
              }}
              selected={index === focusedOptionIndex}
            >
              {renderOption(user)}
            </MenuItem>
          ))}
        {!loading && isEmpty(options) && <EmptyState message={"No users found"} size="small" />}
        {loading && (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{}} />
          </MenuItem>
        )}
      </DropdownContainer>
    </>
  );
}
