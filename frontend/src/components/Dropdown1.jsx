import { useState, useRef, useEffect } from "react";

const Dropdown1 = ({ label, options, onSelect, icon }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-700 font-medium hover:text-gray-900 flex items-center"
      >
        {label} {icon && <span className="ml-1">{icon}</span>}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setOpen(false); // Auto-close on selection
                }}
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.label}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                {option.label}
              </button>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500">No options available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown1;
