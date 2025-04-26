function Button({ type = 'button', children, onClick, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`h-[42px] px-4 text-sm font-semibold rounded-md bg-primary text-white hover:bg-indigo-700 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
