import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockWords } from "./Words";

const Round2 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);
  const [userInput, setUserInput] = useState("");
  const audioRef = useRef(new Audio());
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // 오디오 재생 함수
  const playAudio = () => {
    try {
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
      audio.src = mockWords[currentWordIndex].audioUrl;
      audio.load();
      audio.play().catch((error) => {
        console.error("오디오 재생 실패:", error);
      });
    } catch (error) {
      console.error("오디오 재생 중 오류:", error);
    }
  };

  // 타이머 정리 함수
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 다음 단어로 이동
  const moveToNextWord = () => {
    if (currentWordIndex < mockWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setStage("cross");
    } else {
      setStage("completed");
      setIsCompleted(true);
    }
  };

  // 스페이스바 이벤트 핸들러
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        if (stage === "instruction") {
          setStage("cross");
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

  // 단계 변경 처리
  useEffect(() => {
    clearTimer(); // 이전 타이머 정리

    if (stage === "cross") {
      // 십자가 표시 후 질문 단계로
      timerRef.current = setTimeout(() => {
        setStage("question");
      }, 500);
    } else if (stage === "question") {
      // 질문 단계 시작
      setTimeLeft(7);
      setUserInput("");
      playAudio();

      // 입력 필드에 포커스
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }

      // 7초 후 정답 표시
      timerRef.current = setTimeout(() => {
        setStage("answer");
      }, 7000);
    } else if (stage === "answer") {
      // 정답 표시 후 2초 뒤에 다음 단어로
      timerRef.current = setTimeout(() => {
        moveToNextWord();
      }, 2000);
    }

    return clearTimer; // 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
  }, [stage, currentWordIndex, userId]);

  // 타이머 카운트다운
  useEffect(() => {
    let interval = null;

    if (stage === "question" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, timeLeft]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    clearTimer(); // 진행 중인 타이머 정리
    setStage("answer");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

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
      {/* Status Bar */}
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
        {stage === "instruction" && (
          <p style={{ fontSize: "60px", textAlign: "center" }}>
            지금부터 본 시행을 시작합니다.
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
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "100px", marginBottom: "20px" }}>?</p>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              style={{
                fontSize: "24px",
                padding: "10px",
                width: "300px",
                textAlign: "center",
                marginBottom: "20px",
              }}
              autoFocus
              placeholder="단어를 입력하세요"
            />
            <p style={{ fontSize: "24px", marginBottom: "20px" }}>
              남은시간: {timeLeft}초
            </p>
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
              }}
            >
              확인
            </button>
          </div>
        )}

        {stage === "answer" && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "100px", marginBottom: "20px" }}>
              {mockWords[currentWordIndex].korean}
            </p>
            <p style={{ fontSize: "60px" }}>
              {mockWords[currentWordIndex].english}
            </p>
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

export default Round2;
