const MainLayout = ({ children, padding = "64px 16px 32px 16px" }) => (
	<main style={{ padding, overflow: "auto", height: "calc(100% - 96px)" }}>
		{/* top decorator */}
		<div
			className="top-decorator"
			style={{ backgroundColor: "whitesmoke", position: "sticky", top: 0, zIndex: 10 }}
		>
			<div
				style={{
					// border: "1px solid black",
					borderRadius: "16px 0 0 0",
					height: 16,
					backgroundColor: "white",
				}}
			></div>
		</div>

		<div
			className="main-container"
			style={{
				padding: "0px 32px 0 32px",
				backgroundColor: "white",
				borderRadius: "0 0 0 16px",
				minHeight: "calc(100% - 18px)",
			}}
		>
			{children}
		</div>
	</main>
);

export default MainLayout;
