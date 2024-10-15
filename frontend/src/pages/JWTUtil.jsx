import { Box, Card, CardHeader, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import ReactJson from "react-json-view";

const JWTUtil = () => {
	const [token, setToken] = useState("");
	const [header, setHeader] = useState({});
	const [payload, setPayload] = useState({});
	const [error, setError] = useState();
	const encode = useCallback((header = header, payload = payload) => {}, [header, payload]);

	const decode = useCallback(
		debounce((token) => {
			try {
				const parts = token.split(".");
				if (parts.length !== 3) throw Error("Invalid token!");
				const decoded = parts.slice(0, 2).map((part) => JSON.parse(atob(part)));
				setHeader(decoded[0]);
				setPayload(decoded[1]);
				setError(null);
			} catch (error) {
				setError(error);
				setHeader({});
				setPayload({});
				console.error(error);
			}
		}, 100),
		[]
	);

	return (
		<>
			<Typography variant="h6" fontWeight={600} paddingBottom={4}>
				JWT Util
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Typography textAlign={"center"} padding={1}>Encoded</Typography>
					<Box
						height={568}
						border={1}
						borderRadius={2}
						borderColor={Boolean(error) ? "red" : "lightgrey"}
						padding={2}
					>
						<textarea
							value={token}
							placeholder="Paste your token here..."
							style={{
								fontFamily: "monospace",
								height: "100%",
								width: "100%",
								outline: "none",
								resize: "none",
								border: 0,
							}}
							// on
							onChange={(e) => {
								setToken(e.target.value);
								decode(e.target.value);
							}}
						></textarea>
					</Box>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography textAlign={"center"} padding={1}>Decoded</Typography>
					<Box height={600} border={1} borderRadius={2} borderColor={"lightgrey"}>
						<Box height={"50%"}>
							<Stack padding={1} px={2} borderBottom={1} b borderColor={"lightgray"}>
								<Typography fontSize={14}>Header</Typography>
							</Stack>
							<ReactJson
								style={{ padding: 16, height: "calc(100% - 32px - 38px)", overflow: "auto" }}
								src={header}
								// onEdit={(data) => {}}
								// onDelete={(data) => {}}
                // onAdd={(data) => {}}
							/>
						</Box>
						<Box height={"50%"}>
							<Stack padding={1} px={2} borderBottom={1} borderTop={1} borderColor={"lightgray"}>
								<Typography fontSize={14}>Payload</Typography>
							</Stack>
							<ReactJson
								style={{ padding: 16, height: "calc(100% - 32px - 38px)", overflow: "auto" }}
								src={payload}
							/>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default JWTUtil;
