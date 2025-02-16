import React, { useRef } from "react";

function AddAudio({ onAddAudio }) {
  const fileInputRef = useRef(null);

  const handleAddAudio = () => {
    fileInputRef.current.click();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAddAudio(file);
      e.target.value = null;
    }
  };

  return (
    <div className="col-start-1 text-center">
      <button
        className="p-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        onClick={handleAddAudio}
      >
        Add audio
      </button>
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="audio/*"
        onChange={handleFile}
      />
    </div>
  );
}

export default AddAudio;
