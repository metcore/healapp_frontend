'use client'
import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Input from "../input/Input";

export default function ColorPicker({label}) {
  const [color, setColor] = useState("#aabbcc");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // tutup kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative inline-block" ref={pickerRef}>
      {/* Input trigger */}
      <Input
        label={label}
        value={color}
        onFocus={() => setShowPicker(true)}
        onBlur={() => setShowPicker(false)}
        readOnly
      />

      {/* Picker muncul di atas */}
      {showPicker && (
        <div className="absolute left-0 bottom-full mb-2 z-50  p-2">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      )}
    </div>
  );
}
