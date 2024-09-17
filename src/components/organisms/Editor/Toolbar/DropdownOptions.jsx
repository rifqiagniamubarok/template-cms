import React, { useState } from 'react';

const DropdownOptions = ({ head, options }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <button className="relative" onBlur={() => setShowOptions(false)} onMouseDown={() => setShowOptions(!showOptions)}>
      {head}
      {showOptions && (
        <div className="min-w-max absolute top-full mt-4 right-2 z-10 border-2 border-gray-700  rounded text-left bg-white ">
          <ul className="p-3 dark:bg-primary-dark">
            {options.map(({ label, onClick }, index) => {
              return (
                <li key={label + index} onMouseDown={onClick}>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </button>
  );
};

export default DropdownOptions;
