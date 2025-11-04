import React from "react";

type Props = {
  name: string;
  label?: string;
  error?: string | null;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
};

const FormField: React.FC<Props> = ({
  name,
  label,
  error = null,
  type = "text",
  placeholder,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-md bg-white border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
