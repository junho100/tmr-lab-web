import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Mock 데이터
const mockWords = Array(120)
  .fill()
  .map((_, i) => ({
    korean: `한국어${i + 1}`,
    english: `english${i + 1}`,
    audioUrl: `https://papago.naver.com/apis/tts/c_lt_clara_2.2.30.0.3.32_164-nvoice_clara_2.2.30.0.3.32_91a33ac6b0a7c4f551f8d6edb2db5039-1727670602445.mp3`,
  }));

const Round1 = () => {
  const { userId } = useParams();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [audio] = useState(new Audio());

  useEffect(() => {
    audio.src = mockWords[currentWordIndex].audioUrl;
  }, [currentWordIndex, audio]);

  const playAudio = () => {
    if (playCount < 3) {
      audio.play();
      setPlayCount((prevCount) => prevCount + 1);
    }
  };

  const nextWord = () => {
    if (currentWordIndex < mockWords.length - 1) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setPlayCount(0);
    }
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
      <h1>Round 1</h1>
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
      <div
        style={{
          fontSize: "24px",
          margin: "40px 0",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          cursor: "pointer",
        }}
        onClick={playAudio}
      >
        {mockWords[currentWordIndex].korean}
      </div>
      <p>클릭하여 영어 단어 음성 듣기 (남은 횟수: {3 - playCount})</p>
      <button
        onClick={nextWord}
        disabled={currentWordIndex === mockWords.length - 1}
        style={{
          ...buttonStyle,
          backgroundColor:
            currentWordIndex === mockWords.length - 1 ? "#cccccc" : "#4CAF50",
          cursor:
            currentWordIndex === mockWords.length - 1
              ? "not-allowed"
              : "pointer",
        }}
      >
        다음 단어
      </button>
    </div>
  );
};

export default Round1;
