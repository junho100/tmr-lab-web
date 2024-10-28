import React from "react";
import { useNavigate } from "react-router-dom";
import ExperimentForm from "./components/ExperimentForm";

const ExperimentApp = () => {
  const navigate = useNavigate();

  const handleLogin = (uniqueId) => {
    console.log(`User logged in with ID: ${uniqueId}`);
    navigate(`/${uniqueId}/menu`);
  };

  return <ExperimentForm onLogin={handleLogin} />;
};

export default ExperimentApp;
