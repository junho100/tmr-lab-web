import React from "react";
import { AlertCircle } from "lucide-react";

export const Alert = ({ children, style }) => (
  <div style={{ padding: "1rem", borderRadius: "0.375rem", ...style }}>
    {children}
  </div>
);

export const AlertTitle = ({ children }) => (
  <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{children}</h3>
);

export const AlertDescription = ({ children }) => <p>{children}</p>;

export const AlertIcon = () => (
  <AlertCircle style={{ width: "1rem", height: "1rem" }} />
);
