import React from "react";

const Modal2 = ({ open, onClose, title, children, width = "w-96", funct }) => {
  if (!open) return null;

  const handleClose = () => {
    onClose();
    if (funct) funct();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleClose}
      ></div>

      {/* Modal content */}
      <div
        className={`relative bg-base-200 rounded-xl shadow-xl transform transition-all duration-300 scale-100 opacity-100 ${width} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="p-4 border-b border-base-300">
            <h2 className="font-bold text-lg">{title}</h2>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-4">{children}</div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300">
          <button
            className="btn btn-neutral btn-sm btn-block"
            onClick={handleClose}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
