import React from "react";

function RemoveAudio({ onRemoveAudio }) {
  return (
    <div className="text-center">
      <button
        className="p-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        onClick={onRemoveAudio}
      >
        Remove audio
      </button>
    </div>
  );
}

export default RemoveAudio;
