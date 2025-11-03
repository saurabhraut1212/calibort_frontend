import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

const Button: React.FC<ButtonProps> = ({ variant = "solid", className = "", children, ...rest }) => {
  const base = "px-4 py-2 rounded-md font-medium focus:outline-none";
  const styles = variant === "solid" ? "bg-brand-500 text-white hover:bg-brand-600" : "border border-gray-300 text-gray-800";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
