import React from 'react';

const ExecProgressAlert = ({ isExecInProgress, renderProgress }) => {
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-yellow-500 text-black rounded-xl shadow-lg flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      {isExecInProgress ? (
        <span>Video rendering is still in progress ({renderProgress}%)</span>
      ) : (
        <span>No rendering job has been given</span>
      )}
    </div>
  );
};

const PromptError = ({ promptErrorMessage, onClose }) => {
  return (
    <div>
      <button className="fixed bottom-4 right-4 p-4 bg-yellow-500 text-black rounded-xl shadow-lg flex items-center space-x-2" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>{promptErrorMessage}</span>
      </button>
      
    </div>
  );
};

export { ExecProgressAlert, PromptError };
