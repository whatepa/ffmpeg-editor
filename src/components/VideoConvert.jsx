import React, { useState } from "react";

function VideoConvert({ onConvert }) {
  const [selectedFormat, setSelectedFormat] = useState("mp4");

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleConvertClick = () => {
    let contentType = "None";

    switch (selectedFormat) {
      case "mp3":
      case "wav":
        contentType = "audio";
        break;
      case "mov":
      case "mp4":
      case "webm":
        contentType = "video";
        break;
      case "gif":
        contentType = "image";
        break;
      default:
        break;
    }

    onConvert(selectedFormat, contentType);
  };

  return (
    <>
      <p className="col-start-2 row-start-3 mx-5">Convert</p>
      <div className="flex items-center justify-between col-span-1 col-start-2 gap-1 mx-7">
        <select
          className="p-1 text-white rounded-lg bg-zinc-800 focus-within:bg-white focus-within:text-zinc-950 lg:text-sm"
          onChange={handleFormatChange}
          value={selectedFormat}
        >
          <option value="mp4">MP4</option>
          <option value="webm">WEBM</option>
          <option value="mov">MOV</option>
          <option value="gif">GIF</option>
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>
        <button
          className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          onClick={handleConvertClick}
        >
          Apply
        </button>
      </div>
    </>
  );
}

export default VideoConvert;
