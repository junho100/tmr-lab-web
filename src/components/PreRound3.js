import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PreRound3 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");

  // ... existing code ...

  // 스페이스바 이벤트 핸들러
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        if (stage === "instruction") {
          setStage("cross");
          setTimeout(() => {
            setStage("question");
          }, 500);
        } else if (stage === "question") {
          navigate(`/${userId}/menu`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [stage, navigate, userId]);

  // 오디오 재생을 위한 useEffect
  useEffect(() => {
    if (stage === "question") {
      const audio = new Audio(
        "https://papago.naver.com/apis/tts/c_lt_clara_2.2.30.0.3.32_164-nvoice_clara_2.2.30.0.3.32_91a33ac6b0a7c4f551f8d6edb2db5039-1727670602445.mp3"
      );
      audio.play();
    }
  }, [stage]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {stage === "instruction" && (
        <p style={{ fontSize: "60px", textAlign: "center" }}>
          지금부터 연습 시행을 시작합니다.
          <br />
          스페이스바를 눌러주세요.
        </p>
      )}

      {stage === "cross" && (
        <div
          style={{
            fontSize: "100px",
            width: "100px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100px",
              height: "25px",
              backgroundColor: "black",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "25px",
              height: "100px",
              backgroundColor: "black",
            }}
          />
        </div>
      )}

      {stage === "question" && <div style={{ fontSize: "100px" }}>?</div>}
    </div>
  );
};

export default PreRound3;