import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockWords } from "./Words";

const PreTest = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [shuffledWords, setShuffledWords] = useState([]);
  const audioRef = useRef(null);
  const audioTimerRef = useRef(null);

  // 단어 배열 섞기
  useEffect(() => {
    const shuffled = [...mockWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, []);

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

  // 오디오 정리 함수
  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }
  };

  // 단어 진행 및 타이밍 제어 수정
  useEffect(() => {
    if (stage === "question") {
      const playAudio = async () => {
        try {
          // 이전 오디오 정리
          cleanupAudio();

          // 새로운 오디오 생성 및 재생
          audioRef.current = new Audio(
            shuffledWords[currentWordIndex].audioUrl
          );
          await audioRef.current.play();

          // 5초 후 오디오 재생
          audioTimerRef.current = setTimeout(async () => {
            if (audioRef.current) {
              try {
                await audioRef.current.play();
              } catch (error) {
                console.error("두 번째 오디오 재생 실패:", error);
              }
            }
          }, 5000);
        } catch (error) {
          console.error("오디오 재생 실패:", error);
        }
      };

      setTimeout(playAudio, 500);

      return cleanupAudio; // 컴포넌트 언마운트 또는 의존성 변경 시 정리
    }
  }, [stage, currentWordIndex, shuffledWords]);

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

  // 타이머 로직 추가
  useEffect(() => {
    let timer;
    let countdownTimer;

    if (stage === "question") {
      setTimeLeft(10);
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
        handleNextWord();
      }, 10000);

      return () => {
        clearInterval(countdownTimer);
        clearTimeout(timer);
      };
    }
  }, [stage, currentWordIndex]);

  // 새로운 함수들 추가
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleNextWord = () => {
    // 마지막 단어인 경우
    if (currentWordIndex === shuffledWords.length - 1) {
      const finalResults = [
        ...results,
        {
          word: shuffledWords[currentWordIndex].english,
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
        word: shuffledWords[currentWordIndex].english,
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
          type: "pretest",
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
      <p style={{ fontSize: "24px" }}>남은시간: {timeLeft}초</p>
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
        {currentWordIndex === shuffledWords.length - 1 ? "시험 종료" : "다음"}
      </button>
    </div>
  );

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
            지금부터 사전 테스트 시행을 시작합니다.
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

        {stage === "question" &&
          shuffledWords.length > 0 &&
          renderQuestionStage()}
      </div>
    </div>
  );
};

export default PreTest;
