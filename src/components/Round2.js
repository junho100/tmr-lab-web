import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Mock 데이터
const mockWords = Array(120)
  .fill()
  .map((_, i) => ({
    korean: `사과${i + 1}`,
    english: `apple${i + 1}`,
    audioUrl: `https://papago.naver.com/apis/tts/c_lt_clara_2.2.30.0.3.32_164-nvoice_clara_2.2.30.0.3.32_91a33ac6b0a7c4f551f8d6edb2db5039-1727670602445.mp3`,
  }));

const Round2 = () => {
  const { userId } = useParams();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [audio] = useState(new Audio());
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    audio.src = mockWords[currentWordIndex].audioUrl;
    setPlayCount(0);
  }, [currentWordIndex, audio]);

  const playAudio = () => {
    if (playCount < 3) {
      audio.play();
      setPlayCount((prevCount) => prevCount + 1);
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      if (currentWordIndex < mockWords.length - 1) {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
        setUserInput("");
      }
    }, 2000);
  };

  const progress = ((currentWordIndex + 1) / mockWords.length) * 100;

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Round 2</h1>
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
        <p>
          {currentWordIndex + 1} / {mockWords.length}
        </p>
      </div>
      <button
        onClick={playAudio}
        style={{
          ...buttonStyle,
          backgroundColor: playCount >= 3 ? "#cccccc" : "#4CAF50",
          cursor: playCount >= 3 ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
        disabled={playCount >= 3}
      >
        듣기 (남은 횟수: {3 - playCount})
      </button>
      <div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="한국어 단어 입력"
          style={{ padding: "10px", fontSize: "18px", marginRight: "10px" }}
        />
        <button onClick={checkAnswer} style={buttonStyle}>
          다음
        </button>
      </div>
      {showAnswer && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            color:
              userInput === mockWords[currentWordIndex].korean
                ? "green"
                : "red",
          }}
        >
          정답: {mockWords[currentWordIndex].korean}
        </div>
      )}
    </div>
  );
};

export default Round2;
