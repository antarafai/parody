import React, { useEffect, useRef } from 'react';

const LoadingModal = ({ isVisible, messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex flex-col items-center justify-center z-50">
      <h2 className="text-2xl font-orbitron font-bold text-yellow-800 mb-4">Processing...</h2>
      <div className="bg-black glow p-4 rounded shadow-lg w-full max-w-md max-h-80 overflow-y-auto">
        <div className="text-accent font-orbitron mb-4">
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;