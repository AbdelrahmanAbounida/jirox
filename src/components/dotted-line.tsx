import React from "react";

interface DottedLineProps {
  color?: string;
  height?: number;
  width?: number;
  gap?: number;
}

export default function DottedLine({ gap = 1 }: DottedLineProps) {
  return (
    <div
      className="w-full border-t border-2 border-dotted"
      style={{ borderSpacing: 12 }}
    />
  );
}
