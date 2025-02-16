import React, { useState } from "react";

function VideoRGB({ onRGB }) {
  const [redValue, setRedValue] = useState(1);
  const [greenValue, setGreenValue] = useState(1);
  const [blueValue, setBlueValue] = useState(1);

  const handleReset = () => {
    setRedValue(1);
    setGreenValue(1);
    setBlueValue(1);
  };

  return (
    <div className="flex items-center h-10 col-span-2 col-start-1 gap-1 mx-7">
      R
      <input
        className="w-3/4 rounded-lg appearance-none cursor-pointer slider"
        type="range"
        min={0}
        max={10}
        step={0.01}
        value={redValue}
        onChange={(e) => {
          setRedValue(e.target.value);
        }}
      />
      <input
        className="w-1/3 h-5 text-center text-white bg-zinc-800

 focus-within:bg-white focus-within:text-zinc-950 rounded-lg [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        min={0}
        max={10}
        step={0.01}
        value={redValue}
        onChange={(e) => {
          setRedValue(e.target.value);
        }}
      />
      G
      <input
        className="w-3/4 rounded-lg appearance-none cursor-pointer slider"
        type="range"
        min={0}
        max={10}
        step={0.01}
        value={greenValue}
        onChange={(e) => {
          setGreenValue(e.target.value);
        }}
      />
      <input
        className="w-1/3 h-5 text-center text-white bg-zinc-800

 focus-within:bg-white focus-within:text-zinc-950 rounded-lg [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        min={0}
        max={10}
        step={0.01}
        value={greenValue}
        onChange={(e) => {
          setGreenValue(e.target.value);
        }}
      />
      B
      <input
        className="w-3/4 rounded-lg appearance-none cursor-pointer slider"
        type="range"
        min={0}
        max={10}
        step={0.01}
        value={blueValue}
        onChange={(e) => {
          setBlueValue(e.target.value);
        }}
      />
      <input
        className="w-1/3 h-5 text-center text-white bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950 rounded-lg [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        min={0}
        max={10}
        step={0.01}
        value={blueValue}
        onChange={(e) => {
          setBlueValue(e.target.value);
        }}
      />
      <div className="grid mb-5">
        <button
          className="h-5 rounded-lg text-zinc-700 hover:text-zinc-600"
          onClick={() => handleReset()}
        >
          Reset
        </button>
        <button
          className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          onClick={() => onRGB(redValue, greenValue, blueValue)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default VideoRGB;
