import React from "react";
import "./styles.css";

const Button = ({ text, onClick, purple, disabled, icon }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={purple ? "btn-purple" : "btn"}
    >
      {!purple && icon}
      {text}
    </button>
  );
};

export default Button;
