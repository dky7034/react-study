import React, { useState } from "react";
import Bulb from "./Bulb";

export default function LightSwitch() {
  const [light, setLight] = useState("OFF");

  const toggle = () => setLight((prev) => (prev === "ON" ? "OFF" : "ON"));

  return (
    <div>
      <Bulb light={light} />
      <button onClick={toggle}>{light === "ON" ? "끄기" : "켜기"}</button>
    </div>
  );
}
