import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import Dropzone from "./components/Dropzone";
import Popup from "./components/Popup";
import RightSidebar from "./components/RightSidebarComponent";
import VideoCanvas from "./components/VideoCanvas";
import VideoUpload from "./components/VideoUploadComponent";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [output, setOutput] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [changes, setChanges] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileFormat, setFileFormat] = useState("");
  const [transcoding, setTranscoding] = useState(false);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);
  const [popMsg, setPopMsg] = useState("");

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.5/dist/esm";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("progress", ({ progress }) => {
      setTranscoding(true);
      messageRef.current.innerHTML = `${(progress * 100).toFixed(0)}%`;
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    setLoaded(true);
  };

  const tempsRef = useRef({
    video: null,
    output: null,
    change: null,
  });

  const rangeRef = useRef({
    start: 0,
    end: 0,
    duration: 0,
  });
  const operationRangeRef = useRef({
    operationStart: 0,
    operationEnd: 0,
    operationDuration: 0,
  });

  const videoDimensionsRef = useRef({
    width: 0,
    height: 0,
  });

  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef(null);

  useEffect(() => {
    load();
  }, []);

  const convertToSeconds = (proggress, duration) => {
    const seconds = (duration * proggress) / 100;
    return seconds.toFixed(4);
  };

  const handleUploadedVideo = (videoData) => {
    if (videoData) {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        videoDimensionsRef.current.width = video.videoWidth;
        videoDimensionsRef.current.height = video.videoHeight;
      };

      video.src = URL.createObjectURL(videoData);
    }
    setFileName(videoData.name.split(".")[0]);
    setFileFormat(videoData.name.split(".")[1]);
    setVideos([...videos, videoData]);
    setVideo(videoData);
  };

  const handleResult = (videoData, execResult, outputType, operation) => {
    if (videoData) {
      if (videoData.buffer["byteLength"] !== 0 && execResult === 0) {
        handleAddVideo(new File([videoData.buffer], { type: outputType }));
        handleAddOutput(new Blob([videoData.buffer], { type: outputType }));
        setChanges([...changes, operation]);
      } else {
        setPopMsg(operation + " failed");
        openPopup();
      }
    } else {
      setPopMsg("FFmpeg transcoding error.");
      openPopup();
    }
    setTranscoding(false);
  };

  const handleAddVideo = (vid) => {
    setVideos([...videos, vid]);
    setVideo(vid);
    tempsRef.current.video = null;
    tempsRef.current.change = null;
    tempsRef.current.output = null;
  };

  const handleAddOutput = (out) => {
    setOutputs([...outputs, out]);
    setOutput(out);
  };

  const handleRange = (start, end, duration) => {
    rangeRef.current.start = start;
    rangeRef.current.end = end;
    rangeRef.current.duration = duration;

    operationRangeRef.current.operationStart = convertToSeconds(start, duration);
    operationRangeRef.current.operationEnd = convertToSeconds(end, duration);
    operationRangeRef.current.operationDuration = (
      operationRangeRef.current.operationEnd - operationRangeRef.current.operationStart
    ).toFixed(4);
  };

  const handleTrim = async () => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    const trimStart = operationRangeRef.current.operationStart;
    const trimEnd = operationRangeRef.current.operationEnd;
    const trimDuration = operationRangeRef.current.operationDuration;
    let execResult, data;
    if (
      (trimStart !== rangeRef.current.start.toFixed(4) ||
        trimEnd !== rangeRef.current.duration.toFixed(4)) &&
      trimStart !== trimEnd
    ) {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-ss",
          `${trimStart}`,
          "-t",
          `${trimDuration}`,
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "trim");
    } else {
      setPopMsg("Range is not set.");
      openPopup();
    }
  };

  const handleConvertVideo = async (newFormat, newType) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    if (newFormat != fileFormat) {
      if (newFormat === "gif") {
        try {
          await ffmpeg.exec(["-i", name, "-filter_complex", "[0:v] palettegen", "palette.png"]);
          execResult = await ffmpeg.exec([
            "-i",
            name,
            "-i",
            "palette.png",
            "-filter_complex",
            "[0:v][1:v] paletteuse",
            "-preset",
            "ultrafast",
            "output.gif",
          ]);
          data = await ffmpeg.readFile(`output.gif`);
        } catch (er) {
          setPopMsg(er);
          openPopup();
        }
      } else {
        try {
          execResult = await ffmpeg.exec([
            "-i",
            name,
            "-preset",
            "ultrafast",
            `output.${newFormat}`,
          ]);
          data = await ffmpeg.readFile(`output.${newFormat}`);
        } catch (er) {
          setPopMsg(er);
          openPopup();
        }
      }
      handleResult(data, execResult, `${newType}/${newFormat}`, `to ${newFormat}`);
    } else {
      setPopMsg(`Cannot convert ${fileFormat} to ${newFormat}.`);
      openPopup();
    }
  };

  const handleAddAudio = async (audio) => {
    const vname = video.name;
    const aname = audio.name;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(vname, await fetchFile(video));
    await ffmpeg.writeFile(aname, await fetchFile(audio));
    const start = convertToSeconds(rangeRef.current.start, rangeRef.current.duration) * 1000;
    let execResult, data;
    try {
      execResult = await ffmpeg.exec([
        "-y",
        "-i",
        vname,
        "-i",
        aname,
        "-filter_complex",
        `[1]adelay=
        ${start}|
        ${start}
        [aud];[0][aud]amix`,
        "-c:v",
        "copy",
        "-map",
        "0:v",
        "-map",
        "1:a",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-preset",
        "ultrafast",
        `output.${fileFormat}`,
      ]);
      data = await ffmpeg.readFile(`output.${fileFormat}`);
    } catch (er) {
      setPopMsg(er);
      openPopup();
    }
    handleResult(data, execResult, `video/${fileFormat}`, "add audio");
  };

  const handleRemoveAudio = async () => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    try {
      execResult = await ffmpeg.exec(["-i", name, "-c:v", "copy", "-an", `output.${fileFormat}`]);
      data = await ffmpeg.readFile(`output.${fileFormat}`);
    } catch (er) {
      setPopMsg(er);
      openPopup();
    }
    handleResult(data, execResult, `video/${fileFormat}`, "remove audio");
  };

  const handleVolumeChange = async (volume) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    if (volume !== 1) {
      let execResult, data;
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-af",
          "volume=" + volume,
          "-c:v",
          "copy",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "volume change");
    } else {
      setPopMsg("Set volume.");
      openPopup();
    }
  };

  const handlePlaybackSpeedChange = async (playbackSpeed) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    if (playbackSpeed != 1) {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-vf",
          "setpts=PTS/" + playbackSpeed,
          "-af",
          "atempo=" + playbackSpeed,
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "playback speed change");
    } else {
      setPopMsg("Playback speed cannot be equal to 1.");
      openPopup();
    }
  };

  const handleConcat = async (vid, first) => {
    const name1 = video.name;
    const name2 = vid.name;

    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name1, await fetchFile(video));
    await ffmpeg.writeFile(name2, await fetchFile(vid));
    const [n1, n2] = first ? [name2, name1] : [name1, name2];
    let execResult, data;
    if (first) {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          n1,
          "-i",
          n2,
          "-filter_complex",
          "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease:eval=frame,pad=1920:1080:-1:-1:color=black[v0]; \
           [1:v]scale=1920:1080:force_original_aspect_ratio=decrease:eval=frame,pad=1920:1080:-1:-1:color=black[v1]; \
           [v0][0:a][v1][1:a] concat=n=2:v=1:a=1 [v] [a]",
          "-map",
          "[v]",
          "-map",
          "[a]",
          "-s",
          "hd720",
          "-vcodec",
          "libx264",
          "-crf",
          "10",
          "-preset",
          "ultrafast",
          "-fps_mode",
          "vfr",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
    } else {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          n1,
          "-i",
          n2,
          "-filter_complex",
          `[0:v]scale=iw:ih:force_original_aspect_ratio=decrease:eval=frame[v0]; \
            [1:v]scale=${videoDimensionsRef.current.width}:${videoDimensionsRef.current.height}:
            force_original_aspect_ratio=decrease:eval=frame,
            pad=${videoDimensionsRef.current.width}:${videoDimensionsRef.current.height}:-1:-1:color=black[v1]; \
            [v0][0:a][v1][1:a] concat=n=2:v=1:a=1 [v] [a]`,
          "-map",
          "[v]",
          "-map",
          "[a]",
          "-s",
          "hd720",
          "-vcodec",
          "libx264",
          "-crf",
          "10",
          "-preset",
          "ultrafast",
          "-fps_mode",
          "vfr",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
    }
    handleResult(data, execResult, `video/${fileFormat}`, "concat");
  };

  const handleSplit = async () => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    const splitStart = operationRangeRef.current.operationStart;
    let execResult, data;

    if (
      splitStart !== rangeRef.current.start.toFixed(4) &&
      splitStart !== rangeRef.current.duration.toFixed(4)
    ) {
      try {
        await ffmpeg.exec([
          "-i",
          name,
          "-t",
          `${splitStart}`,
          "-c",
          "copy",
          `part1.${fileFormat}`,
          "-ss",
          `${splitStart}`,
          `part2.${fileFormat}`,
        ]);
        execResult = await ffmpeg.exec([
          "-i",
          `part2.${fileFormat}`,
          "-i",
          `part1.${fileFormat}`,
          "-filter_complex",
          "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1",
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "split");
    } else {
      setPopMsg("Set split start time.");
      openPopup();
    }
  };

  const handleAddImage = async (img, width, height) => {
    const vname = video.name;
    const iname = img.name;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(vname, await fetchFile(video));
    await ffmpeg.writeFile(iname, await fetchFile(img));
    const [w, h] = width != 0 && height != 0 ? [width, height] : ["(W-w)/2", "(H-h)/2"];
    const imageStart = operationRangeRef.current.operationStart;
    const imageEnd = operationRangeRef.current.operationEnd;
    const imageFormat = img.name.split(".")[1];

    if (imageStart !== imageEnd) {
      let execResult, data;
      if (imageFormat != "gif") {
        try {
          execResult = await ffmpeg.exec([
            "-i",
            vname,
            "-i",
            iname,
            "-filter_complex",
            `[0:v][1:v]overlay=${w}:${h}:enable='between(t,${imageStart},${imageEnd})'[v]`,
            "-map",
            "[v]",
            "-map",
            "0:a",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-preset",
            "ultrafast",
            `output.${fileFormat}`,
          ]);
          data = await ffmpeg.readFile(`output.${fileFormat}`);
        } catch (er) {
          setPopMsg(er);
          openPopup();
        }
        handleResult(data, execResult, `video/${fileFormat}`, "add image");
      } else {
        try {
          execResult = await ffmpeg.exec([
            "-i",
            vname,
            "-ignore_loop",
            "0",
            "-i",
            iname,
            "-filter_complex",
            `[0:v][1:v]overlay=${w}:${h}:shortest=1:enable='between(t,${imageStart},${imageEnd})'[v]`,
            "-map",
            "[v]",
            "-map",
            "0:a",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-preset",
            "ultrafast",
            `output.${fileFormat}`,
          ]);
          data = await ffmpeg.readFile(`output.${fileFormat}`);
        } catch (er) {
          setPopMsg(er);
          openPopup();
        }
        handleResult(data, execResult, `video/${fileFormat}`, "add image");
      }
    } else {
      setPopMsg("Start time cannot be equal to end time.");
      openPopup();
    }
  };

  const handleAdjust = async (adjustementName, value) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    if (
      (adjustementName === "brightness" && value != 0) ||
      (adjustementName === "contrast" && value != 1) ||
      (adjustementName === "saturation" && value != 1)
    ) {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-vf",
          `eq=${adjustementName}=${value}`,
          "-c:a",
          "copy",
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, adjustementName);
    } else {
      setPopMsg(`Set ${adjustementName} value.`);
      openPopup();
    }
  };

  const handleRGB = async (redValue, greenValue, blueValue) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    if (redValue != 1 || greenValue != 1 || blueValue != 1) {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-vf",
          `eq=gamma_r=${redValue}:gamma_g=${greenValue}:gamma_b=${blueValue}`,
          "-c:a",
          "copy",
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "color adjustement");
    } else {
      setPopMsg("Set color value.");
      openPopup();
    }
  };

  const handleBlur = async (blurRadius) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    if (blurRadius != 0) {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-vf",
          `boxblur=${blurRadius}`,
          "-c:a",
          "copy",
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "blur");
    } else {
      setPopMsg("Set blur value.");
      openPopup();
    }
  };

  const handleText = async (text, width, height, fontSize, fontColor) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    if (text && fontSize && fontColor) {
      try {
        await ffmpeg.writeFile(
          "arial.ttf",
          await fetchFile("https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf")
        );
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      const [w, h] = width != 0 && height != 0 ? [width, height] : ["(w-text_w)/2", "(h-text_h)/2"];
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-vf",
          `drawtext=fontfile=/arial.ttf:text='${text}':x=${w}:y=${h}:fontsize=${fontSize}:fontcolor=${fontColor}`,
          "-c:a",
          "copy",
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "text");
    } else {
      setPopMsg("All fields must be set.");
      openPopup();
    }
  };

  const handleReverse = async () => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    try {
      execResult = await ffmpeg.exec([
        "-i",
        name,
        "-vf",
        "reverse",
        "-af",
        "areverse",
        "-preset",
        "ultrafast",
        `output.${fileFormat}`,
      ]);
      data = await ffmpeg.readFile(`output.${fileFormat}`);
    } catch (er) {
      setPopMsg(er);
      openPopup();
    }
    handleResult(data, execResult, `video/${fileFormat}`, "reverse");
  };

  const handleRotate = async (operation) => {
    const { name } = video;
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(name, await fetchFile(video));
    let execResult, data;
    if (operation) {
      try {
        execResult = await ffmpeg.exec([
          "-i",
          name,
          "-vf",
          `${operation}`,
          "-preset",
          "ultrafast",
          `output.${fileFormat}`,
        ]);
        data = await ffmpeg.readFile(`output.${fileFormat}`);
      } catch (er) {
        setPopMsg(er);
        openPopup();
      }
      handleResult(data, execResult, `video/${fileFormat}`, "rotate");
    } else {
      setPopMsg("No operation selected.");
      openPopup();
    }
  };

  const undoChanges = () => {
    tempsRef.current.video = video;
    tempsRef.current.change = changes[changes.length - 1];
    tempsRef.current.output = output;
    videos.pop();
    changes.pop();
    setVideo(videos[videos.length - 1]);
    if (videos.length > 1) {
      outputs.pop();
      setOutput(outputs[outputs.length - 1]);
    } else {
      setOutput(null);
    }
  };

  const revertChanges = () => {
    setVideos([...videos, tempsRef.current.video]);
    setVideo(tempsRef.current.video);
    setChanges([...changes, tempsRef.current.change]);
    setOutputs([...outputs, tempsRef.current.output]);
    setOutput(tempsRef.current.output);

    tempsRef.current.video = null;
    tempsRef.current.change = null;
    tempsRef.current.output = null;
  };

  return (
    loaded && (
      <div className="grid h-screen mx-2 text-zinc-200 2xl:grid-cols-4 xl:grid-cols-5">
        {video ? (
          <>
            <div className="xl:col-span-4 2xl:col-span-3">
              <div className="grid h-10 grid-cols-4 bg-zinc-900">
                <VideoUpload onChange={handleUploadedVideo} />
                <input
                  className="col-span-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <div className="self-center col-span-1 text-end">
                  <button
                    className={`p-2 rounded bg-zinc-800 hover:bg-zinc-700 ${
                      videos.length > 1 ? "cursor-pointer" : "opacity-50 pointer-events-none"
                    }`}
                    onClick={videos.length > 1 ? undoChanges : undefined}
                  >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded bg-zinc-800 hover:bg-zinc-700 ${
                      tempsRef.current.video ? "cursor-pointer" : "opacity-50 pointer-events-none"
                    }`}
                    onClick={tempsRef.current.video ? revertChanges : undefined}
                  >
                    <ArrowUturnRightIcon className="w-5 h-5" />
                  </button>
                </div>
                <a
                  className={`flex items-center gap-1 p-2 rounded w-fit place-self-end bg-zinc-800 hover:bg-zinc-700 ${
                    output ? "cursor-pointer" : "opacity-50 pointer-events-none"
                  }`}
                  href={output ? URL.createObjectURL(output) : undefined}
                  download={output?.type === "video/mov" ? `${fileName}.mov` : fileName}
                >
                  <p className="hidden sm:inline">Download</p>
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </a>
              </div>
              <VideoCanvas
                transcoding={transcoding}
                messageRef={messageRef}
                videoFile={video}
                onTrim={handleTrim}
                onRange={handleRange}
              />
              <Popup isOpen={isPopupOpen} onClose={closePopup} message={popMsg} />
              {transcoding && (
                <div className="fixed inset-0 flex items-center justify-center w-full h-full opacity-50 bg-zinc-950">
                  <ArrowPathIcon className="w-10 h-10 animate-spin" />
                </div>
              )}
            </div>
            <RightSidebar
              videoProps={{
                onTrim: handleTrim,
                onSplit: handleSplit,
                onConcat: handleConcat,
                onAddImg: handleAddImage,
                onConvert: handleConvertVideo,
                onRotate: handleRotate,
                onAddText: handleText,
              }}
              audioProps={{
                onVolumeChange: handleVolumeChange,
                onAddAudio: handleAddAudio,
                onRemoveAudio: handleRemoveAudio,
              }}
              effectsProps={{
                onRGB: handleRGB,
                onBrightness: handleAdjust,
                onContrast: handleAdjust,
                onSaturation: handleAdjust,
                onBlur: handleBlur,
              }}
              playbackProps={{
                onPlaybackSpeedChange: handlePlaybackSpeedChange,
                onReverse: handleReverse,
              }}
            />
          </>
        ) : (
          output === null && (
            <div className="grid justify-center h-screen 2xl:col-start-2 2xl:col-span-2 xl:col-start-3 place-items-center">
              <Dropzone
                className="p-12 rounded-lg cursor-pointer md:p-24 w-max h-max bg-zinc-900 lg:hover:bg-zinc-800"
                onChange={handleUploadedVideo}
              />
            </div>
          )
        )}
      </div>
    )
  );
};

export default App;
