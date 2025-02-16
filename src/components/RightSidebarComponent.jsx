import React from "react";
import ConvertVideo from "./VideoConvert";
import RemoveAudio from "./audioComponents/RemoveAudioComponent";
import AddAudio from "./audioComponents/VideoAddAudio";
import VolumeChange from "./audioComponents/VolumeChange";
import TrimVideo from "./videoComponents/TrimVideo";
import AddImage from "./videoComponents/VideoAddImage";
import VideoAddText from "./videoComponents/VideoAddText";
import VideoConcat from "./videoComponents/VideoConcat";
import VideoPlaybackSpeed from "./videoComponents/VideoPlaybackSpeed";
import VideoReverse from "./videoComponents/VideoReverse";
import VideoRotate from "./videoComponents/VideoRotate";
import VideoSplit from "./videoComponents/VideoSplit";
import VideoBlur from "./videoComponents/adjustements/VideoBlur";
import VideoBrightness from "./videoComponents/adjustements/VideoBrightness";
import VideoContrast from "./videoComponents/adjustements/VideoContrast";
import VideoRGB from "./videoComponents/adjustements/VideoRGB";
import VideoSaturation from "./videoComponents/adjustements/VideoSaturation";

const RightSidebar = ({
  videoProps: { onTrim, onSplit, onConcat, onAddImg, onConvert, onRotate, onAddText },
  audioProps: { onVolumeChange, onAddAudio, onRemoveAudio },
  effectsProps: { onRGB, onBrightness, onContrast, onSaturation, onBlur },
  playbackProps: { onPlaybackSpeedChange, onReverse },
}) => {
  return (
    <div className="grid bg-zinc-900">
      <div className="grid items-center grid-cols-2">
        <p className="mx-3 font-bold">Video</p>
        <div className="grid grid-cols-3 col-span-2 col-start-1">
          <TrimVideo onTrim={onTrim} />
          <VideoSplit onSplit={onSplit} />
          <VideoConcat onConcat={onConcat} />
        </div>
        <AddImage onAddImg={onAddImg} />
        <ConvertVideo onConvert={onConvert} />
        <VideoRotate onRotate={onRotate} />
        <VideoAddText onAddText={onAddText} />
      </div>

      <div className="grid items-center grid-cols-2">
        <p className="mx-3 font-bold">Adjust</p>
        <div className="flex flex-col items-center col-span-2 p-2 overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
          <div className="grid gap-2 py-2">
            <VideoRGB onRGB={onRGB} />
            <VideoBrightness onBrightness={onBrightness} />
            <VideoContrast onContrast={onContrast} />
            <VideoSaturation onSaturation={onSaturation} />
            <VideoBlur onBlur={onBlur} />
          </div>
        </div>
      </div>

      <div className="grid items-center grid-cols-2 gap-1">
        <p className="mx-3 font-bold">Audio</p>
        <VolumeChange onVolumeChange={onVolumeChange} />
        <AddAudio onAddAudio={onAddAudio} />
        <RemoveAudio onRemoveAudio={onRemoveAudio} />
      </div>

      <div className="grid items-center grid-cols-2">
        <p className="mx-3 font-bold">Playback</p>
        <VideoPlaybackSpeed onPlaybackSpeedChange={onPlaybackSpeedChange} />
        <VideoReverse onReverse={onReverse} />
      </div>
    </div>
  );
};

export default RightSidebar;
