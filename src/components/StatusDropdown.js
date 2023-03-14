import { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";

const StatusDropdown = ({ options, selectedOption, label, onChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const inputRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    window.addEventListener("click", handler);
    return () => {
      window.addEventListener("click", handler);
    };
  });

  const displaySelectedOption = () => {
    console.log('label', selectedOption)
    if (selectedValue) {
      return (
        <div className="dropdown-option">
          {selectedValue.icon} {selectedValue.status}
        </div>
      );
    }
    return selectedOption.status ? (
      <div className="dropdown-option">
        {selectedOption.icon} {selectedOption.status}
      </div>
    ) : (
      <span className="dropdown-selected-label">{label}</span>
    );
  };

  const onItemClick = (option) => {
    setSelectedValue(option);
    onChange(label, option.status);
  };

  const handleInputClick = (e) => {
    // e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-input" ref={inputRef} onClick={handleInputClick}>
        <div className="dropdown-selected-value">{displaySelectedOption()}</div>
        <div className="dropdown-tools">
          <div className="dropdown-tool">
            <BsChevronDown />
          </div>
        </div>
      </div>
      {showMenu && (
        <div className="dropdown-menu">
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-item dropdown-option"
              onClick={() => onItemClick(option)}
            >
              {option.icon}
              <span>{option.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
