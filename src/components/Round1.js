import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Mock 데이터
const mockWords = Array(120)
  .fill()
  .map((_, i) => ({
    korean: `한국어${i + 1}`,
    english: `english${i + 1}`,
    audioUrl: `${process.env.PUBLIC_URL}/test.mp3`, // PUBLIC_URL 추가
  }));

const Round1 = () => {
  const { userId } = useParams(); // userId path variable 가져오기
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [audio] = useState(new Audio());
  const [isCompleted, setIsCompleted] = useState(false);

  // playAudio 함수 개선
  const playAudio = async () => {
    try {
      // 새로운 오디오 재생 전에 이전 오디오를 완전히 중지
      audio.pause();
      audio.currentTime = 0;
      audio.src = mockWords[currentWordIndex].audioUrl;

      // 오디오 로드 완료 후 재생
      await new Promise((resolve) => {
        audio.oncanplaythrough = resolve;
        audio.load();
      });

      await audio.play();
    } catch (error) {
      console.error("오디오 재생 중 오류:", error);
    }
  };

  // showNextWord 함수 수정
  const showNextWord = () => {
    if (stage === "instruction") {
      setStage("cross");
      setTimeout(() => {
        setStage("word");
      }, 500);
    }
  };

  // 자동 단어 전환을 위한 useEffect 수정
  useEffect(() => {
    let timer;

    if (stage === "word") {
      timer = setTimeout(() => {
        if (currentWordIndex < mockWords.length - 1) {
          setStage("cross");
          setCurrentWordIndex((prev) => prev + 1);

          setTimeout(() => {
            setStage("word");
          }, 500);
        } else {
          // 마지막 단어가 끝나면 완료 상태로 변경
          setStage("completed");
          setIsCompleted(true);
        }
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stage, currentWordIndex]);

  // 스페이스바 이벤트 핸들러 수정
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        if (stage === "instruction") {
          showNextWord();
        } else if (isCompleted) {
          navigate(`/${userId}/menu`); // userId를 포함한 메뉴 경로로 이동
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [stage, isCompleted, navigate, userId]); // userId 의존성 추가

  // 오디오 재생을 위한 useEffect
  useEffect(() => {
    if (stage === "word") {
      playAudio();
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [stage, currentWordIndex]); // currentWordIndex 의존성 추가

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
      {/* Status Bar - 단어 표시 중일 때만 보이도록 */}
      {stage !== "instruction" && (
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

      {/* Content Area */}
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

        {stage === "completed" && (
          <p style={{ fontSize: "60px", textAlign: "center" }}>
            실험이 완료되었습니다.
            <br />
            스페이스바를 눌러 메뉴로 돌아가세요.
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
          <p style={{ fontSize: "100px" }}>
            {mockWords[currentWordIndex].korean}
          </p>
        )}
      </div>
    </div>
  );
};

export default Round1;
