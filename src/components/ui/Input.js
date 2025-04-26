function Input({ label, type = 'text', value, onChange, required = false, className = '', placeholder = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block mb-1 text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

export default Input;
