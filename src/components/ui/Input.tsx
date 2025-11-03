import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

const Input: React.FC<InputProps> = ({ label, error, ...rest }) => (
  <div>
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <input
      {...rest}
      className={`w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${error ? "border-red-400" : "border-gray-200"}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default Input;
