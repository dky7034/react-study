import React from "react";
import { useState } from "react";
import useInput from "../hooks/useInput";

// 3가지 hook 관련 팁
// 1. 함수 컴포넌트, 커스텀 훅 내부에서만 호출 가능
// 2. 조건부로 호출될 수 없음
// 3. 나만의 훅(Custom Hook)을 직접 만들 수 있음
export default function HookExam() {
  const [input, onChange] = useInput("");

  return (
    <div>
      <input type="text" value={input} onChange={onChange} />
      <p>입력 값: {input}</p>
    </div>
  );
}
