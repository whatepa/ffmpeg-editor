import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";

const Popup = ({ isOpen, onClose, message }) => {
  const modalClass = isOpen ? "fixed inset-20 flex items-center justify-center" : "hidden";

  return (
    <div className={`${modalClass} z-50`}>
      <div className="fixed inset-0 opacity-50 bg-zinc-950"></div>
      <div className="z-10 w-1/2 p-6 text-center rounded-lg bg-zinc-950">
        <div className="flex justify-end">
          <button className="" onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-zinc-200 hover:text-red-500" />
          </button>
        </div>
        <div className=" text-zinc-200">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
