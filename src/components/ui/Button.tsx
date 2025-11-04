import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({ variant = "solid", className = "", children, fullWidth = false, disabled, ...rest }) => {
  const solidBase = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-shadow";
  const solidColors = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed";
  const outlineColors = "px-3 py-1 border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus:ring-gray-300 disabled:opacity-60 disabled:cursor-not-allowed";

  const classes = `${fullWidth ? "w-full" : "inline-flex"} items-center justify-center ${solidBase} ${variant === "solid" ? solidColors : outlineColors} ${className}`;

  return (
    <button className={classes} aria-disabled={disabled} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
