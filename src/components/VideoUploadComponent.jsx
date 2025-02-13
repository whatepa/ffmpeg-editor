import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
const VideoUpload = ({ onChange }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      onChange(file);
      e.target.value = null;
    }
  };
  return (
    <label className="flex items-center gap-1 p-2 rounded cursor-pointer w-fit text-zinc-200 bg-zinc-800 hover:bg-zinc-700">
      <input className="hidden" type="file" accept="video/*" onChange={handleFile} />
      Upload <ArrowUpTrayIcon className="w-5 h-5" />
    </label>
  );
};

export default VideoUpload;
