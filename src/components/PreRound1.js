import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PreRound1 = () => {
  const { userId } = useParams();
  const [stage, setStage] = useState("instruction");
  const [timeLeft, setTimeLeft] = useState(5);
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" && stage === "instruction") {
        setStage("cross");
        setTimeout(() => {
          setStage("word");
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [stage, navigate, userId]);

  useEffect(() => {
    let timer;
    let countdownTimer;

    if (stage === "word") {
      setTimeLeft(5);

      // 오디오 재생
      const audio = new Audio(
        "https://papago.naver.com/apis/tts/c_lt_clara_2.2.30.0.3.32_164-nvoice_clara_2.2.30.0.3.32_91a33ac6b0a7c4f551f8d6edb2db5039-1727670602445.mp3"
      );
      audio.play();

      countdownTimer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      timer = setTimeout(() => {
        navigate(`/${userId}/menu`);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [stage, userId, navigate]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    navigate(`/${userId}/menu`);
  };

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
      {stage === "word" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "100px", marginBottom: "20px" }}>사과</p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              fontSize: "24px",
              padding: "10px",
              width: "300px",
              textAlign: "center",
              marginBottom: "20px",
            }}
            autoFocus
          />
          <p style={{ fontSize: "24px" }}>남은시간: {timeLeft}초</p>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              fontSize: "20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default PreRound1;
