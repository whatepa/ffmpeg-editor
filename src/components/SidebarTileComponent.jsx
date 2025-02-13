import React from "react";

function SidebarTile({ tile }) {
  return (
    <div className="flex-auto text-center rounded-lg text-zinc-200 bg-zinc-800 hover:bg-zinc-700 ">
      {tile}
    </div>
  );
}

export default SidebarTile;
