// components/IconField.jsx
import React from "react";

export default function IconField({ as: Comp = "input", icon: Icon, className = "", ...props }) {
  return (
    <div className="relative flex-1">
      <Comp
        {...props}
        className={`pl-10 border px-3 py-2 rounded shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      />
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
}
