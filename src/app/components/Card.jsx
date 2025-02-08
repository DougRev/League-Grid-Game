"use client";

export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`border border-gray-600 rounded ${className}`}
      style={{ width: "70px", height: "70px" }}
      {...props}
    >
      {children}
    </div>
  );
}
