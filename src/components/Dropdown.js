import { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { MdLabel } from "react-icons/md";


const Dropdown = ({ options, selectedOption, label, onChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const inputRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if(inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    window.addEventListener("click", handler);
    return () => {
      window.addEventListener("click", handler);
    };
  });

  const displaySelectedOption = () => {
    if(selectedValue) {
      return selectedValue
    }
    return selectedOption ? selectedOption : <span className="dropdown-selected-label">{label}</span>;
  }

  const onItemClick = (option) => {
    setSelectedValue(option);
    onChange(label, option);
  };

  const handleInputClick = (e) => {
    // e.stopPropagation();
    setShowMenu(!showMenu);
  };
  const statusOptions = (
    <div className="dropdown-menu">
      {options.map((option, index) => (
        <div
          key={index}
          className="dropdown-item dropdown-option"
          onClick={() => onItemClick(option.status)}
        >
          {option.icon}
          <span>{option.status}</span>
        </div>
      ))}
    </div>
  );
  const assigneeOptions = <div className="dropdown-menu">
  {options.map((option, index) => (
    <div
      key={index}
      className="dropdown-item dropdown-option"
      onClick={() => onItemClick(option.name)}
    >
      <span>
        {option.profileURL ? (
          <img
            src={option.profileURL}
            className="profile-assignee"
            alt="profile"
          />
        ) : (
          <AiOutlineUser className="profile-assignee-icon" />
        )}
      </span>
      <span>{option.name}</span>
    </div>
  ))}
</div>

const labelOptions = <div className="dropdown-menu">
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

const dropdownMenuSwitch = (param) => {
  switch(param) {
    case 'label': 
      return labelOptions;
    case 'assignee': 
      return assigneeOptions;
    case 'status': 
      return statusOptions;
    default:
      return <></>;
  }
}

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
        <>
          {dropdownMenuSwitch(label)}
        </>
      )}
    </div>
  );
};

export default Dropdown;
