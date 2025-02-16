import { ArrowsRightLeftIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

function VideoRotate({ onRotate }) {
  const [degree, setDegree] = useState(0);
  const [vertical, setVertical] = useState(false);
  const [horizontal, setHorizontal] = useState(false);

  const handleDegreeChange = (event) => {
    setDegree(event.target.value);
  };

  const handleCheckboxChange = (type) => {
    if (type === "vertical") {
      setVertical(!vertical);
    } else if (type === "horizontal") {
      setHorizontal(!horizontal);
    }
  };

  const getRotateValue = () => {
    if (degree !== 0) {
      return `rotate=${degree}*PI/180`;
    }
    return "";
  };

  const getFlipValue = () => {
    const flipValues = [];
    if (vertical) {
      flipValues.push("vflip");
    }
    if (horizontal) {
      flipValues.push("hflip");
    }
    return flipValues.join(",");
  };

  const handleRotate = () => {
    const rotateValue = getRotateValue();
    const flipValue = getFlipValue();

    const finalValue = [rotateValue, flipValue].filter(Boolean).join(",");

    onRotate(finalValue);
  };

  return (
    <>
      <p className="mx-5">Rotate</p>
      <div className="flex items-center justify-between col-span-2 col-start-1 gap-1 mx-7">
        <input
          className="w-1/3 h-5 text-center rounded-lg input"
          type="number"
          min={-359}
          max={359}
          step={1}
          value={degree}
          onChange={handleDegreeChange}
        />
        <label className="flex">
          <ArrowsUpDownIcon className="w-5" />
          <input
            className="w-4 h-4 mt-1 border-2 rounded-sm appearance-none bg-zinc-200 focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100 checked:bg-zinc-600 checked:border-0 disabled:border-steel-400 disabled:bg-zinc-200"
            type="checkbox"
            checked={vertical}
            onChange={() => handleCheckboxChange("vertical")}
          />
        </label>
        <label className="flex">
          <ArrowsRightLeftIcon className="w-5" />
          <input
            className="w-4 h-4 mt-1 border-2 rounded-sm appearance-none bg-zinc-200 focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100 checked:bg-zinc-600 checked:border-0 disabled:border-steel-400 disabled:bg-zinc-200"
            type="checkbox"
            checked={horizontal}
            onChange={() => handleCheckboxChange("horizontal")}
          />
        </label>
        <button
          className="p-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          onClick={handleRotate}
        >
          Rotate
        </button>
      </div>
    </>
  );
}

export default VideoRotate;
