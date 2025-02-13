import React, { useState } from "react";

function VolumeChange({ onVolumeChange }) {
  const [sliderValue, setSliderValue] = useState(100);

  const handleSliderChange = (event) => {
    setSliderValue(parseInt(event.target.value, 10));
  };

  const handleReset = () => {
    setSliderValue(100);
  };

  return (
    <div className="flex items-center justify-around h-10 col-span-2 col-start-1 gap-1 mx-7">
      <input
        className="w-3/4 rounded-lg appearance-none cursor-pointer slider"
        type="range"
        min={0}
        max={200}
        step={1}
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <input
        className="w-1/3 h-5 text-center text-white bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950 rounded-lg [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        min={0}
        max={200}
        step={1}
        value={sliderValue}
        onChange={handleSliderChange}
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
          onClick={() => onVolumeChange(sliderValue / 100)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default VolumeChange;
