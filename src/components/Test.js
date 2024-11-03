import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const mockWords = [
  {
    korean: "아치",
    english: "arch",
    audioUrl: `${process.env.PUBLIC_URL}/arch.mp3`,
  },
  {
    korean: "배지",
    english: "badge",
    audioUrl: `${process.env.PUBLIC_URL}/badge.mp3`,
  },
  {
    korean: "가방",
    english: "bag",
    audioUrl: `${process.env.PUBLIC_URL}/bag.mp3`,
  },
  {
    korean: "바구니",
    english: "basket",
    audioUrl: `${process.env.PUBLIC_URL}/basket.mp3`,
  },
  {
    korean: "빔",
    english: "beam",
    audioUrl: `${process.env.PUBLIC_URL}/beam.mp3`,
  },
  {
    korean: "침대",
    english: "bed",
    audioUrl: `${process.env.PUBLIC_URL}/bed.mp3`,
  },
  {
    korean: "벨트",
    english: "belt",
    audioUrl: `${process.env.PUBLIC_URL}/belt.mp3`,
  },
  {
    korean: "지폐",
    english: "bill",
    audioUrl: `${process.env.PUBLIC_URL}/bill.mp3`,
  },
  {
    korean: "새",
    english: "bird",
    audioUrl: `${process.env.PUBLIC_URL}/bird.mp3`,
  },
  {
    korean: "담요",
    english: "blanket",
    audioUrl: `${process.env.PUBLIC_URL}/blanket.mp3`,
  },
  {
    korean: "판",
    english: "board",
    audioUrl: `${process.env.PUBLIC_URL}/board.mp3`,
  },
  {
    korean: "책",
    english: "book",
    audioUrl: `${process.env.PUBLIC_URL}/book.mp3`,
  },
  {
    korean: "병",
    english: "bottle",
    audioUrl: `${process.env.PUBLIC_URL}/bottle.mp3`,
  },
  {
    korean: "그릇",
    english: "bowl",
    audioUrl: `${process.env.PUBLIC_URL}/bowl.mp3`,
  },
  {
    korean: "상자",
    english: "box",
    audioUrl: `${process.env.PUBLIC_URL}/box.mp3`,
  },
  {
    korean: "벽돌",
    english: "brick",
    audioUrl: `${process.env.PUBLIC_URL}/brick.mp3`,
  },
  {
    korean: "브러시",
    english: "brush",
    audioUrl: `${process.env.PUBLIC_URL}/brush.mp3`,
  },
  {
    korean: "양동이",
    english: "bucket",
    audioUrl: `${process.env.PUBLIC_URL}/bucket.mp3`,
  },
  {
    korean: "버튼",
    english: "button",
    audioUrl: `${process.env.PUBLIC_URL}/button.mp3`,
  },
  {
    korean: "캔",
    english: "can",
    audioUrl: `${process.env.PUBLIC_URL}/can.mp3`,
  },
  {
    korean: "카드",
    english: "card",
    audioUrl: `${process.env.PUBLIC_URL}/card.mp3`,
  },
  {
    korean: "케이스",
    english: "case",
    audioUrl: `${process.env.PUBLIC_URL}/case.mp3`,
  },
  {
    korean: "고양이",
    english: "cat",
    audioUrl: `${process.env.PUBLIC_URL}/cat.mp3`,
  },
  {
    korean: "세라믹",
    english: "ceramic",
    audioUrl: `${process.env.PUBLIC_URL}/ceramic.mp3`,
  },
  {
    korean: "의자",
    english: "chair",
    audioUrl: `${process.env.PUBLIC_URL}/chair.mp3`,
  },
  {
    korean: "시계",
    english: "clock",
    audioUrl: `${process.env.PUBLIC_URL}/clock.mp3`,
  },
  {
    korean: "코일",
    english: "coil",
    audioUrl: `${process.env.PUBLIC_URL}/coil.mp3`,
  },
  {
    korean: "동전",
    english: "coin",
    audioUrl: `${process.env.PUBLIC_URL}/coin.mp3`,
  },
  {
    korean: "상업의",
    english: "commercial",
    audioUrl: `${process.env.PUBLIC_URL}/commercial.mp3`,
  },
  {
    korean: "나침반",
    english: "compass",
    audioUrl: `${process.env.PUBLIC_URL}/compass.mp3`,
  },
  {
    korean: "세제곱",
    english: "cubed",
    audioUrl: `${process.env.PUBLIC_URL}/cubed.mp3`,
  },
  {
    korean: "컵",
    english: "cup",
    audioUrl: `${process.env.PUBLIC_URL}/cup.mp3`,
  },
  {
    korean: "감속",
    english: "decelerate",
    audioUrl: `${process.env.PUBLIC_URL}/decelerate.mp3`,
  },
  {
    korean: "책상",
    english: "desk",
    audioUrl: `${process.env.PUBLIC_URL}/desk.mp3`,
  },
  {
    korean: "디젤",
    english: "diesel",
    audioUrl: `${process.env.PUBLIC_URL}/diesel.mp3`,
  },
  {
    korean: "규율",
    english: "discipline",
    audioUrl: `${process.env.PUBLIC_URL}/discipline.mp3`,
  },
  {
    korean: "개",
    english: "dog",
    audioUrl: `${process.env.PUBLIC_URL}/dog.mp3`,
  },
  {
    korean: "문",
    english: "door",
    audioUrl: `${process.env.PUBLIC_URL}/door.mp3`,
  },
  {
    korean: "지수",
    english: "exponent",
    audioUrl: `${process.env.PUBLIC_URL}/exponent.mp3`,
  },
  {
    korean: "물고기",
    english: "fish",
    audioUrl: `${process.env.PUBLIC_URL}/fish.mp3`,
  },
  {
    korean: "깃발",
    english: "flag",
    audioUrl: `${process.env.PUBLIC_URL}/flag.mp3`,
  },
  {
    korean: "플라스크",
    english: "flask",
    audioUrl: `${process.env.PUBLIC_URL}/flask.mp3`,
  },
  {
    korean: "꽃",
    english: "flower",
    audioUrl: `${process.env.PUBLIC_URL}/flower.mp3`,
  },
  {
    korean: "포크",
    english: "fork",
    audioUrl: `${process.env.PUBLIC_URL}/fork.mp3`,
  },
  {
    korean: "프레임",
    english: "frame",
    audioUrl: `${process.env.PUBLIC_URL}/frame.mp3`,
  },
  {
    korean: "갤런",
    english: "gallon",
    audioUrl: `${process.env.PUBLIC_URL}/gallon.mp3`,
  },
  {
    korean: "기어",
    english: "gear",
    audioUrl: `${process.env.PUBLIC_URL}/gear.mp3`,
  },
  {
    korean: "손잡이",
    english: "handle",
    audioUrl: `${process.env.PUBLIC_URL}/handle.mp3`,
  },
  {
    korean: "경첩",
    english: "hinge",
    audioUrl: `${process.env.PUBLIC_URL}/hinge.mp3`,
  },
  {
    korean: "고리",
    english: "hook",
    audioUrl: `${process.env.PUBLIC_URL}/hook.mp3`,
  },
  {
    korean: "말",
    english: "horse",
    audioUrl: `${process.env.PUBLIC_URL}/horse.mp3`,
  },
  {
    korean: "집",
    english: "house",
    audioUrl: `${process.env.PUBLIC_URL}/house.mp3`,
  },
  {
    korean: "항아리",
    english: "jar",
    audioUrl: `${process.env.PUBLIC_URL}/jar.mp3`,
  },
  {
    korean: "열쇠",
    english: "key",
    audioUrl: `${process.env.PUBLIC_URL}/key.mp3`,
  },
  {
    korean: "키보드",
    english: "keyboard",
    audioUrl: `${process.env.PUBLIC_URL}/keyboard.mp3`,
  },
  {
    korean: "칼",
    english: "knife",
    audioUrl: `${process.env.PUBLIC_URL}/knife.mp3`,
  },
  {
    korean: "램프",
    english: "lamp",
    audioUrl: `${process.env.PUBLIC_URL}/lamp.mp3`,
  },
  {
    korean: "잎",
    english: "leaf",
    audioUrl: `${process.env.PUBLIC_URL}/leaf.mp3`,
  },
  {
    korean: "편지",
    english: "letter",
    audioUrl: `${process.env.PUBLIC_URL}/letter.mp3`,
  },
  {
    korean: "지렛대",
    english: "leverage",
    audioUrl: `${process.env.PUBLIC_URL}/leverage.mp3`,
  },
  {
    korean: "빛",
    english: "light",
    audioUrl: `${process.env.PUBLIC_URL}/light.mp3`,
  },
  {
    korean: "연결",
    english: "link",
    audioUrl: `${process.env.PUBLIC_URL}/link.mp3`,
  },
  {
    korean: "자물쇠",
    english: "lock",
    audioUrl: `${process.env.PUBLIC_URL}/lock.mp3`,
  },
  {
    korean: "목재",
    english: "lumber",
    audioUrl: `${process.env.PUBLIC_URL}/lumber.mp3`,
  },
  {
    korean: "자석",
    english: "magnet",
    audioUrl: `${process.env.PUBLIC_URL}/magnet.mp3`,
  },
  {
    korean: "지도",
    english: "map",
    audioUrl: `${process.env.PUBLIC_URL}/map.mp3`,
  },
  {
    korean: "메달",
    english: "medal",
    audioUrl: `${process.env.PUBLIC_URL}/medal.mp3`,
  },
  {
    korean: "거울",
    english: "mirror",
    audioUrl: `${process.env.PUBLIC_URL}/mirror.mp3`,
  },
  {
    korean: "마우스",
    english: "mouse",
    audioUrl: `${process.env.PUBLIC_URL}/mouse.mp3`,
  },
  {
    korean: "시립의",
    english: "municipal",
    audioUrl: `${process.env.PUBLIC_URL}/municipal.mp3`,
  },
  {
    korean: "못",
    english: "nail",
    audioUrl: `${process.env.PUBLIC_URL}/nail.mp3`,
  },
  {
    korean: "타원",
    english: "oval",
    audioUrl: `${process.env.PUBLIC_URL}/oval.mp3`,
  },
  {
    korean: "종이",
    english: "paper",
    audioUrl: `${process.env.PUBLIC_URL}/paper.mp3`,
  },
  {
    korean: "연필",
    english: "pencil",
    audioUrl: `${process.env.PUBLIC_URL}/pencil.mp3`,
  },
  {
    korean: "석유",
    english: "petroleum",
    audioUrl: `${process.env.PUBLIC_URL}/petroleum.mp3`,
  },
  {
    korean: "전화",
    english: "phone",
    audioUrl: `${process.env.PUBLIC_URL}/phone.mp3`,
  },
  {
    korean: "사진",
    english: "picture",
    audioUrl: `${process.env.PUBLIC_URL}/picture.mp3`,
  },
  {
    korean: "베개",
    english: "pillow",
    audioUrl: `${process.env.PUBLIC_URL}/pillow.mp3`,
  },
  {
    korean: "접시",
    english: "plate",
    audioUrl: `${process.env.PUBLIC_URL}/plate.mp3`,
  },
  {
    korean: "펜치",
    english: "plier",
    audioUrl: `${process.env.PUBLIC_URL}/plier.mp3`,
  },
];

const Test = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(7);

  // 스페이스바 이벤트 핸들러는 동일
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        if (stage === "instruction") {
          setStage("cross");
          setTimeout(() => {
            setStage("question");
          }, 500);
        } else if (isCompleted) {
          navigate(`/${userId}/menu`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [stage, isCompleted, navigate, userId]);

  // 단어 진행 및 타이밍 제어 수정
  useEffect(() => {
    let timer;
    let countdownTimer;

    if (stage === "question") {
      // 오디오 재생
      const audio = new Audio(mockWords[currentWordIndex].audioUrl);
      audio.play();

      setCountdown(7);

      // 카운트다운 타이머
      countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // 7초 후 다음 단어로
      timer = setTimeout(() => {
        if (currentWordIndex < mockWords.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
          setStage("cross");

          // 0.5초 후 다음 문제
          setTimeout(() => {
            setStage("question");
          }, 500);
        } else {
          setStage("completed");
          setIsCompleted(true);
        }
      }, 7000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [stage, currentWordIndex]);

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
      {/* Status Bar - 기존과 동일 */}
      {stage !== "instruction" && stage !== "completed" && (
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
        {/* instruction, cross, question, completed 스테이지는 동일하게 유지 */}
        {stage === "instruction" && (
          <p style={{ fontSize: "60px", textAlign: "center" }}>
            지금부터 테스트 시행을 시작합니다.
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

        {stage === "question" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ fontSize: "100px" }}>?</div>
            <div style={{ fontSize: "40px" }}>남은시간 : {countdown}초</div>
          </div>
        )}

        {stage === "completed" && (
          <p style={{ fontSize: "60px", textAlign: "center" }}>
            실험이 완료되었습니다.
            <br />
            스페이스바를 눌러 메뉴로 돌아가세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default Test;
