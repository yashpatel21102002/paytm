import React from 'react';

const RoundedButton = ({label="yash"}) => {
  return (
    <button
      className="bg-blue-500 text-white rounded-full px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
    
    >
      {label}
    </button>
  );
};

export default RoundedButton;
