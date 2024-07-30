import React from 'react';

const InputBar = ({ onButtonClick }) => {
  return (
    <div className="flex justify-center h-full w-full glow">
      <div className="flex justify-center items-center h-full w-3/4">
        <input
          type="text"
          id="modelPathsInput"
          placeholder="Enter model paths separated by commas"
          className="flex-grow p-2 mr-2 border border-accent rounded-l-full glow"
          style={{ fontSize: '12px' }} // Adjust this value to change the font size
        />
        <button id="Animate" className="btn glass p-2 bg-accent text-black rounded-r-full glow" onClick={onButtonClick}>
          Animate
        </button>
      </div>
    </div>
  );
};

export default InputBar;