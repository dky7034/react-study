import React from "react";

export default function Bulb({ light }) {
  const isOn = light === "ON";
  return (
    <div>
      {isOn ? (
        <h1 style={{ backgroundColor: "orange" }}>ON</h1>
      ) : (
        <h1 style={{ backgroundColor: "gray" }}>OFF</h1>
      )}
    </div>
  );
}
