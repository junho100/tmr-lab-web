import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription, AlertIcon } from "./Alert";

const ExperimentForm = ({ onLogin }) => {
  const [uniqueId, setUniqueId] = useState("");
  const [age, setAge] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleLogin = async () => {
    if (!uniqueId) return;

    setIsSubmitting(true);
    try {
      // API 호출 대신 임시로 성공 처리
      setSubmitResult({ status: "success", message: "로그인 성공" });
      onLogin(uniqueId);
    } catch (error) {
      setSubmitResult({
        status: "error",
        message: `로그인 실패: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    // 필수값 체크
    if (!age || !englishLevel || !specialNotes) {
      setSubmitResult({
        status: "error",
        message: "모든 필드를 입력해주세요.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: parseInt(age),
          english_level: englishLevel,
          detail: specialNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(`고유 아이디는 ${data.id_for_login}입니다.`);
      onLogin(data.id_for_login);
    } catch (error) {
      setSubmitResult({
        status: "error",
        message: `제출 중 오류가 발생했습니다: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 스타일 객체들을 여기에 추가합니다
  const formStyle = {
    maxWidth: "28rem",
    margin: "2.5rem auto",
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    marginTop: "0.25rem",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #d1d5db",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.5rem 1rem",
    marginTop: "1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div style={formStyle}>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        실험 참가자 정보
      </h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="uniqueId"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            고유 ID (로그인)
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              id="uniqueId"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              style={{ ...inputStyle, flexGrow: 1 }}
            />
            <button
              type="button"
              onClick={handleLogin}
              disabled={isSubmitting || !uniqueId}
              style={{
                ...buttonStyle,
                width: "auto",
                marginTop: 0,
                padding: "0.5rem 1rem",
                minWidth: "80px",
                opacity: isSubmitting || !uniqueId ? 0.5 : 1,
              }}
            >
              로그인
            </button>
          </div>
        </div>

        {/* 구분선 추가 */}
        <hr
          style={{
            margin: "1.5rem 0",
            border: "none",
            borderTop: "2px solid #000000", // 진한 검은색으로 변경
          }}
        />

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="age"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            연령 <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="englishLevel"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            영어 수준 <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="englishLevel"
            value={englishLevel}
            onChange={(e) => setEnglishLevel(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">선택해주세요</option>
            <option value="C2">C2</option>
            <option value="C1">C1</option>
            <option value="B2">B2</option>
            <option value="B1">B1</option>
            <option value="A2">A2</option>
            <option value="A1">A1</option>
            <option value="Pre-A1">Pre-A1</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="specialNotes"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            특이사항 <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            id="specialNotes"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows="3"
            style={inputStyle}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...buttonStyle,
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          {isSubmitting ? "제출 중..." : "제출 및 다음으로"}
        </button>
      </form>
      {submitResult && (
        <Alert
          style={{
            marginTop: "1rem",
            backgroundColor:
              submitResult.status === "success" ? "#d1fae5" : "#fee2e2",
          }}
        >
          <AlertIcon />
          <AlertTitle>
            {submitResult.status === "success" ? "성공" : "오류"}
          </AlertTitle>
          <AlertDescription>{submitResult.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExperimentForm;
