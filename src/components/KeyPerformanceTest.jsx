import React, { useState, memo } from "react";
import _ from "lodash";

// 각 리스트 아이템에 대한 컴포넌트입니다.
// 내부에 input을 두어 자신만의 상태를 가집니다.
// memo()로 감싸서 props가 변경되지 않으면 리렌더링을 방지합니다.
// 이렇게 하면 key 변경에 따른 React의 동작을 더 명확히 관찰할 수 있습니다.
const StatefulItem = memo(({ item }) => {
  console.log(`Rendering Item: ${item.text}`);
  return (
    <li style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
      <span>{item.text}</span>
      {/*
        이 input은 비제어 컴포넌트입니다 (value prop 없음).
        따라서 input의 값은 DOM 자체에 저장됩니다.
        React가 이 DOM 노드를 재사용하면 input 값도 그대로 유지됩니다.
      */}
      <input
        type="text"
        placeholder="여기에 입력하여 상태를 확인하세요"
        style={{ marginLeft: "10px", width: "250px" }}
      />
    </li>
  );
});

const initialItems = [
  { id: "a", text: "항목 A" },
  { id: "b", text: "항목 B" },
  { id: "c", text: "항목 C" },
  { id: "d", text: "항목 D" },
];

// key 없이 렌더링하는 컴포넌트 (정확히는 index를 key로 사용)
function WithoutKeys() {
  const [items, setItems] = useState(initialItems);

  const shuffle = () => {
    // _.shuffle(items)는 원본 배열을 변경하지 않고 새로운 배열을 반환합니다.
    // 새로운 배열이 생성되므로 참조가 바뀌어 React가 상태 변경을 감지하고 리렌더링합니다.
    // 예: [A, B, C, D] → [C, A, D, B] (새 배열)
    setItems(_.shuffle(items));
  };

  return (
    <div style={{ border: "2px solid red", padding: "10px", width: "45%" }}>
      <h2>Key가 없는 경우 (문제 발생)</h2>
      <button
        onClick={shuffle}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-2"
      >
        리스트 섞기
      </button>
      <p>각 항목의 input에 아무 값이나 입력한 후 '리스트 섞기'를 눌러보세요.</p>
      <ul>
        {items.map((item, index) => (
          /*
            key={index}를 사용하면 React는 "위치"만 보고 컴포넌트를 판단합니다.

            예시:
            초기: 0번-항목A(input: "AAA"), 1번-항목B(input: "BBB"), 2번-항목C(비어있음)
            섞기 후: 0번-항목C, 1번-항목A, 2번-항목B

            React의 판단:
            - "0번 자리에 key=0이 있네? → 기존 컴포넌트 재사용, props만 변경"
            - "텍스트만 '항목 A' → '항목 C'로 변경"
            - input DOM은 그대로 재사용 → "AAA" 값이 그대로 남음

            결과: 항목C 옆에 "AAA"가 표시되는 버그 발생!
          */
          <StatefulItem key={index} item={item} />
        ))}
      </ul>
    </div>
  );
}

// key와 함께 렌더링하는 컴포넌트 (고유한 id를 key로 사용)
function WithKeys() {
  const [items, setItems] = useState(initialItems);

  const shuffle = () => {
    // 동일하게 새로운 배열을 반환하여 리렌더링을 트리거합니다.
    setItems(_.shuffle(items));
  };

  return (
    <div style={{ border: "2px solid green", padding: "10px", width: "45%" }}>
      <h2>Key가 있는 경우 (정상 동작)</h2>
      <button
        onClick={shuffle}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-2"
      >
        리스트 섞기
      </button>
      <p>각 항목의 input에 아무 값이나 입력한 후 '리스트 섞기'를 눌러보세요.</p>
      <ul>
        {items.map((item) => (
          /*
            key={item.id}를 사용하면 React는 각 컴포넌트의 "정체성"을 추적합니다.

            예시:
            초기: key="a"-항목A(input: "AAA"), key="b"-항목B(input: "BBB"), key="c"-항목C(비어있음)
            섞기 후: key="c"-항목C, key="a"-항목A, key="b"-항목B

            React의 판단:
            - "0번 자리에 key='c'가 왔네? → 'c' 컴포넌트를 찾아서 여기로 이동"
            - "1번 자리에 key='a'가 왔네? → 'a' 컴포넌트를 찾아서 여기로 이동"
            - 각 컴포넌트의 DOM과 상태를 모두 함께 이동

            결과: 항목C는 비어있고, 항목A는 "AAA", 항목B는 "BBB"를 정확히 유지!
          */
          <StatefulItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function KeyPerformanceTest() {
  return (
    <div>
      <h1>React Key 정확성 테스트</h1>
      <p>
        이 예제는 리스트의 순서가 변경될 때 `key` prop이 있고 없을 때 어떤
        차이가 발생하는지 보여줍니다.
      </p>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <WithoutKeys />
        <WithKeys />
      </div>
      <div style={{ marginTop: "20px", padding: "10px", background: "#eee" }}>
        <h3>테스트 방법</h3>
        <ol>
          <li>
            'Key가 없는 경우'와 'Key가 있는 경우' 각각의 리스트에 있는 input
            필드 몇 개에 고유한 텍스트를 입력합니다. (예: '항목 A'의 input에
            'AAA' 입력)
          </li>
          <li>각각의 '리스트 섞기' 버튼을 클릭합니다.</li>
        </ol>
        <h3>관찰 결과</h3>
        <ul>
          <li>
            <strong>Key가 없는 경우 (index as key):</strong> React는 `key`가
            없거나 `index`를 `key`로 사용하면 단순히 순서만 보고 컴포넌트를
            업데이트합니다. 따라서 컴포넌트의 위치는 그대로 있고 내용(text)만
            바뀝니다. 그 결과, 우리가 input에 입력했던 상태(AAA)는 그대로
            있는데, 그 앞의 텍스트 레이블만 바뀌는 문제가 발생합니다.
          </li>
          <li>
            <strong>Key가 있는 경우 (unique id as key):</strong> React는 고유한
            `key`('a', 'b', 'c', 'd')를 통해 어떤 항목이 어디로 이동했는지
            정확히 파악합니다. 따라서 컴포넌트 자체가 자신의 모든 상태(입력된
            텍스트 포함)를 가지고 올바른 위치로 이동합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
