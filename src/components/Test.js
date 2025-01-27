import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockWords } from "./Words";

const Test = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(7);

  // 스페이스바 이벤트 핸들러는 동일
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        if (stage === "instruction") {
          setStage("cross");
          setTimeout(() => {
            setStage("question");
          }, 500);
        } else if (isCompleted) {
          navigate(`/${userId}/menu`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [stage, isCompleted, navigate, userId]);

  // 단어 진행 및 타이밍 제어 수정
  useEffect(() => {
    let timer;
    let countdownTimer;

    if (stage === "question") {
      // 오디오 재생
      const audio = new Audio(mockWords[currentWordIndex].audioUrl);
      audio.play();

      setCountdown(7);

      // 카운트다운 타이머
      countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // 7초 후 다음 단어로
      timer = setTimeout(() => {
        if (currentWordIndex < mockWords.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
          setStage("cross");

          // 0.5초 후 다음 문제
          setTimeout(() => {
            setStage("question");
          }, 500);
        } else {
          setStage("completed");
          setIsCompleted(true);
        }
      }, 7000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [stage, currentWordIndex]);

  const progress = ((currentWordIndex + 1) / mockWords.length) * 100;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "20px",
      }}
    >
      {/* Status Bar - 기존과 동일 */}
      {stage !== "instruction" && stage !== "completed" && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              backgroundColor: "#e0e0e0",
              height: "20px",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: "#4CAF50",
                height: "100%",
                borderRadius: "10px",
                transition: "width 0.5s",
              }}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            {currentWordIndex + 1} / {mockWords.length}
          </p>
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* instruction, cross, question, completed 스테이지는 동일하게 유지 */}
        {stage === "instruction" && (
          <p style={{ fontSize: "60px", textAlign: "center" }}>
            지금부터 테스트 시행을 시작합니다.
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

        {stage === "question" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ fontSize: "100px" }}>?</div>
            <div style={{ fontSize: "40px" }}>남은시간 : {countdown}초</div>
          </div>
        )}

        {stage === "completed" && (
          <p style={{ fontSize: "60px", textAlign: "center" }}>
            실험이 완료되었습니다.
            <br />
            스페이스바를 눌러 메뉴로 돌아가세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default Test;
