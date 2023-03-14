import { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { MdLabel } from "react-icons/md";

const LabelDropdown = ({ options, selectedOption, label, onChange }) => {
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
    if (selectedValue) {
      return <div className="dropdown-option"><MdLabel /> {selectedValue}</div>;
    }
    return selectedOption ? (
        <div className="dropdown-option"><MdLabel /> {selectedOption}</div>
    ) : (
      <span className="dropdown-selected-label">{label}</span>
    );
  };
  
  const onItemClick = (option) => {
    setSelectedValue(option);
    onChange(label, option);
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
              <MdLabel />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabelDropdown;
