"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: any
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button className="bg-slate-700 text-white p-1 px-4 rounded-md" onClick={onClick}>
      {children}
    </button>
  );
};
