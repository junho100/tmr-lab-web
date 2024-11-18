import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { mockWords } from "./PreTest";

const PreTestResult = () => {
  const { userId } = useParams();
  const [results, setResults] = useState(
    mockWords.map((word) => ({
      ...word,
      isCorrect: null, // null: 미체크, true: 정답, false: 오답
    }))
  );

  const handleResultChange = (index, isCorrect) => {
    setResults((prev) =>
      prev.map((result, i) => (i === index ? { ...result, isCorrect } : result))
    );
  };

  const handleSubmit = async () => {
    // 모든 단어가 체크되었는지 확인
    if (results.some((result) => result.isCorrect === null)) {
      alert("모든 단어의 결과를 체크해주세요.");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/labs/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_for_login: userId,
          results: results.map((result) => ({
            word: result.english,
            is_correct: result.isCorrect,
          })),
        }),
      });

      if (response.status === 201) {
        alert("결과가 성공적으로 저장되었습니다.");
      } else {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
    } catch (error) {
      console.error("결과 저장 중 오류 발생:", error);
      alert("결과 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        사전 테스트 결과 기록
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            padding: "10px 0",
            borderBottom: "2px solid #000",
          }}
        >
          <div style={{ flex: "1" }}>영단어</div>
          <div style={{ flex: "1" }}>한국어</div>
          <div style={{ flex: "1" }}>결과</div>
        </div>

        {results.map((word, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              padding: "10px 0",
              borderBottom: "1px solid #ddd",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1" }}>{word.english}</div>
            <div style={{ flex: "1" }}>{word.korean}</div>
            <div style={{ flex: "1" }}>
              <label style={{ marginRight: "15px" }}>
                <input
                  type="radio"
                  name={`result-${index}`}
                  checked={word.isCorrect === true}
                  onChange={() => handleResultChange(index, true)}
                />{" "}
                정답
              </label>
              <label>
                <input
                  type="radio"
                  name={`result-${index}`}
                  checked={word.isCorrect === false}
                  onChange={() => handleResultChange(index, false)}
                />{" "}
                오답
              </label>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          결과 저장
        </button>
      </div>
    </div>
  );
};

export default PreTestResult;
