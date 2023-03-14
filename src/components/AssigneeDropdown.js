import { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { MdLabel } from "react-icons/md";

const AssigneeDropdown = ({ options, selectedOption, label, onChange }) => {
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
    console.log("selected option:", selectedOption);
    if (selectedValue) {
      return showUser(selectedValue.profileURL, selectedValue.name);
    }
    const userProfile = options.find((user) => user.name === selectedOption);
    return selectedOption ? (
      showUser(userProfile.profileURL, selectedOption)
    ) : (
      <span className="dropdown-selected-label">{label}</span>
    );
  };

  const onItemClick = (option) => {
    setSelectedValue(option);
    onChange(label, option.name);
  };

  const handleInputClick = (e) => {
    // e.stopPropagation();
    setShowMenu(!showMenu);
  };
  const showUser = (url, name) => {
    return (
      <div className="dropdown-option">
        {url ? (
          <img src={url} className="profile-assignee" alt="profile" />
        ) : (
          <AiOutlineUser className="profile-assignee-icon" />
        )}
        <span>{name}</span>
      </div>
    );
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
              {showUser(option.profileURL, option.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssigneeDropdown;
