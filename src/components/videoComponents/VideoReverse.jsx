import React from "react";

function VideoReverse({ onReverse }) {
  return (
    <div className="text-center">
      <button
        className="p-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        onClick={onReverse}
      >
        Reverse
      </button>
    </div>
  );
}

export default VideoReverse;
