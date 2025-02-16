import Slider from "rc-slider";
import React, { useEffect, useRef, useState } from "react";

function RangeSliderComponent({ video, onRange }) {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);

  const rangeRef = useRef({
    start: 0,
    end: 100,
  });

  useEffect(() => {
    onRange(rangeRef.current.start, rangeRef.current.end, video.duration);
  }, [rangeRef.current.start, rangeRef.current.end, video.duration]);
  // useEffect(() => {}, [rangeRef.current.start, rangeRef.current.end]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 6000);
    seconds = (seconds % 6000).toFixed(0);
    return `${minutes}:${String(seconds).padStart(3, "0")}`;
  }

  return (
    <div className="flex items-center col-span-12 px-6 py-1 gap-x-1 bg-zinc-950 ">
      <Slider
        className="hover:cursor-pointer"
        range
        allowCross={false}
        draggableTrack={true}
        defaultValue={[0, 100]}
        onChange={([start, end]) => {
          rangeRef.current = { start, end };
          onRange(rangeRef.current.start, rangeRef.current.end, video.duration);
          setStart(rangeRef.current.start);
          setEnd(rangeRef.current.end);
        }}
      />
      <p className="pl-2">
        {formatTime(start * video.duration)}/{formatTime(end * video.duration)}
      </p>
    </div>
  );
}

export default RangeSliderComponent;
