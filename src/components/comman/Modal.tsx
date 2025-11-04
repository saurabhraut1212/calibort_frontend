import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ open, onClose, title, children }) => {
if (!open) return null;
return (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="absolute inset-0 bg-black/40"
      onClick={onClose}
      aria-hidden="true"
    />
    <div className="relative z-10 bg-white rounded-xl shadow-lg w-full max-w-md p-5">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
      <button
        className="absolute top-2 right-3 text-gray-400 hover:text-black"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  </div>
);
}

export default Modal;
