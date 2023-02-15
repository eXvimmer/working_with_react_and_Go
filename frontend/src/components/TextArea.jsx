import React from "react";

function TextArea({ name, value, handleChange, title, rows }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <textarea
        id={name}
        name={name}
        className="form-control"
        rows={rows}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default TextArea;
