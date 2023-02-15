import React from "react";

function Input({
  name,
  title,
  value,
  handleChange,
  className,
  errorDiv,
  errorMsg,
  type = "text",
  placeholder = "",
}) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className={`form-control ${className}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div className={errorDiv}>{errorMsg}</div>
    </div>
  );
}

export default Input;
