import React, { useRef, useState } from "react";

function AddImage({ onAddImg }) {
  const fileInputRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleAddImg = () => {
    fileInputRef.current.click();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAddImg(file, width, height);
      setWidth(0);
      setHeight(0);
      e.target.value = null;
    }
  };

  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    setWidth(isNaN(newWidth) ? 0 : newWidth);
  };

  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10);
    setHeight(isNaN(newHeight) ? 0 : newHeight);
  };

  return (
    <>
      <p className="mx-5">Add Image</p>
      <div className="grid items-center grid-cols-2 col-start-1 mx-7">
        <label>
          W:
          <input
            className="w-1/2 h-5 ml-1 text-center text-white rounded-lg bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950"
            type="number"
            value={width}
            onChange={handleWidthChange}
          />
        </label>
        <label className="row-start-2 gap-1 ml-1">
          H:
          <input
            className="w-1/2 h-5 ml-1 text-center text-white rounded-lg bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950"
            type="number"
            value={height}
            onChange={handleHeightChange}
          />
        </label>
        <button
          className="col-start-2 row-span-2 p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          onClick={handleAddImg}
        >
          Add Image
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
        </button>
      </div>
    </>
  );
}

export default AddImage;
