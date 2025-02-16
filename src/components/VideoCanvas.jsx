import React, { useEffect, useRef, useState } from "react";
import VideoControls from "./videoComponents/VideoControls";

function VideoCanvas({ videoFile, onRange }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");

    const setupVideo = () => {
      if (videoFile) {
        video.src = URL.createObjectURL(videoFile);
        video.load();
      }
    };

    const handleMetadata = () => {
      canvas.width = 1280;
      canvas.height = 720;

      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = canvas.width / canvas.height;

      let renderWidth = canvas.width;
      let renderHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (videoAspect > canvasAspect) {
        renderHeight = canvas.width / videoAspect;
        offsetY = (canvas.height - renderHeight) / 2;
      } else {
        renderWidth = canvas.height * videoAspect;
        offsetX = (canvas.width - renderWidth) / 2;
      }

      canvas.renderWidth = renderWidth;
      canvas.renderHeight = renderHeight;
      canvas.offsetX = offsetX;
      canvas.offsetY = offsetY;

      setDuration(video.duration);
      video.play();
      video.pause();
    };

    const drawFrame = () => {
      context.fillStyle = "#09090b";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(
        video,
        canvas.offsetX,
        canvas.offsetY,
        canvas.renderWidth,
        canvas.renderHeight
      );

      requestAnimationFrame(drawFrame);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      progressBarRef.current.value = video.currentTime;
      if (video.currentTime >= video.duration) {
        setPlaying(false);
      }
    };

    setupVideo();
    video.onloadedmetadata = handleMetadata;
    video.onplay = drawFrame;
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoFile]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleProgressChange = () => {
    if (!videoRef.current || !progressBarRef.current) return;

    videoRef.current.currentTime = progressBarRef.current.value;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleVolumeChange = (event) => {
    if (!videoRef.current) return;

    const newVolume = event.target.value;
    setCurrentVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleMuteClick = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setMuted(!muted);
    setCurrentVolume(muted ? 1 : 0);
  };

  return (
    <div className="flex flex-col text-zinc-200">
      <canvas
        className="w-full h-full border-2 rounded border-zinc-950"
        onClick={handlePlayPause}
        ref={canvasRef}
      />
      <VideoControls
        playing={playing}
        currentTime={currentTime}
        duration={duration}
        currentVolume={currentVolume}
        muted={muted}
        videoRef={videoRef}
        progressBarRef={progressBarRef}
        onPlayClick={handlePlayPause}
        onPauseClick={handlePlayPause}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
        onMuteClick={handleMuteClick}
        onRange={onRange}
      />
      <video ref={videoRef} className="hidden" />
    </div>
  );
}

export default VideoCanvas;
