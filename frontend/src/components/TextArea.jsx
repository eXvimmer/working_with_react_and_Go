function TextArea({
  name,
  value,
  handleChange,
  title,
  rows,
  className,
  errorDiv,
  errorMsg,
}) {
  return (
    <>
      <div className="mb-3">
        <label htmlFor={name} className="form-label">
          {title}
        </label>
        <textarea
          id={name}
          name={name}
          className={`form-control ${className}`}
          rows={rows}
          value={value}
          onChange={handleChange}
        />
      </div>

      <div className={errorDiv}>{errorMsg}</div>
    </>
  );
}

export default TextArea;
