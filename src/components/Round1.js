import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Mock 데이터
const mockWords = [
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
    korean: "담",
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
  {
    korean: "예방",
    english: "precaution",
    audioUrl: `${process.env.PUBLIC_URL}/precaution.mp3`,
  },
  {
    korean: "프린터",
    english: "printer",
    audioUrl: `${process.env.PUBLIC_URL}/printer.mp3`,
  },
  {
    korean: "프리즘",
    english: "prism",
    audioUrl: `${process.env.PUBLIC_URL}/prism.mp3`,
  },
  {
    korean: "도르래",
    english: "pulley",
    audioUrl: `${process.env.PUBLIC_URL}/pulley.mp3`,
  },
  {
    korean: "토끼",
    english: "rabbit",
    audioUrl: `${process.env.PUBLIC_URL}/rabbit.mp3`,
  },
  {
    korean: "선반",
    english: "rack",
    audioUrl: `${process.env.PUBLIC_URL}/rack.mp3`,
  },
  {
    korean: "라디오",
    english: "radio",
    audioUrl: `${process.env.PUBLIC_URL}/radio.mp3`,
  },
  {
    korean: "주거의",
    english: "residential",
    audioUrl: `${process.env.PUBLIC_URL}/residential.mp3`,
  },
  {
    korean: "반지",
    english: "ring",
    audioUrl: `${process.env.PUBLIC_URL}/ring.mp3`,
  },
  {
    korean: "방",
    english: "room",
    audioUrl: `${process.env.PUBLIC_URL}/room.mp3`,
  },
  {
    korean: "밧줄",
    english: "rope",
    audioUrl: `${process.env.PUBLIC_URL}/rope.mp3`,
  },
  {
    korean: "자",
    english: "ruler",
    audioUrl: `${process.env.PUBLIC_URL}/ruler.mp3`,
  },
  {
    korean: "화면",
    english: "screen",
    audioUrl: `${process.env.PUBLIC_URL}/screen.mp3`,
  },
  {
    korean: "나사",
    english: "screw",
    audioUrl: `${process.env.PUBLIC_URL}/screw.mp3`,
  },
  {
    korean: "드라이버",
    english: "screwdriver",
    audioUrl: `${process.env.PUBLIC_URL}/screwdriver.mp3`,
  },
  {
    korean: "선반",
    english: "shelf",
    audioUrl: `${process.env.PUBLIC_URL}/shelf.mp3`,
  },
  {
    korean: "신발",
    english: "shoe",
    audioUrl: `${process.env.PUBLIC_URL}/shoe.mp3`,
  },
  {
    korean: "표지판",
    english: "sign",
    audioUrl: `${process.env.PUBLIC_URL}/sign.mp3`,
  },
  {
    korean: "비누",
    english: "soap",
    audioUrl: `${process.env.PUBLIC_URL}/soap.mp3`,
  },
  {
    korean: "납땜",
    english: "solder",
    audioUrl: `${process.env.PUBLIC_URL}/solder.mp3`,
  },
  {
    korean: "스피커",
    english: "speaker",
    audioUrl: `${process.env.PUBLIC_URL}/speaker.mp3`,
  },
  {
    korean: "숟가락",
    english: "spoon",
    audioUrl: `${process.env.PUBLIC_URL}/spoon.mp3`,
  },
  {
    korean: "제곱",
    english: "squared",
    audioUrl: `${process.env.PUBLIC_URL}/squared.mp3`,
  },
  {
    korean: "우표",
    english: "stamp",
    audioUrl: `${process.env.PUBLIC_URL}/stamp.mp3`,
  },
  {
    korean: "돌",
    english: "stone",
    audioUrl: `${process.env.PUBLIC_URL}/stone.mp3`,
  },
  {
    korean: "탁자",
    english: "table",
    audioUrl: `${process.env.PUBLIC_URL}/table.mp3`,
  },
  {
    korean: "테이프",
    english: "tape",
    audioUrl: `${process.env.PUBLIC_URL}/tape.mp3`,
  },
  {
    korean: "시험",
    english: "test",
    audioUrl: `${process.env.PUBLIC_URL}/test.mp3`,
  },
  {
    korean: "티켓",
    english: "ticket",
    audioUrl: `${process.env.PUBLIC_URL}/ticket.mp3`,
  },
  {
    korean: "타일",
    english: "tile",
    audioUrl: `${process.env.PUBLIC_URL}/tile.mp3`,
  },
  {
    korean: "도구",
    english: "tool",
    audioUrl: `${process.env.PUBLIC_URL}/tool.mp3`,
  },
  {
    korean: "수건",
    english: "towel",
    audioUrl: `${process.env.PUBLIC_URL}/towel.mp3`,
  },
  {
    korean: "나무",
    english: "tree",
    audioUrl: `${process.env.PUBLIC_URL}/tree.mp3`,
  },
  {
    korean: "금고",
    english: "vault",
    audioUrl: `${process.env.PUBLIC_URL}/vault.mp3`,
  },
  {
    korean: "지갑",
    english: "wallet",
    audioUrl: `${process.env.PUBLIC_URL}/wallet.mp3`,
  },
  {
    korean: "시계",
    english: "watch",
    audioUrl: `${process.env.PUBLIC_URL}/watch.mp3`,
  },
  {
    korean: "쐐기",
    english: "wedge",
    audioUrl: `${process.env.PUBLIC_URL}/wedge.mp3`,
  },
  {
    korean: "창문",
    english: "window",
    audioUrl: `${process.env.PUBLIC_URL}/window.mp3`,
  },
  {
    korean: "철사",
    english: "wire",
    audioUrl: `${process.env.PUBLIC_URL}/wire.mp3`,
  },
  {
    korean: "작업",
    english: "task",
    audioUrl: `${process.env.PUBLIC_URL}/task.mp3`,
  },
];

const Round1 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState("instruction");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [audio] = useState(new Audio());
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [userInput, setUserInput] = useState("");

  // playAudio 함수 유지
  const playAudio = async () => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.src = mockWords[currentWordIndex].audioUrl;

      await new Promise((resolve) => {
        audio.oncanplaythrough = resolve;
        audio.load();
      });

      await audio.play();
    } catch (error) {
      console.error("오디오 재생 중 오류:", error);
    }
  };

  const showNextWord = () => {
    if (stage === "instruction") {
      setStage("cross");
      setTimeout(() => {
        setStage("word");
      }, 500);
    }
  };

  // 타이머 로직
  useEffect(() => {
    let timer;
    let countdownTimer;

    if (stage === "word") {
      setTimeLeft(5);
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
        if (currentWordIndex < mockWords.length - 1) {
          setStage("cross");
          setCurrentWordIndex((prev) => prev + 1);

          setTimeout(() => {
            setStage("word");
          }, 500);
        } else {
          setStage("completed");
          setIsCompleted(true);
        }
      }, 5000);

      return () => {
        clearInterval(countdownTimer);
        clearTimeout(timer);
      };
    }
  }, [stage, currentWordIndex]);

  // 스페이스바 이벤트 핸들러
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        if (stage === "instruction") {
          showNextWord();
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

  // 오디오 재생
  useEffect(() => {
    if (stage === "word") {
      playAudio();
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [stage, currentWordIndex]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (currentWordIndex < mockWords.length - 1) {
      setStage("cross");
      setCurrentWordIndex((prev) => prev + 1);
      setTimeout(() => {
        setStage("word");
      }, 500);
    } else {
      setStage("completed");
      setIsCompleted(true);
    }
  };

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

      {/* Content Area */}
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
            지금부터 본 시행을 시작합니다.
            <br />
            스페이스바를 눌러주세요.
          </p>
        )}

        {stage === "completed" && (
          <p style={{ fontSize: "60px", textAlign: "center" }}>
            실험이 완료되었습니다.
            <br />
            스페이스바를 눌러 메뉴로 돌아가세요.
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

        {stage === "word" && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "100px", marginBottom: "20px" }}>
              {mockWords[currentWordIndex].korean}
            </p>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                fontSize: "24px",
                padding: "10px",
                width: "300px",
                textAlign: "center",
                marginBottom: "20px",
              }}
              autoFocus
              placeholder="단어를 입력하세요"
            />
            <p style={{ fontSize: "24px", marginBottom: "20px" }}>
              남은시간: {timeLeft}초
            </p>
            <button
              onClick={handleSubmit}
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
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Round1;
