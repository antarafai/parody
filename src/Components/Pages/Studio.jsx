import React from 'react';

const DesignerStudio = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="text-center py-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">Designer Studio</h1>
      </header>
      <div className="flex flex-1">
        {/* Toolbar */}
        <div className="w-16 bg-gray-200 flex flex-col items-center p-2 space-y-4 fixed h-full">
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
        </div>
        {/* Main Content */}
        <div className="flex-1 ml-16 p-4">
          {/* Video Player */}
          <div className="bg-gray-300 flex-1 flex items-center justify-center">
            <video
              className="w-full h-full"
              controls
              src="path-to-your-video.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          {/* Prompt Bar */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-l"
              placeholder="Enter your prompt here..."
            />
            <button className="w-16 bg-green-500 text-white rounded-r p-2">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerStudio;