import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const inc = () => {
    setCount((prev) => prev + 1);
    console.log(count); // 여기서는 이전 값이 찍힙니다(비동기 업데이트 특성)
  };

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={inc}>+</button>
    </div>
  );
}
