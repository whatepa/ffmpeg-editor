import React from "react";

function Videosplit({ onSplit }) {
  return (
    <div className="text-center">
      <button className="p-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700" onClick={onSplit}>
        Split
      </button>
    </div>
  );
}

export default Videosplit;
