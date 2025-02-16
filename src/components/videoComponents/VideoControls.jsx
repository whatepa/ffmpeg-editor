import { PauseIcon, PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import RangeSliderComponent from "../RangeSliderComponent";

function VideoControls({
  playing,
  currentTime,
  duration,
  currentVolume,
  muted,
  videoRef,
  progressBarRef,
  onPlayClick,
  onPauseClick,
  onProgressChange,
  onVolumeChange,
  onMuteClick,
  onRange,
}) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = (seconds % 60).toFixed(2);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const isMuted =
    (videoRef.current && muted) || (videoRef.current && videoRef.current.volume < 0.02);

  return (
    <div className="grid items-center grid-cols-12 grid-rows-3 gap-x-1 sm:gap-x-2 lg:gap-x-3 lg:grid-rows-1 bg-zinc-950">
      <button
        className="col-span-1 row-start-2 p-2 mx-auto rounded-full lg:mx-0 sm:ml-3 bg-zinc-200 text-zinc-800 lg:row-start-1"
        onClick={playing ? onPauseClick : onPlayClick}
      >
        {playing ? (
          <PauseIcon className="w-5 h-5 lg:mx-auto" />
        ) : (
          <PlayIcon className="w-5 h-5 lg:mx-auto" />
        )}
      </button>

      <input
        className="col-span-7 row-start-2 ml-2 rounded-lg appearance-none cursor-pointer sm:ml-1 lg:row-start-1 lg:col-span-6 xl:col-span-7 slider"
        type="range"
        ref={progressBarRef}
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={onProgressChange}
      />

      <div className="col-span-3 col-start-1 row-start-1 ml-3 lg:ml-0 lg:col-start-8 xl:col-start-9">
        {formatTime(currentTime)}/{formatTime(duration)}
      </div>

      <button
        className="col-span-1 row-start-2 p-2 mx-auto rounded-full lg:mx-0 lg:col-start-9 xl:col-start-10 lg:row-start-1 bg-zinc-800 hover:bg-zinc-700"
        onClick={onMuteClick}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="w-5 h-5 text-red-600 lg:mx-auto" />
        ) : (
          <SpeakerWaveIcon className="w-5 h-5 lg:mx-auto" />
        )}
      </button>

      <input
        className="w-3/4 col-span-3 row-start-2 appearance-none cursor-pointer lg:w-auto lg:col-span-2 xl:col-start-11 xl:col-span-1 lg:row-start-1 lg:col-start-10 slider"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={currentVolume}
        onChange={onVolumeChange}
      />

      <p className="col-start-9 row-start-1 lg:col-start-12">{(currentVolume * 100).toFixed(0)}%</p>
      {videoRef.current && <RangeSliderComponent video={videoRef.current} onRange={onRange} />}
    </div>
  );
}

export default VideoControls;
