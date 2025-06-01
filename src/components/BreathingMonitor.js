import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertDescription, AlertIcon } from "./Alert";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

// 호흡 역치 관련 상수
const WINDOW_SIZE = 60; // 역치 계산에 사용할 데이터 윈도우 크기
const THRESHOLD_FACTOR = 1.2; // 평균 대비 역치 팩터 (필요시 조정)

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 20px;
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: ${(props) =>
    props.variant === "primary" ? "#3b82f6" : "#6b7280"};
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  padding: 16px;
  background-color: #f3f4f6;
  border-radius: 8px;

  h3 {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 4px;
  }

  p {
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
  }
`;

const BreathingMonitor = () => {
  const [gdxDevice, setGdxDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [bluetoothSupported, setBluetoothSupported] = useState(true);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [breathingData, setBreathingData] = useState([]);
  const audioElement = useRef(new Audio());
  const hasPlayedAudioRef = useRef(false);
  const thresholdRef = useRef(null);
  const lastPlayTimeRef = useRef(0);
  const [breathingStats, setBreathingStats] = useState({
    currentRate: 0,
    currentValue: 0,
    peakValue: 0,
    valleyValue: 0,
    currentThreshold: 0,
  });
  const [words, setWords] = useState([]);
  const currentWordIndexRef = useRef(0);
  const { userId } = useParams();
  const navigate = useNavigate();
  const lastApiCallTimeRef = useRef(0);
  const API_CALL_INTERVAL = 100;
  const soundCueStartTimeRef = useRef(null);
  const DELAY_BEFORE_SOUND = 90 * 60 * 1000;
  const breathingCycleCountRef = useRef(0); // 호흡 사이클 카운터

  useEffect(() => {
    // Load godirect library
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@vernier/godirect/dist/godirect.min.umd.js";
    script.async = true;
    script.onload = () => setLibraryLoaded(true);
    document.body.appendChild(script);

    // Check Bluetooth support
    if (!navigator.bluetooth) {
      setBluetoothSupported(false);
    }

    // 페이지 새로고침/종료 시 정리
    const handleBeforeUnload = () => {
      if (gdxDevice) {
        gdxDevice.close();
      }
      cleanupDevice();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      disconnectDevice();
      document.body.removeChild(script);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/labs/cue?id=${userId}`);

        if (response.status === 404) {
          alert("사전 테스트 결과가 존재하지 않습니다.");
          navigate(`/${userId}/menu`);
          return;
        }

        if (!response.ok) {
          throw new Error("단어 리스트를 가져오는데 실패했습니다");
        }

        const data = await response.json();
        setWords(data.words);
      } catch (error) {
        console.error("단어 리스트 가져오기 오류:", error);
      }
    };

    fetchWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const connectDevice = async () => {
    try {
      if (!window.godirect) {
        throw new Error("Go Direct library not loaded");
      }

      // 이전 연결이 있다면 정리
      if (gdxDevice) {
        await gdxDevice.close();
        setGdxDevice(null);
        setIsConnected(false);
      }

      // Check if browser supports Bluetooth
      if (!navigator.bluetooth) {
        throw new Error("Bluetooth is not supported by this browser");
      }

      const device = await window.godirect.selectDevice(true);
      setGdxDevice(device);
      setIsConnected(true);

      device.on("device-closed", () => {
        console.log("Device closed event triggered");
        cleanupDevice();
      });
    } catch (err) {
      console.error("Failed to connect:", err);
      cleanupDevice();
    }
  };

  const sendBreathingData = async (value) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) return;

      const response = await fetch(`${apiUrl}/api/labs/breathing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_for_login: userId,
          average_volume: value,
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

  // 윈도우 평균 계산 함수
  const calculateWindowMean = (data) => {
    if (data.length === 0) return 0;
    return data.reduce((sum, point) => sum + point.value, 0) / data.length;
  };

  // 피크 감지 함수
  const detectPeak = (data, currentValue) => {
    if (data.length < 4) return false;

    const previousValue = data[data.length - 2].value;
    const beforePreviousValue = data[data.length - 3].value;

    // 이전 값이 현재 값보다 크고, 이전 값이 그 이전 값보다 크면 피크로 간주
    return previousValue > currentValue && previousValue > beforePreviousValue;
  };

  const startCollection = () => {
    if (!gdxDevice || !isConnected) return;

    console.log("Starting collection...");
    setIsCollecting(true);
    setBreathingData([]); // 초기화
    thresholdRef.current = null;
    soundCueStartTimeRef.current = Date.now(); // 시작 시간 기록
    breathingCycleCountRef.current = 0; // 카운터 초기화

    gdxDevice.enableDefaultSensors();
    gdxDevice.start(100); // 100ms sampling rate

    const sensor = gdxDevice.sensors.find((s) => s.enabled);
    if (sensor) {
      sensor.on("value-changed", (sensor) => {
        const timestamp = Date.now();
        const newDataPoint = {
          time: timestamp,
          value: sensor.value,
        };

        if (timestamp - lastApiCallTimeRef.current >= API_CALL_INTERVAL) {
          sendBreathingData(sensor.value);
          lastApiCallTimeRef.current = timestamp;

          setBreathingData((prev) => {
            const newData = [...prev, newDataPoint].slice(-100);

            // 충분한 데이터가 있는 경우에만 계산 수행
            if (newData.length < WINDOW_SIZE) return newData;

            // 최근 데이터 윈도우
            const recentWindow = newData.slice(-WINDOW_SIZE);

            // 윈도우 평균 계산
            const mean = calculateWindowMean(recentWindow);

            // 역치 계산: 평균 * 팩터
            const newThreshold = mean * THRESHOLD_FACTOR;
            thresholdRef.current = newThreshold;

            // 피크 감지
            if (detectPeak(newData, newDataPoint.value)) {
              const peakValue = prev[prev.length - 1]?.value;

              // 피크가 역치를 초과하고 아직 사운드를 재생하지 않았으며 일정 시간이 지났을 때
              if (
                timestamp - soundCueStartTimeRef.current >=
                  DELAY_BEFORE_SOUND &&
                peakValue > newThreshold &&
                !hasPlayedAudioRef.current &&
                timestamp - lastPlayTimeRef.current > 1000
              ) {
                breathingCycleCountRef.current += 1; // 카운터 증가

                // 2번에 한번만 재생
                if (breathingCycleCountRef.current % 2 === 0) {
                  playNextWord();
                  lastPlayTimeRef.current = timestamp;
                }
                hasPlayedAudioRef.current = true;
              }
            } else if (newDataPoint.value < mean) {
              // 평균 이하로 내려가면 다음 피크에서 다시 소리를 재생할 수 있도록 함
              hasPlayedAudioRef.current = false;
            }

            return newData;
          });

          setBreathingStats((prev) => ({
            ...prev,
            currentValue: sensor.value,
            currentRate: calculateBreathingRate(breathingData),
            peakValue: Math.max(prev.peakValue, sensor.value),
            valleyValue: Math.min(
              prev.valleyValue || sensor.value,
              sensor.value
            ),
            currentThreshold: thresholdRef.current || "계산 중...",
          }));
        }
      });
    } else {
      console.error("No enabled sensor found");
    }
  };

  const stopCollection = () => {
    if (gdxDevice) {
      gdxDevice.stop();
    }
    setIsCollecting(false);
  };

  const calculateBreathingRate = (data) => {
    // Simple breathing rate calculation
    if (data.length < 20) return 0;

    let crossings = 0;
    const mean =
      data.reduce((sum, point) => sum + point.value, 0) / data.length;

    for (let i = 1; i < data.length; i++) {
      if (
        (data[i].value > mean && data[i - 1].value <= mean) ||
        (data[i].value < mean && data[i - 1].value >= mean)
      ) {
        crossings++;
      }
    }

    // Each complete breath has 2 crossings
    const breathingRate =
      (crossings / 2) *
      (60 / ((data[data.length - 1].time - data[0].time) / 1000));
    return Math.round(breathingRate * 10) / 10;
  };

  const disconnectDevice = async () => {
    try {
      if (gdxDevice) {
        await gdxDevice.close();
      }
    } catch (err) {
      console.error("Error during disconnect:", err);
    } finally {
      cleanupDevice();
    }
  };

  // 장치 정리를 위한 새로운 함수
  const cleanupDevice = () => {
    setIsConnected(false);
    setIsCollecting(false);
    setGdxDevice(null);
    setBreathingData([]);
    breathingCycleCountRef.current = 0;
    setBreathingStats({
      currentRate: 0,
      currentValue: 0,
      peakValue: 0,
      valleyValue: 0,
      currentThreshold: 0,
    });

    // 블루투스 연결 강제 해제 시도
    if (navigator.bluetooth && navigator.bluetooth.getDevices) {
      navigator.bluetooth
        .getDevices()
        .then((devices) => {
          devices.forEach((device) => {
            if (device.gatt.connected) {
              device.gatt.disconnect();
            }
          });
        })
        .catch((err) =>
          console.error("Error cleaning up bluetooth devices:", err)
        );
    }
  };

  useEffect(() => {
    // 오디오 객체 초기화
    audioElement.current = new Audio();
    audioElement.current.addEventListener("loadeddata", () => {
      console.log("오디오 로드 완료");
    });

    audioElement.current.addEventListener("play", () => {
      console.log("오디오 재생 시작");
    });

    audioElement.current.addEventListener("error", (e) => {
      console.error("오디오 에러:", e);
    });

    return () => {
      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current.removeEventListener("loadeddata", () => {});
        audioElement.current.removeEventListener("play", () => {});
        audioElement.current.removeEventListener("error", () => {});
      }
    };
  }, []);

  const playNextWord = () => {
    if (words.length === 0) return;

    const currentWord = words[currentWordIndexRef.current];

    audioElement.current.src = `${process.env.PUBLIC_URL}/${currentWord}.mp3`;

    const playPromise = audioElement.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          sendSoundCueData(currentWord);
          const nextIndex = (currentWordIndexRef.current + 1) % words.length;
          currentWordIndexRef.current = nextIndex;
        })
        .catch((error) => {
          console.error("오디오 재생 실패:", error);
        });
    }
  };

  const sendSoundCueData = async (currentWord) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) return;

      const response = await fetch(`${apiUrl}/api/labs/cue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_for_login: userId,
          target_word: currentWord,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error("사운드 큐 데이터 전송 실패:", response.status);
      }
    } catch (error) {
      console.error("사운드 큐 데이터 전송 중 오류:", error);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Breathing Monitor</h1>
        {!libraryLoaded ? (
          <Alert
            style={{
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fee2e2",
            }}
          >
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <AlertIcon />
              <AlertDescription>Loading Go Direct library...</AlertDescription>
            </div>
          </Alert>
        ) : !bluetoothSupported ? (
          <Alert
            style={{
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fee2e2",
            }}
          >
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <AlertIcon />
              <AlertDescription>
                Bluetooth is not supported by this browser. Please use a browser
                with Bluetooth support.
              </AlertDescription>
            </div>
          </Alert>
        ) : (
          !isConnected && (
            <Alert
              style={{
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <AlertIcon />
                <AlertDescription>
                  Connect a Go Direct device to start monitoring breathing rate
                </AlertDescription>
              </div>
            </Alert>
          )
        )}
      </Header>

      <ControlPanel>
        {!isConnected ? (
          <Button
            variant="primary"
            onClick={connectDevice}
            disabled={!bluetoothSupported}
          >
            Connect Device
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={isCollecting ? stopCollection : startCollection}
            >
              {isCollecting ? "Stop Collection" : "Start Collection"}
            </Button>
            <Button onClick={disconnectDevice}>Disconnect</Button>
          </>
        )}
      </ControlPanel>

      <StatsPanel>
        <StatCard>
          <h3>Current Breathing Rate</h3>
          <p>{breathingStats.currentRate || 0} BPM</p>
        </StatCard>
        <StatCard>
          <h3>Peak Value</h3>
          <p>{(breathingStats.peakValue || 0).toFixed(2)}</p>
        </StatCard>
        <StatCard>
          <h3>Valley Value</h3>
          <p>{(breathingStats.valleyValue || 0).toFixed(2)}</p>
        </StatCard>
        <StatCard>
          <h3>Current Threshold</h3>
          <p>
            {typeof breathingStats.currentThreshold === "number"
              ? breathingStats.currentThreshold.toFixed(2)
              : breathingStats.currentThreshold}
          </p>
        </StatCard>
      </StatsPanel>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={breathingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              domain={["auto", "auto"]}
              type="number"
              tickFormatter={(time) => new Date(time).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(time) => new Date(time).toLocaleTimeString()}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default BreathingMonitor;
