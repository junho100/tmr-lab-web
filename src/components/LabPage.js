import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { mockWords } from "./Test"; // Test.js에서 mockWords를 export 해야 합니다

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
`;

const Canvas = styled.canvas`
  border: 1px solid #000;
  margin-top: 20px;
`;

const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StartButton = styled.button`
  font-size: 18px;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  background-color: ${(props) => (props.isRecording ? "#ff4444" : "#4444ff")};
  color: white;
`;

const BreathStatus = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const LabPage = () => {
  const { id_for_login } = useParams();
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [threshold, setThreshold] = useState(20);
  const [breathState, setBreathState] = useState("ready");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // 필요한 ref을 정의
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const dataArrayRef = useRef(null);
  const audioElement = useRef(null);
  const hasPlayedAudioRef = useRef(false);

  // 상태 추적을 위한 ref들
  const quietDurationRef = useRef(0);
  const loudDurationRef = useRef(0);
  const longQuietDurationRef = useRef(0);
  const lastStateChangeTimeRef = useRef(0);

  // 상수 정의
  const QUIET_THRESHOLD = 20;
  const DURATION_THRESHOLD = 15;
  const LONG_QUIET_DURATION = 600;

  const updateBreathState = useCallback(
    (average) => {
      // 음량에 따른 duration 업데이트
      if (average > threshold) {
        loudDurationRef.current++;
        quietDurationRef.current = 0;
        longQuietDurationRef.current = 0;
      } else if (average <= QUIET_THRESHOLD) {
        quietDurationRef.current++;
        loudDurationRef.current = 0;
        longQuietDurationRef.current++;

        if (longQuietDurationRef.current >= LONG_QUIET_DURATION) {
          changeBreathState("ready");
          return;
        }
      }

      // 호흡 상태 전환 로직
      // eslint-disable-next-line default-case
      switch (breathState) {
        case "ready":
          if (loudDurationRef.current >= DURATION_THRESHOLD) {
            changeBreathState("inhale");
          }
          break;

        case "inhale":
          if (quietDurationRef.current >= DURATION_THRESHOLD) {
            changeBreathState("between");
            if (!hasPlayedAudioRef.current && audioElement.current) {
              audioElement.current.currentTime = 0;
              audioElement.current.play();
              hasPlayedAudioRef.current = true;
            }
          }
          break;

        case "between":
          // between에서 exhale로 전환할 때는 일정 시간이 지난 후에만
          if (
            loudDurationRef.current >= DURATION_THRESHOLD &&
            Date.now() - lastStateChangeTimeRef.current >= 1000
          ) {
            changeBreathState("exhale");
          }
          break;

        case "exhale":
          if (quietDurationRef.current >= DURATION_THRESHOLD) {
            changeBreathState("ready");
          }
          break;
      }
    },
    [breathState, threshold]
  );

  const changeBreathState = useCallback(
    (newState) => {
      console.log(`호흡 상태 변경: ${breathState} -> ${newState}`);
      setBreathState(newState);
      lastStateChangeTimeRef.current = Date.now();
      quietDurationRef.current = 0;
      loudDurationRef.current = 0;

      if (newState === "between") {
        // between 상태에서 음성 재생
        if (!hasPlayedAudioRef.current && audioElement.current) {
          audioElement.current.src = mockWords[currentWordIndex].audioUrl;
          audioElement.current.play();
          hasPlayedAudioRef.current = true;

          // 다음 단어 인덱스로 업데이트
          setCurrentWordIndex((prev) => (prev + 1) % mockWords.length);
        }
      } else {
        longQuietDurationRef.current = 0;
        hasPlayedAudioRef.current = false;
      }
    },
    [breathState, currentWordIndex]
  );

  const startRecording = async () => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount
      );
      setIsRecording(true);
    } catch (err) {
      console.error("마이크 접근 오류:", err);
    }
  };

  const getBreathStateText = (state = breathState) => {
    switch (state) {
      case "ready":
        return "준비";
      case "inhale":
        return "들숨";
      case "between":
        return "중간";
      case "exhale":
        return "날숨";
      default:
        return "알 수 없음";
    }
  };

  const stopRecording = () => {
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setBreathState("ready");
    quietDurationRef.current = 0;
    loudDurationRef.current = 0;
    longQuietDurationRef.current = 0;
  };

  useEffect(() => {
    if (!isRecording || !canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastApiCallTime = 0;
    const API_CALL_INTERVAL = 100; // 100ms 간격 (1초에 10번)

    const sendBreathingData = async (average) => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error("API URL이 설정되지 않았습니다");
        }

        const response = await fetch(`${apiUrl}/api/labs/breathing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_for_login,
            average_volume: average,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          console.error("호흡 데이터 전송 실패:", response.status);
        }
      } catch (error) {
        console.error("호흡 데이터 전송 중 오류:", error);
      }
    };

    const draw = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const average =
        dataArrayRef.current.reduce((acc, val) => acc + val, 0) /
        dataArrayRef.current.length;
      const roundedAverage = Math.round(average);

      // API 요청 주기 제어
      const currentTime = Date.now();
      if (currentTime - lastApiCallTime >= API_CALL_INTERVAL) {
        sendBreathingData(roundedAverage);
        lastApiCallTime = currentTime;
      }

      // 캔버스 초기화
      ctx.fillStyle = "rgb(200, 200, 200)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 그래프 그리기
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / dataArrayRef.current.length;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // 상태 업데이트
      updateBreathState(roundedAverage);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRecording, updateBreathState, id_for_login]);

  // 오디오 객체 초기화를 컴포넌트 마운트 시 한 번만 수행
  useEffect(() => {
    audioElement.current = new Audio();
    audioElement.current.addEventListener("loadeddata", () => {
      console.log("오디오 로드 완료");
    });

    return () => {
      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current = null;
      }
    };
  }, []);

  return (
    <Container>
      <h1>실시간 음량 그래프와 개선된 호흡 감지</h1>
      <Canvas ref={canvasRef} width={600} height={200} />
      <BreathStatus>호흡 상태: {getBreathStateText()}</BreathStatus>
      <Controls>
        <SliderContainer>
          <label htmlFor="thresholdSlider">음량 역치:</label>
          <input
            type="range"
            id="thresholdSlider"
            min="0"
            max="100"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
          />
          <span>{threshold}</span>
        </SliderContainer>
        <StartButton
          onClick={isRecording ? stopRecording : startRecording}
          isRecording={isRecording}
        >
          {isRecording ? "종료" : "시작"}
        </StartButton>
      </Controls>
    </Container>
  );
};

export default LabPage;
