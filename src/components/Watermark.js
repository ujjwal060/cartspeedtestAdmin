import { Box } from "@mui/material";

const Watermark = () => {
  return (
    <Box
      component="img"
      src="/logo.jpg"
      alt="Watermark"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 200,
        opacity: 0.1,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
};

export default Watermark;
