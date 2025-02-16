import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({ className, onChange }) {
  const onDrop = useCallback((files) => onChange(files[0]), [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/": [".mp4", ".mov", ".webm"],
    },
  });
  return (
    <div
      {...getRootProps({
        className: className,
      })}
    >
      <input {...getInputProps()} />
      <div>
        {isDragActive ? (
          <div className="flex items-center text-3xl font-bold">
            <h1> Drop the file here ...</h1>
            <ArrowUpTrayIcon className="w-10 h-10 ml-1" />
          </div>
        ) : (
          <span className="">
            <div className="flex items-center text-3xl font-bold">
              <h1>Click to upload</h1>
              <ArrowUpTrayIcon className="w-10 h-10 ml-1" />
            </div>
            <p className="hidden mt-3 text-xl sm:block">or, drag and drop a file here</p>
          </span>
        )}
      </div>
    </div>
  );
}
export default Dropzone;
