import { useRef, useState } from "react";
// 간단한 회원가입 폼
// 1. 이름
// 2. 생년월일
// 3. 국적
// 4. 자기소개

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    birth: "",
    country: "",
    bio: "",
  });

  const countRef = useRef("0");
  const inputRef = useRef();

  let count = 0;

  // 통합 이벤트 핸들러 작성
  const onChange = (e) => {
    countRef.current++;
    console.log(countRef.current);
    setInput({
      ...input,
      [e.target.name]: e.target.value, // e.target.name이라는 이름으로 프로퍼티 키 값 설정
    });
  };

  const onsubmit = () => {
    if (input.name === "") {
      // console.log(inputRef.current);
      inputRef.current.focus();
    }
  };

  // const onChangeName = (e) => {
  //   setInput({ ...input, name: e.target.value });
  // };
  // const onChangeBirth = (e) => {
  //   setInput({ ...input, birth: e.target.value });
  // };
  // const onChangeCountry = (e) => {
  //   setInput({ ...input, country: e.target.value });
  // };
  // const onChangeBio = (e) => {
  //   setInput({ ...input, bio: e.target.value });
  // };

  return (
    <div>
      <div>
        <input
          ref={inputRef}
          value={input.name}
          onChange={onChange}
          type="text"
          placeholder={"이름"}
        />
      </div>
      <div>
        <input value={input.birth} onChange={onChange} type="date" />
        {input.birth}
      </div>

      <div>
        <select value={input.country} onChange={onChange}>
          <option value={""}></option>
          <option value={"kr"}>한국</option>
          <option value={"us"}>미국</option>
          <option value={"uk"}>영국</option>
          <option value={"ger"}>독일</option>
        </select>
        {input.country}
      </div>

      <div>
        <textarea value={input.bio} onChange={onChange}></textarea>
        {input.bio}
      </div>

      <button onClick={onsubmit}>버튼</button>
    </div>
  );
};

export default Register;
