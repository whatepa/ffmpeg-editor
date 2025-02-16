import React, { useState } from "react";

function VideoAddText({ onAddText }) {
  const [text, setText] = useState("text");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("white");

  const handleAddText = () => {
    onAddText(text, width, height, fontSize, fontColor);
  };

  return (
    <>
      <p className="mx-5">Add Text</p>
      <div className="grid items-center grid-cols-2 col-span-2 mx-7 ">
        <label>
          Width:
          <input
            className="w-1/2 h-5 text-center text-white rounded-lg sm:w-fit bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950"
            type="number"
            value={width}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setWidth(isNaN(value) ? 0 : value);
            }}
          />
        </label>
        <label>
          Size:
          <input
            className="w-1/2 h-5 text-center text-white rounded-lg sm:w-fit bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950"
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
          />
        </label>
        <label>
          Height:
          <input
            className="w-1/2 h-5 text-center text-white rounded-lg sm:w-fit bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950"
            type="number"
            value={height}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setHeight(isNaN(value) ? 0 : value);
            }}
          />
        </label>
        <label>
          Color:
          <input
            className="w-1/2 h-5 text-center text-white rounded-lg sm:w-fit bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950"
            type="text"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </label>
        <label>
          Text:
          <input
            className="w-1/2 h-5 text-center text-white rounded-lg sm:w-fit bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <button
          className="p-1 px-3 py-1 mt-auto rounded-lg place-self-center bg-zinc-800 hover:bg-zinc-700"
          onClick={handleAddText}
        >
          Add Text
        </button>
      </div>
    </>
  );
}

export default VideoAddText;
