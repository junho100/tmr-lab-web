import React, { useState, useEffect } from "react";
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

    return () => {
      if (gdxDevice) {
        gdxDevice.close();
      }
      // Clean up script tag
      document.body.removeChild(script);
    };
  }, []);

  const connectDevice = async () => {
    try {
      if (!window.godirect) {
        throw new Error("Go Direct library not loaded");
      }

      // Check if browser supports Bluetooth
      if (!navigator.bluetooth) {
        throw new Error("Bluetooth is not supported by this browser");
      }

      const device = await window.godirect.selectDevice(true); // true for Bluetooth connection
      setGdxDevice(device);
      setIsConnected(true);

      device.on("device-closed", () => {
        setIsConnected(false);
        setGdxDevice(null);
        setIsCollecting(false);
      });
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  const startCollection = () => {
    if (!gdxDevice || !isConnected) return;

    setIsCollecting(true);
    setBreathingData([]);

    gdxDevice.enableDefaultSensors();
    gdxDevice.start(100); // 100ms sampling rate

    const sensor = gdxDevice.sensors.find((s) => s.enabled);
    if (sensor) {
      sensor.on("value-changed", (sensor) => {
        const timestamp = Date.now();
        setBreathingData((prev) =>
          [
            ...prev,
            {
              time: timestamp,
              value: sensor.value,
            },
          ].slice(-100)
        ); // Keep last 100 data points

        // Update breathing stats
        updateBreathingStats(sensor.value);
      });
    }
  };

  const stopCollection = () => {
    if (gdxDevice) {
      gdxDevice.stop();
    }
    setIsCollecting(false);
  };

  const updateBreathingStats = (newValue) => {
    setBreathingStats((prev) => ({
      ...prev,
      currentRate: calculateBreathingRate(breathingData),
      peakValue: Math.max(prev.peakValue, newValue),
      valleyValue: Math.min(prev.valleyValue || newValue, newValue),
    }));
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

  const disconnectDevice = () => {
    if (gdxDevice) {
      gdxDevice.close();
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
