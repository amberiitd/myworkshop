import { Box, Modal } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "calc(50% - 50px)",
  left: "calc(50% - 50px)",
  transform: "translate(-50%, -50%)",
  width: 100,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  borderRadius: 2,
  boxShadow: 24,
  padding: "0 20px"
};

const ShadowLoader = ({ loading }) => {
  return (
    <Modal open={loading}>
      <Box {...modalStyle}>
        {/* <svg
          className="blink-view"
          width="100%"
          height="100%"
          viewBox="0 0 34 34"
        >
          <g transform="matrix(0.775121,0,0,0.775121,0,5.37318)">
            <path
              d="M0.236,30L27.095,13.292L41.029,13.292C41.136,13.292 41.242,13.313 41.341,13.354C41.439,13.395 41.529,13.455 41.605,13.531C41.68,13.607 41.74,13.697 41.781,13.796C41.822,13.894 41.842,14 41.842,14.107C41.853,14.246 41.823,14.385 41.755,14.507C41.688,14.629 41.586,14.727 41.462,14.791L28.27,22.701C27.413,23.214 27.112,24.244 27.112,25.015L27.099,30L43.864,30L43.864,1.031C43.865,0.892 43.837,0.754 43.782,0.627C43.728,0.499 43.649,0.383 43.548,0.287C43.448,0.191 43.33,0.116 43.2,0.066C43.07,0.017 42.931,-0.005 42.792,0.001L26.795,0.001L0,16.637L0,30L0.236,30Z"
              style={{ fillRule: "nonzero" }}
            />
          </g>
        </svg> */}
        <img src="/assets/icons/sp_logo.png" className="blink-view" width={"100%"} />
        {/* <img src="/assets/icons/autodesk-icon-black.png" className="blink-view" width={"100%"} /> */}
      </Box>
    </Modal>
  );
};

export default ShadowLoader;
