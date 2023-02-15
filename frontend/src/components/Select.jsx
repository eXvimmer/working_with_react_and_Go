import React from "react";

function Select({
  title,
  name,
  value,
  handleChange,
  errorDiv,
  errorMsg,
  className,
  placeholder = "Choose...",
  options,
}) {
  return (
    <>
      {" "}
      <div className="mb-3">
        <label htmlFor={name} className="form-label">
          {title}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={`form-select ${className}`}
        >
          <option className="form-select" value="">
            {placeholder}
          </option>
          {options.map((o) => (
            <option
              key={o.id}
              className="form-select"
              value={o.id}
              label={o.value}
            >
              {o.value}
            </option>
          ))}
        </select>
      </div>
      <div className={errorDiv}>{errorMsg}</div>
    </>
  );
}

export default Select;
