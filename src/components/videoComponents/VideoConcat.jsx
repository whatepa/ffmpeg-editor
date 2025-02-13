import React, { useRef } from "react";

function VideoConcat({ onConcat }) {
  const fileInputRef = useRef(null);
  const checkboxRef = useRef(false);

  const handleAddVid = () => {
    fileInputRef.current.click();
  };

  const handleCheckboxChange = () => {
    checkboxRef.current = !checkboxRef.current;
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      onConcat(file, checkboxRef.current);
      e.target.value = null;
    }
  };

  return (
    <div className="flex items-center justify-center col-start-3 gap-2 text-center">
      <button className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700" onClick={handleAddVid}>
        Add Video
      </button>
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="video/*"
        onChange={handleFile}
      />
      <label className="text-zinc-200">
        <input
          type="checkbox"
          className="w-4 h-4 mt-1 border-2 rounded-sm appearance-none bg-zinc-200 focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100 checked:bg-zinc-600 checked:border-0 disabled:border-steel-400 disabled:bg-zinc-200"
          onChange={handleCheckboxChange}
        />
        first
      </label>
    </div>
  );
}

export default VideoConcat;
