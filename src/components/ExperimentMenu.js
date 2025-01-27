import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExperimentMenu = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const options = [
    { name: "Pre-Round1", path: "pre-round1" },
    { name: "Round1", path: "round1" },
    { name: "Pre-Round2", path: "pre-round2" },
    { name: "Round2", path: "round2" },
    { name: "Pre-Round3", path: "pre-round3" },
    { name: "Round3", path: "round3" },
    { name: "Pre-Test", path: "pre-test" },
    { name: "Test", path: "test" },
    { name: "Breathing Monitor", path: "breathing-monitor" },
  ];

  const handleSelectOption = (path) => {
    navigate(`/${userId}/${path}`);
  };

  const menuStyle = {
    maxWidth: "28rem",
    margin: "2.5rem auto",
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    marginBottom: "0.75rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: "1rem",
  };

  return (
    <div style={menuStyle}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        실험 단계 선택
      </h2>
      {options.map((option) => (
        <button
          key={option.name}
          onClick={() => handleSelectOption(option.path)}
          style={buttonStyle}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default ExperimentMenu;
