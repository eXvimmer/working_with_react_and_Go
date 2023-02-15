import React from "react";

function Input({
  name,
  title,
  value,
  handleChange,
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
        className="form-control"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Input;
