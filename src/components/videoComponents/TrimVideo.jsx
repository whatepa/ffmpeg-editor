import { ScissorsIcon } from "@heroicons/react/24/solid";
import React from "react";

function TrimVideo({ onTrim }) {
  return (
    <div className="flex justify-center col-start-1 mx-5 text-center ">
      <button
        className="flex items-center gap-1 p-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        onClick={onTrim}
      >
        <ScissorsIcon className="w-5" />
        <p>Trim</p>
      </button>
    </div>
  );
}

export default TrimVideo;
