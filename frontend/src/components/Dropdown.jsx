import { useState, useEffect, useRef } from "react";

const Dropdown = ({ options, selected, setSelected, placeholder, className, allowInput = false, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selected ? selected.label : "");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {allowInput ? (
        <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-md p-3">
          {icon && <icon className="text-lg text-gray-600 mr-2" />} {/* Show icon */}
          <input
            type="text"
            className=" w-full focus:outline-none"
            value={inputValue}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setInputValue(e.target.value);
              setSelected({ label: e.target.value });
            }}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <button
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-md cursor-pointer flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {selected?.icon && <selected.icon className="text-lg text-gray-600" />}
            {selected ? selected.label : <span className="text-gray-500">{placeholder}</span>}
          </div>
        </button>
      )}

      {isOpen && options.length > 0 && (
        <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          {options
            .filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
            .map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setSelected(option);
                  setInputValue(option.label);
                  setIsOpen(false);
                }}
              >
                {option.icon && <option.icon className="text-lg text-gray-600" />}
                {option.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
