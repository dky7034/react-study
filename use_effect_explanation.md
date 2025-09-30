# useEffect Hook: 리액트의 부수 효과(Side Effect) 마스터하기

이 문서는 React의 강력한 기능 중 하나인 `useEffect` Hook을 깊이 있게 다룹니다. `useEffect`는 컴포넌트의 렌더링과 직접적인 관련이 없는 작업, 즉 **부수 효과(Side Effect)**를 처리하기 위한 핵심 도구입니다. 이 문서를 통해 `useEffect`의 정확한 동작 원리와 필요성을 이해하고, 실무에서 마주할 수 있는 다양한 상황에 대처하는 방법을 학습할 수 있습니다.

## 학습 목표

- `useEffect`의 기본 동작 원리와 필요성 이해
- 의존성 배열(Dependency Array)의 세 가지 사용법 마스터
- `useEffect` 내부에서 비동기(async/await) 코드를 올바르게 처리하는 방법 학습
- 데이터 패칭(Data Fetching)과 컨테이너/프레젠테이셔널 패턴 이해

## 사전 학습

이 문서를 더 잘 이해하기 위해 다음 내용에 대한 기본 지식이 필요합니다.

- React 컴포넌트의 생명주기 및 렌더링 과정
- `useState` Hook의 기본 사용법
- JavaScript 비동기 처리 (Promise, async/await)

---

## 1. `useEffect`란 무엇인가?

`useEffect`는 특정 데이터(state, props)를 감시하고, 해당 데이터가 변경될 때마다 특정 로직(콜백 함수)을 실행하여 부수 효과를 처리하는 Hook입니다.

> **리액트의 부수 효과(Side Effect)란?**
> 컴포넌트가 렌더링된 후 실행해야 하는, 렌더링 자체와는 무관한 모든 작업을 의미합니다. 대표적인 예시는 다음과 같습니다.
>
> - 서버로부터 데이터 가져오기 (Data Fetching)
> - 타이머 설정 및 해제 (setTimeout, setInterval)
> - 웹 스토리지(localStorage, sessionStorage) 관리
> - DOM 직접 조작

### 기본 구조

`useEffect`는 두 개의 인자를 받습니다: 부수 효과를 정의하는 **콜백 함수**와, 콜백 함수의 실행 조건을 결정하는 **의존성 배열**입니다.

```jsx
import { useEffect } from "react";

export default function Component() {
  useEffect(
    () => {
      // 부수 효과를 처리하는 콜백 함수 (Effect Function)
    },
    [] // 의존성 배열 (Dependency Array) : 감시할 데이터를 담는 배열
  );
}
```

---

## 2. 의존성 배열 (Dependency Array) 완벽 이해

의존성 배열은 `useEffect`의 동작을 제어하는 가장 중요한 부분입니다. 이 배열을 어떻게 설정하느냐에 따라 콜백 함수의 실행 시점이 완전히 달라집니다.

### Case 1: 의존성 배열이 없는 경우

의존성 배열을 생략하면, **컴포넌트가 렌더링될 때마다** 콜백 함수가 실행됩니다. 이는 state 변경, props 변경 등 모든 렌더링에 해당합니다. 이 방식은 의도치 않은 무한 루프를 유발하기 쉬워 **실제로 거의 사용하지 않습니다.**

```jsx
useEffect(() => {
  console.log("컴포넌트가 렌더링될 때마다 실행됩니다.");
}); // 의존성 배열 없음
```

### Case 2: 빈 배열(`[]`)인 경우

의존성 배열에 빈 배열을 전달하면, 콜백 함수는 **컴포넌트가 최초로 렌더링될 때 단 한 번만** 실행됩니다. 이는 초기 데이터 로딩, 이벤트 리스너 설정 등 최초 한 번만 필요한 작업을 수행할 때 유용합니다.

```jsx
// src/components/UseEffect/EmptyDependency.jsx
import { useEffect, useState } from "react";

export default function EmptyDependency() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 이 부분은 최초 렌더링 시에만 실행됩니다.
    console.log("컴포넌트 최초 렌더링 완료!");
  }, []);

  return (
    <div>
      <h1>빈 의존성 배열</h1>
      <p>count: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

### Case 3: 배열에 감시할 데이터를 전달하는 경우

의존성 배열에 특정 state나 props를 전달하면, 콜백 함수는 **최초 렌더링 시 한 번 실행되고, 이후에는 배열 안의 데이터가 변경될 때마다** 다시 실행됩니다. 이는 특정 값의 변화에 반응하여 부수 효과를 실행해야 할 때 사용됩니다.

```jsx
// src/components/UseEffect/Counter.jsx
import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  // count 값이 변경될 때마다 콜백 함수가 실행됩니다.
  useEffect(() => {
    console.log(`count 값이 ${count} (으)로 변경되었습니다.`);
  }, [count]);

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

---

## 3. `useEffect` 사용 규칙

`useEffect`를 올바르게 사용하기 위해 반드시 지켜야 할 몇 가지 규칙이 있습니다.

### 규칙 1: 비동기 함수는 직접 `async`로 정의할 수 없다

`useEffect`의 콜백 함수는 직접 `async` 함수로 선언할 수 없습니다. 이는 `useEffect`가 반환할 수 있는 "클린업(cleanup) 함수"가 동기적으로 실행되어야 하기 때문입니다. `async` 함수는 암묵적으로 Promise를 반환하므로 이 규칙에 위배됩니다.

따라서, 비동기 작업이 필요할 경우 **콜백 함수 내부에 별도의 `async` 함수를 정의하고 호출**해야 합니다.

- **❌ 잘못된 사용법**

  ```jsx
  useEffect(async () => {
    const data = await fetchData();
    setData(data);
  }, []);
  ```

- **✅ 올바른 사용법**

  ```jsx
  // src/components/UseEffect/PostList.jsx
  import { useEffect, useState } from "react";
  import axios from "axios";

  export default function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      // 1. 콜백 함수 내부에 비동기 함수를 정의
      async function fetchData() {
        const response = await axios.get("https://dummyjson.com/posts");
        setPosts(response.data.posts);
      }

      // 2. 정의한 비동기 함수를 호출
      fetchData();
    }, []);

    return (
      <div>
        <ul>
          {posts.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>
    );
  }
  ```

### 규칙 2: 무한 루프를 방지해야 한다

의존성 배열을 잘못 설정하면 컴포넌트가 끊임없이 리렌더링되는 무한 루프에 빠질 수 있습니다. 가장 흔한 실수는 **`useEffect` 내부에서 업데이트하는 상태를 의존성 배열에 포함**하는 것입니다.

- **❌ 무한 루프가 발생하는 코드**

  ```jsx
  // src/components/UseEffect/InfiniteLoop.jsx
  import { useEffect, useState } from "react";
  import axios from "axios";

  export default function InfiniteLoop() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const response = await axios.get("https://dummyjson.com/posts");
        // 1. posts 상태가 변경됨
        setPosts(response.data.posts);
      }

      fetchData();
      console.log("실행");
      // 2. posts가 변경되었으므로 useEffect가 다시 실행되어 무한 루프 발생
    }, [posts]);

    return <div>...</div>;
  }
  ```

### 규칙 3: 콜백 함수에 사용된 모든 state와 props는 의존성 배열에 포함해야 한다

`useEffect` 콜백 함수 내부에서 참조하는 모든 state와 props는 의존성 배열에 포함하는 것이 원칙입니다. 이를 통해 React는 항상 최신 상태의 값(stale하지 않은 값)을 사용하여 부수 효과를 실행할 수 있습니다.

- **❌ 의존성 배열 누락 (버그 발생)**

  `isAdmin`이나 `isLogin`이 변경되어도 `useEffect`가 다시 실행되지 않아 `userAuth` 상태가 업데이트되지 않는 버그가 발생합니다.

  ```jsx
  // src/components/UseEffect/UserInfo.jsx (Bad)
  useEffect(() => {
    if (isAdmin === true && isLogin === true) {
      setUserAuth("관리자");
    } else {
      setUserAuth("일반 사용자 또는 비로그인");
    }
  }, []); // isAdmin, isLogin 누락
  ```

- **✅ 올바른 사용법**

  `isAdmin` 또는 `isLogin`이 변경될 때마다 `useEffect`가 실행되어 `userAuth` 상태를 올바르게 업데이트합니다.

  ```jsx
  // src/components/UseEffect/UserInfo.jsx (Good)
  useEffect(() => {
    if (isAdmin === true && isLogin === true) {
      setUserAuth("관리자");
    } else if (isAdmin === false && isLogin === true) {
      setUserAuth("일반 사용자");
    } else {
      setUserAuth("비 로그인");
    }
  }, [isAdmin, isLogin]); // 모든 의존성 포함
  ```

---

## 4. 실용 예제: 데이터 패칭과 컨테이너/프레젠테이셔널 패턴

웹 서버에서 데이터를 가져와 화면에 표시하는 데이터 패칭은 `useEffect`의 가장 대표적인 활용 사례입니다. 이때 **컨테이너/프레젠테이셔널 패턴**을 적용하면 코드를 더 깔끔하고 재사용 가능하게 만들 수 있습니다.

이 패턴은 컴포넌트를 두 종류로 분리합니다.

1.  **컨테이너 컴포넌트**: 데이터 관리와 로직을 담당 (데이터를 어떻게 가져올지)
2.  **프레젠테이셔널 컴포넌트**: 데이터를 화면에 어떻게 보여줄지 담당 (UI)

### 컨테이너 컴포넌트 구현

`useEffect`를 사용해 서버로부터 데이터를 가져오고, `useState`로 상태를 관리합니다. 가져온 데이터는 프레젠테이셔널 컴포넌트에 props로 전달합니다.

```jsx
// src/components/DataFetching/PostList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";

// 데이터 로직을 담당하는 컨테이너 컴포넌트
export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://dummyjson.com/posts");
      setPosts(response.data.posts);
    }
    fetchData();
  }, []);

  return (
    <div>
      <ul>
        {/* 데이터를 화면에 표시하는 역할은 Presentational 컴포넌트에 위임 */}
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
```

### 프레젠테이셔널 컴포넌트 구현

오직 UI 렌더링에만 집중합니다. 데이터를 props로 받아 화면에 어떻게 표시할지만을 정의합니다.

```jsx
// src/components/DataFetching/Post.jsx

// UI 표시를 담당하는 프레젠테이셔널 컴포넌트
export default function Post({ post }) {
  return (
    <li key={post.id}>
      No. {post.id} {post.title}
    </li>
  );
}
```
