const InputComponent = ({ type, name, value, onChange, placeholder }) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="custom-input"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputComponent;
