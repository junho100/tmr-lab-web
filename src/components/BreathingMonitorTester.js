import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import styled from "styled-components";

// 호흡 역치 관련 상수
const WINDOW_SIZE = 60; // 역치 계산에 사용할 데이터 윈도우 크기
const THRESHOLD_FACTOR = 1.2; // 평균 대비 역치 팩터

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
  flex-wrap: wrap;
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

const SoundCuesPanel = styled.div`
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: disc;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
`;

const generateNormalToPeakToNormal = (length = 300) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < length; i++) {
    let value;
    
    if (i < length * 0.4 || i > length * 0.6) {
      // 정상 호흡 (0-3 범위)
      const t = i * 0.1;
      // 약간의 무작위성 추가
      const noise = Math.random() * 0.03 - 0.015; // ±0.015 노이즈
      value = 1.5 + Math.sin(t) * 1.2 + noise;
      // 피크를 더 뾰족하게
      if (value > 2) {
        value = 2 + Math.pow(value - 2, 1.5) + (Math.random() * 0.02 - 0.01);
      }
    } else if (i === Math.floor(length * 0.5)) {
      // 비정상 피크 (15) - 약간의 무작위성 추가
      value = 15 + (Math.random() * 0.2 - 0.1);
    } else {
      // 전환 구간
      const normalVal = 1.5 + Math.sin(i * 0.1) * 1.2;
      const distFromPeak = Math.abs(i - Math.floor(length * 0.5));
      const factor = Math.max(0, 1 - distFromPeak / 10);
      // 전환 구간에 무작위성 추가
      value = normalVal * (1 - factor) + 15 * factor + (Math.random() * 0.05 - 0.025);
    }
    
    data.push({
      time: now + i * 100,
      value
    });
  }
  
  // 추가 검증: 연속된 동일 값이 있는지 확인하고 수정
  for (let i = 1; i < data.length; i++) {
    if (Math.abs(data[i].value - data[i-1].value) < 0.001) {
      // 값이 너무 비슷하면 약간 조정
      data[i].value += 0.01;
    }
  }
  
  return data;
};

const generateNormalToNegativePeakToNormal = (length = 300) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < length; i++) {
    let value;
    
    if (i < length * 0.4 || i > length * 0.6) {
      // 정상 호흡 (0-3 범위)
      const t = i * 0.1;
      // 약간의 무작위성 추가
      const noise = Math.random() * 0.03 - 0.015;
      value = 1.5 + Math.sin(t) * 1.2 + noise;
      // 피크를 더 뾰족하게
      if (value > 2) {
        value = 2 + Math.pow(value - 2, 1.5) + (Math.random() * 0.02 - 0.01);
      }
    } else if (i === Math.floor(length * 0.5)) {
      // 비정상 음수 피크 (-15) - 약간의 무작위성 추가
      value = -15 + (Math.random() * 0.2 - 0.1);
    } else {
      // 전환 구간
      const normalVal = 1.5 + Math.sin(i * 0.1) * 1.2;
      const distFromPeak = Math.abs(i - Math.floor(length * 0.5));
      const factor = Math.max(0, 1 - distFromPeak / 10);
      // 전환 구간에 무작위성 추가
      value = normalVal * (1 - factor) + (-15) * factor + (Math.random() * 0.05 - 0.025);
    }
    
    data.push({
      time: now + i * 100,
      value
    });
  }
  
  // 추가 검증: 연속된 동일 값이 있는지 확인하고 수정
  for (let i = 1; i < data.length; i++) {
    if (Math.abs(data[i].value - data[i-1].value) < 0.001) {
      // 값이 너무 비슷하면 약간 조정
      data[i].value += 0.01;
    }
  }
  
  return data;
};

const generateNormalToHigher = (length = 600) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < length; i++) {
    let value;
    
    if (i < length * 0.4) {
      // 정상 호흡 (0-3 범위)
      const t = i * 0.1;
      // 약간의 무작위성 추가
      const noise = Math.random() * 0.04 - 0.02;
      value = 1.5 + Math.sin(t) * 1.2 + noise;
      // 피크를 더 뾰족하게
      if (value > 2) {
        value = 2 + Math.pow(value - 2, 1.5) + (Math.random() * 0.02 - 0.01);
      }
    } else if (i > length * 0.6) {
      // 더 높은 범위 (5-10)
      const t = i * 0.1;
      // 약간의 무작위성 추가
      const noise = Math.random() * 0.06 - 0.03;
      value = 7.5 + Math.sin(t) * 2.3 + noise;
      // 피크를 더 뾰족하게
      if (value > 9) {
        value = 9 + Math.pow(value - 9, 1.2) + (Math.random() * 0.03 - 0.015);
      }
    } else {
      // 전환 구간
      const progress = (i - length * 0.4) / (length * 0.2);
      const normalVal = 1.5 + Math.sin(i * 0.1) * 1.2;
      const higherVal = 7.5 + Math.sin(i * 0.1) * 2.3;
      // 전환 구간에 무작위성 추가
      value = normalVal * (1 - progress) + higherVal * progress + (Math.random() * 0.05 - 0.025);
    }
    
    data.push({
      time: now + i * 100,
      value
    });
  }
  
  // 추가 검증: 연속된 동일 값이 있는지 확인하고 수정
  for (let i = 1; i < data.length; i++) {
    if (Math.abs(data[i].value - data[i-1].value) < 0.001) {
      // 값이 너무 비슷하면 약간 조정
      data[i].value += 0.01;
    }
  }
  
  return data;
};

const generateHigherToNormal = (length = 600) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < length; i++) {
    let value;
    
    if (i < length * 0.4) {
      // 더 높은 범위 (5-10)
      const t = i * 0.1;
      // 약간의 무작위성 추가
      const noise = Math.random() * 0.06 - 0.03;
      value = 7.5 + Math.sin(t) * 2.3 + noise;
      // 피크를 더 뾰족하게
      if (value > 9) {
        value = 9 + Math.pow(value - 9, 1.2) + (Math.random() * 0.03 - 0.015);
      }
    } else if (i > length * 0.6) {
      // 정상 호흡 (0-3 범위)
      const t = i * 0.1;
      // 약간의 무작위성 추가
      const noise = Math.random() * 0.04 - 0.02;
      value = 1.5 + Math.sin(t) * 1.2 + noise;
      // 피크를 더 뾰족하게
      if (value > 2) {
        value = 2 + Math.pow(value - 2, 1.5) + (Math.random() * 0.02 - 0.01);
      }
    } else {
      // 전환 구간
      const progress = (i - length * 0.4) / (length * 0.2);
      const higherVal = 7.5 + Math.sin(i * 0.1) * 2.3;
      const normalVal = 1.5 + Math.sin(i * 0.1) * 1.2;
      // 전환 구간에 무작위성 추가
      value = higherVal * (1 - progress) + normalVal * progress + (Math.random() * 0.05 - 0.025);
    }
    
    data.push({
      time: now + i * 100,
      value
    });
  }
  
  // 추가 검증: 연속된 동일 값이 있는지 확인하고 수정
  for (let i = 1; i < data.length; i++) {
    if (Math.abs(data[i].value - data[i-1].value) < 0.001) {
      // 값이 너무 비슷하면 약간 조정
      data[i].value += 0.01;
    }
  }
  
  return data;
};

const BreathingMonitorTester = () => {
  const [breathingData, setBreathingData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [soundCues, setSoundCues] = useState([]);
  const [threshold, setThreshold] = useState(null);
  const [breathingStats, setBreathingStats] = useState({
    currentRate: 0,
    peakValue: 0,
    valleyValue: 0,
  });
  
  const audioElement = useRef(new Audio());
  const hasPlayedAudioRef = useRef(false);
  const lastPlayTimeRef = useRef(0);
  const simulationIntervalRef = useRef(null);
  const testDataRef = useRef([]);
  const currentIndexRef = useRef(0);
  const currentWordIndexRef = useRef(0);
  
  // 테스트용 단어 목록
  const [words, setWords] = useState(["테스트1", "테스트2", "테스트3"]);

  useEffect(() => {
    // 오디오 초기화
    audioElement.current = new Audio();
    
    audioElement.current.addEventListener("play", () => {
      console.log("오디오 재생 시작");
    });
    
    audioElement.current.addEventListener("error", (e) => {
      console.error("오디오 에러:", e);
    });
    
    return () => {
      if (audioElement.current) {
        audioElement.current.pause();
      }
      stopSimulation();
    };
  }, []);

  // 윈도우 평균 계산
  const calculateWindowMean = (data) => {
    if (data.length === 0) return 0;
    return data.reduce((sum, point) => sum + point.value, 0) / data.length;
  };

  // 피크 감지
  const detectPeak = (data, currentValue) => {
    if (data.length < 4) return false;
    const previousValue = data[data.length - 2].value;
    const beforePreviousValue = data[data.length - 3].value;
    
    // 이전 값이 현재 값보다 크고, 이전 값이 그 이전 값보다 크면 피크
    return previousValue > currentValue && previousValue > beforePreviousValue;
  };

  // 호흡률 계산
  const calculateBreathingRate = (data) => {
    if (data.length < 20) return 0;

    let crossings = 0;
    const mean = calculateWindowMean(data);

    for (let i = 1; i < data.length; i++) {
      if (
        (data[i].value > mean && data[i - 1].value <= mean) ||
        (data[i].value < mean && data[i - 1].value >= mean)
      ) {
        crossings++;
      }
    }

    // 각 완전한 호흡은 2번의 교차
    const breathingRate =
      (crossings / 2) *
      (60 / ((data[data.length - 1].time - data[0].time) / 1000));
    return Math.round(breathingRate * 10) / 10;
  };

  // 사운드 재생
  const playNextWord = () => {
    if (words.length === 0) return;

    const currentWord = words[currentWordIndexRef.current];
    console.log(`단어 재생: ${currentWord}`);

    // 원래는 오디오를 재생하지만 테스트에서는 로그만 출력
    // 실제 환경에서는 이 부분을 audioElement.current.play()로 대체
    
    // 큐 재생 기록
    setSoundCues(prev => [...prev, {
      time: Date.now(),
      word: currentWord,
      value: breathingData[breathingData.length - 1]?.value || 0,
      threshold: threshold || 0
    }]);

    // 다음 단어로 이동
    const nextIndex = (currentWordIndexRef.current + 1) % words.length;
    currentWordIndexRef.current = nextIndex;
    
    return currentWord;
  };

  // 테스트 시작
  const startTest = (testType) => {
    if (isSimulating) {
      stopSimulation();
    }
    
    // 상태 초기화
    setIsSimulating(true);
    setCurrentTest(testType);
    setBreathingData([]);
    setSoundCues([]);
    setThreshold(null);
    setBreathingStats({
      currentRate: 0,
      peakValue: 0,
      valleyValue: 0,
    });
    
    hasPlayedAudioRef.current = false;
    lastPlayTimeRef.current = 0;
    currentIndexRef.current = 0;
    
    // 테스트 데이터 생성
    let testData;
    switch (testType) {
      case 'test1':
        testData = generateNormalToPeakToNormal();
        break;
      case 'test2':
        testData = generateNormalToNegativePeakToNormal();
        break;
      case 'test3':
        testData = generateNormalToHigher();
        break;
      case 'test4':
        testData = generateHigherToNormal();
        break;
      default:
        testData = [];
    }
    
    testDataRef.current = testData;
    
    // 시뮬레이션 시작
    simulationIntervalRef.current = setInterval(() => {
      const currentIndex = currentIndexRef.current;
      
      if (currentIndex >= testData.length) {
        stopSimulation();
        return;
      }
      
      const newDataPoint = {
        ...testData[currentIndex],
        time: Date.now() // 실시간 타임스탬프로 업데이트
      };
      
      setBreathingData(prev => {
        const newData = [...prev, newDataPoint].slice(-100);
        
        // 충분한 데이터가 모이면 처리 시작
        if (newData.length >= WINDOW_SIZE) {
          // 윈도우 데이터
          const recentWindow = newData.slice(-WINDOW_SIZE);
          
          // 평균 계산
          const mean = calculateWindowMean(recentWindow);
          
          // 역치 계산
          const newThreshold = mean * THRESHOLD_FACTOR;
          setThreshold(newThreshold);
          // 피크 감지
          if (detectPeak(newData, newDataPoint.value)) {
            const peakValue = prev[prev.length - 1]?.value;
            console.log(`피크 감지: ${peakValue?.toFixed(2)}, 역치: ${newThreshold.toFixed(2)}`);
            
            // 테스트를 위해 딜레이 조건 제거 (원래는 90분 후에 시작)
            if (
              peakValue > newThreshold &&
              !hasPlayedAudioRef.current &&
              Date.now() - lastPlayTimeRef.current > 1000
            ) {
              playNextWord();
              lastPlayTimeRef.current = Date.now();
              hasPlayedAudioRef.current = true;
            }
          } else if (newDataPoint.value < mean) {
            // 평균 이하로 내려가면 다음 피크에서 다시 소리를 재생할 수 있도록 함
            hasPlayedAudioRef.current = false;
          }
          
          // 호흡 통계 업데이트
          setBreathingStats({
            currentRate: calculateBreathingRate(newData),
            peakValue: Math.max(breathingStats.peakValue || 0, newDataPoint.value),
            valleyValue: Math.min(breathingStats.valleyValue || newDataPoint.value, newDataPoint.value),
          });
        }
        
        return newData;
      });
      
      currentIndexRef.current++;
    }, 50); // 테스트 속도 향상을 위해 50ms로 설정 (실제 구현은 100ms)
  };

  // 시뮬레이션 중지
  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
  };

  return (
    <Container>
      <Header>
        <h1>호흡 모니터 테스트 도구</h1>
        <p>실제 장치 없이 호흡 모니터 컴포넌트를 테스트하기 위한 도구입니다.</p>
      </Header>

      <ControlPanel>
        <Button
          variant="primary"
          onClick={() => startTest('test1')}
          disabled={isSimulating && currentTest !== 'test1'}
        >
          테스트1: 정상 → 비정상 피크(15) → 정상
        </Button>
        <Button
          variant="primary"
          onClick={() => startTest('test2')}
          disabled={isSimulating && currentTest !== 'test2'}
        >
          테스트2: 정상 → 비정상 피크(-15) → 정상
        </Button>
        <Button
          variant="primary"
          onClick={() => startTest('test3')}
          disabled={isSimulating && currentTest !== 'test3'}
        >
          테스트3: 정상(0-3) → 높은 범위(5-10)
        </Button>
        <Button
          variant="primary"
          onClick={() => startTest('test4')}
          disabled={isSimulating && currentTest !== 'test4'}
        >
          테스트4: 높은 범위(5-10) → 정상(0-3)
        </Button>
        
        {isSimulating && (
          <Button onClick={stopSimulation}>
            시뮬레이션 중지
          </Button>
        )}
      </ControlPanel>

      <StatsPanel>
        <StatCard>
          <h3>현재 호흡률</h3>
          <p>{breathingStats.currentRate} BPM</p>
        </StatCard>
        <StatCard>
          <h3>피크 값</h3>
          <p>{typeof breathingStats.peakValue === 'number' ? breathingStats.peakValue.toFixed(2) : '0.00'}</p>
        </StatCard>
        <StatCard>
          <h3>밸리 값</h3>
          <p>{typeof breathingStats.valleyValue === 'number' ? breathingStats.valleyValue.toFixed(2) : '0.00'}</p>
        </StatCard>
        <StatCard>
          <h3>현재 역치</h3>
          <p>{typeof threshold === 'number' ? threshold.toFixed(2) : '계산 중...'}</p>
        </StatCard>
      </StatsPanel>
      
      <SoundCuesPanel>
        <h2>발생한 사운드 큐</h2>
        {soundCues.length === 0 ? (
          <p>아직 사운드 큐가 발생하지 않았습니다.</p>
        ) : (
          <ul>
            {soundCues.map((cue, index) => (
              <li key={index}>
                시간: {new Date(cue.time).toLocaleTimeString()} - 
                단어: "{cue.word}" - 
                피크값: {(cue.value || 0).toFixed(2)} - 
                역치: {(cue.threshold || 0).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </SoundCuesPanel>

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
            <YAxis domain={['auto', 'auto']} />
            <Tooltip
              labelFormatter={(time) => new Date(time).toLocaleTimeString()}
              formatter={(value) => [value.toFixed(2), "Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
            />
            {threshold && (
              <ReferenceLine
                y={threshold}
                stroke="red"
                strokeDasharray="3 3"
                label={{ value: `역치: ${threshold.toFixed(2)}`, position: 'right' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default BreathingMonitorTester;