import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockWords } from "./Words";

const Round1 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [audio] = useState(new Audio());
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);
  const [userInput, setUserInput] = useState("");
  const [shuffledWords, setShuffledWords] = useState([]);

  // 단어 배열 섞기
  useEffect(() => {
    const shuffled = [...mockWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, []);

  // playAudio 함수 유지
  const playAudio = async () => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.src = shuffledWords[currentWordIndex].audioUrl;

      await new Promise((resolve) => {
        audio.oncanplaythrough = resolve;
        audio.load();
      });

      await audio.play();
    } catch (error) {
      console.error("오디오 재생 중 오류:", error);
    }
  };

  const showNextWord = () => {
    if (stage === "instruction") {
      setStage("cross");
      setTimeout(() => {
        setStage("word");
      }, 500);
    }
  };

  // 타이머 로직
  useEffect(() => {
    let timer;
    let countdownTimer;

    if (stage === "word") {
      setTimeLeft(7);
      setUserInput("");

      countdownTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timer = setTimeout(() => {
        if (currentWordIndex < shuffledWords.length - 1) {
          setStage("cross");
          setCurrentWordIndex((prev) => prev + 1);

          setTimeout(() => {
            setStage("word");
          }, 500);
        } else {
          setStage("completed");
          setIsCompleted(true);
        }
      }, 7000);

      return () => {
        clearInterval(countdownTimer);
        clearTimeout(timer);
      };
    }
  }, [stage, currentWordIndex, shuffledWords.length]);

  // 스페이스바 이벤트 핸들러
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        if (stage === "instruction") {
          showNextWord();
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

  // 오디오 재생
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
  }, [stage, currentWordIndex]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (currentWordIndex < shuffledWords.length - 1) {
      setStage("cross");
      setCurrentWordIndex((prev) => prev + 1);
      setTimeout(() => {
        setStage("word");
      }, 500);
    } else {
      setStage("completed");
      setIsCompleted(true);
    }
  };

  const progress = ((currentWordIndex + 1) / shuffledWords.length) * 100;

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
            {currentWordIndex + 1} / {shuffledWords.length}
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

        {stage === "word" && shuffledWords.length > 0 && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "100px", marginBottom: "20px" }}>
              {shuffledWords[currentWordIndex].korean}
            </p>
            <p style={{ fontSize: "60px", marginBottom: "20px" }}>
              {shuffledWords[currentWordIndex].english}
            </p>
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
      </div>
    </div>
  );
};

export default Round1;
