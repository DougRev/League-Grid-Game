"use client";

export default function Button({ children, className = "", ...props }) {
  return (
    <button className={`transition-colors ${className}`} {...props}>
      {children}
    </button>
  );
}
