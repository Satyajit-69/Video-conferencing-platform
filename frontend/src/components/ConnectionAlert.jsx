import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function ConnectionAlert({ status }) {

  const getAlertConfig = () => {
    switch (status) {
      case "connected":
        return { severity: "success", message: "Connected to meeting!" };
      case "connecting":
        return { severity: "info", message: "Connecting..." };
      case "disconnected":
        return { severity: "error", message: "Disconnected!" };
      case "reconnecting":
        return { severity: "warning", message: "Reconnecting..." };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  return (
    <Stack
      sx={{
        width: "300px",
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      <Alert severity={config.severity}>{config.message}</Alert>
    </Stack>
  );
}

export default ConnectionAlert;
