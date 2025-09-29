import React from "react";
import { useState } from "react";

// 커스텀 훅
export default function useInput(initialValue = "") {
  const [input, setInput] = useState(initialValue);

  const onChange = (e) => {
    setInput(e.target.value);
  };

  // 배열로 반환해야 하므로 쉼표 연산자가 아닌 배열 리터럴 사용
  return [input, onChange];
}
