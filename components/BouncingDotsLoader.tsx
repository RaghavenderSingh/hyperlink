import React from "react";

const BouncingDotsLoader = () => {
  return (
    <span className="flex space-x-2 justify-center items-center dark:invert">
      <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
    </span>
  );
};

export default BouncingDotsLoader;
