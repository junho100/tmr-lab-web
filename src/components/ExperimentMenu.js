import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExperimentMenu = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const options = [
    { name: "학습 Round1 사전연습", path: "pre-round1" },
    { name: "학습 Round1", path: "round1" },
    { name: "학습 Round2 사전연습", path: "pre-round2" },
    { name: "학습 Round2", path: "round2" },
    { name: "수면 전 테스트 연습", path: "pre-round3" },
    { name: "수면 전 테스트", path: "pre-test" },
    { name: "수면 후 테스트", path: "test" },
    { name: "실험", path: "breathing-monitor" },
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
