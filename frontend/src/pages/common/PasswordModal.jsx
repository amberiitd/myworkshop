import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, CircularProgress, IconButton, InputAdornment, Modal, Stack, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	// border: '2px solid #000',
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
};

const PasswordModal = ({ open, onSubmit, onCancel, submitButtonText = "Continue" }) => {
	const [showPassword, setShowPassword] = useState(false);
	const onClose = useCallback(() => {
		setShowPassword(false);
		onCancel();
	}, [onCancel]);

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={{ ...modalStyle, width: 400 }}>
				{/* <Typography variant="h6" fontWeight={600}>
					Create new model
				</Typography> */}
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.target);
						onSubmit(formData.get("password"));
					}}
				>
					<TextField
						type={showPassword ? "text" : "password"}
						size="small"
						label="Password"
						// variant="outlined"
						name="password"
						fullWidth
						required
						InputProps={{
							endAdornment: (
								<InputAdornment position="end" sx={{ width: 35 }}>
									<IconButton size="small" onClick={() => setShowPassword((sp) => !sp)}>
										{showPassword ? (
											<VisibilityOffIcon fontSize="small" />
										) : (
											<VisibilityIcon fontSize="small" />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Stack spacing={1} padding={"8px 0"} direction={"row-reverse"} marginTop={3}>
						<Button
							size="small"
							variant="contained"
							startIcon={<LockIcon fontSize="small" />}
							type="submit"
						>
							{submitButtonText}
						</Button>
						<Button size="small" variant="outlined" onClick={onClose}>
							Cancel
						</Button>
					</Stack>
				</Box>
			</Box>
		</Modal>
	);
};

export default PasswordModal;
