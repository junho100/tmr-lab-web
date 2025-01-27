import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockWords } from "./Words";

const Test = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);

  // 스페이스바 이벤트 핸들러 수정
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" && stage === "instruction") {
        setStage("cross");
        setTimeout(() => {
          setStage("question");
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [stage]);

  // 단어 진행 및 타이밍 제어 수정
  useEffect(() => {
    if (stage === "question") {
      setTimeout(() => {
        const audio = new Audio(mockWords[currentWordIndex].audioUrl);
        audio.play();
      }, 500);
    }
  }, [stage, currentWordIndex]);

  // 새로고침 방지 기능 추가
  useEffect(() => {
    const preventRefresh = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", preventRefresh);

    return () => {
      window.removeEventListener("beforeunload", preventRefresh);
    };
  }, []);

  // 새로운 함수들 추가
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleNextWord = () => {
    // 마지막 단어인 경우
    if (currentWordIndex === mockWords.length - 1) {
      const finalResults = [
        ...results,
        {
          word: mockWords[currentWordIndex].english,
          written_word: userInput,
        },
      ];
      handleSubmit(finalResults);
      return;
    }

    // 결과 저장
    setResults((prev) => [
      ...prev,
      {
        word: mockWords[currentWordIndex].english,
        written_word: userInput,
      },
    ]);

    // 다음 단어로 이동
    setUserInput("");
    setCurrentWordIndex((prev) => prev + 1);
    setStage("cross");
    setTimeout(() => {
      setStage("question");
    }, 500);
  };

  const handleSubmit = async (finalResults) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/labs/start-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lab_id: userId,
          type: "test",
          results: finalResults,
        }),
      });

      if (response.status === 201) {
        navigate(`/${userId}/menu`);
      } else {
        console.error("테스트 제출 API 호출 실패:", response.status);
        alert("테스트 제출에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("테스트 제출 중 오류:", error);
      alert("테스트 제출 중 오류가 발생했습니다.");
    }
  };

  // 렌더링 부분 수정
  const renderQuestionStage = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div style={{ fontSize: "40px" }}>단어를 듣고 한글로 입력하세요</div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyPress={(e) => e.key === "Enter" && handleNextWord()}
        style={{
          fontSize: "24px",
          padding: "10px",
          width: "300px",
          textAlign: "center",
        }}
        autoFocus
      />
      <button
        onClick={handleNextWord}
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
        {currentWordIndex === mockWords.length - 1 ? "시험 종료" : "다음"}
      </button>
    </div>
  );

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
            지금부터 사후 테스트 시행을 시작합니다.
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

        {stage === "question" && renderQuestionStage()}
      </div>
    </div>
  );
};

export default Test;
