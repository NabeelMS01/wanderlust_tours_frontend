function Input({ label, name, value, onChange, type = "text", placeholder, className = "" }) {
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`border rounded-md px-4 py-2 ${className}`}
      />
    </div>
  );
}

export default Input;
