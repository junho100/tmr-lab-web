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
  const peakThresholdRef = useRef(20);
  const lastPlayTimeRef = useRef(0);
  const [breathingStats, setBreathingStats] = useState({
    currentRate: 0,
    averageRate: 0,
    peakValue: 0,
    valleyValue: 0,
  });

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

  const startCollection = () => {
    if (!gdxDevice || !isConnected) return;

    console.log("Starting collection...");
    setIsCollecting(true);
    setBreathingData([]); // 초기화

    gdxDevice.enableDefaultSensors();
    gdxDevice.start(100); // 100ms sampling rate

    const sensor = gdxDevice.sensors.find((s) => s.enabled);
    if (sensor) {
      console.log("Sensor found:", sensor);

      sensor.on("value-changed", (sensor) => {
        const timestamp = Date.now();
        const newDataPoint = {
          time: timestamp,
          value: sensor.value,
        };

        console.log("New data point:", newDataPoint);

        setBreathingData((prev) => {
          const newData = [...prev, newDataPoint].slice(-100);
          console.log("Updated breathing data length:", newData.length);

          const mean =
            newData.reduce((sum, point) => sum + point.value, 0) /
            newData.length;
          console.log("Current mean:", mean);

          // 극대점 감지 조건 개선
          if (
            newData.length > 5 &&
            newDataPoint.value < prev[prev.length - 1]?.value &&
            prev[prev.length - 1]?.value > mean &&
            prev[prev.length - 1]?.value > peakThresholdRef.current && // 최소 임계값 체크
            !hasPlayedAudioRef.current &&
            timestamp - lastPlayTimeRef.current > 1000
          ) {
            // 최소 1초 간격

            console.log("극대점 감지! 값:", prev[prev.length - 1]?.value);
            audioElement.current.src =
              "https://papago.naver.com/apis/tts/c_lt_clara_2.2.30.0.3.32_164-nvoice_clara_2.2.30.0.3.32_91a33ac6b0a7c4f551f8d6edb2db5039-1727670602445.mp3";
            audioElement.current.currentTime = 0;

            // 한 번만 재생되도록 Promise 처리
            const playPromise = audioElement.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log("사운드 재생 성공");
                  lastPlayTimeRef.current = timestamp;
                })
                .catch((error) => {
                  console.error("오디오 재생 실패:", error);
                });
            }

            hasPlayedAudioRef.current = true;

            // 동적으로 임계값 조정 (옵션)
            peakThresholdRef.current = Math.max(
              15,
              prev[prev.length - 1]?.value * 0.7
            );
          } else if (newDataPoint.value < mean) {
            console.log("초기화: 다음 극대점 감지 준비");
            hasPlayedAudioRef.current = false;
          }

          return newData;
        });

        setBreathingStats((prev) => ({
          ...prev,
          currentValue: sensor.value,
          currentRate: calculateBreathingRate(breathingData),
          peakValue: Math.max(prev.peakValue, sensor.value),
          valleyValue: Math.min(prev.valleyValue || sensor.value, sensor.value),
        }));
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
    setBreathingStats({
      currentRate: 0,
      averageRate: 0,
      peakValue: 0,
      valleyValue: 0,
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
          <p>{breathingStats.currentRate} BPM</p>
        </StatCard>
        <StatCard>
          <h3>Peak Value</h3>
          <p>{breathingStats.peakValue.toFixed(2)}</p>
        </StatCard>
        <StatCard>
          <h3>Valley Value</h3>
          <p>{breathingStats.valleyValue.toFixed(2)}</p>
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
