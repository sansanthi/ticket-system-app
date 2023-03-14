import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { BsCircle, BsCircleHalf, BsFillCheckCircleFill } from "react-icons/bs";
import {
  doc,
  setDoc,
  collection,
  getCountFromServer,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUserContext } from "../context/User.context";
import { useAuth } from "../context/Auth.context";
import StatusDropdown from "./StatusDropdown";
import LabelDropdown from "./LabelDropdown";
import AssigneeDropdown from "./AssigneeDropdown";
import CreatedDate from "./CreatedDate";

import moment from "moment";
import Editor from "./Editor";
import { $getRoot } from "lexical";

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PLAYGROUND_TRANSFORMERS } from "../plugins/MarkdownTransformers.ts";

const TicketPopup = ({ ticketToUpdate, closePopup }) => {
  console.log('ticketpoup worked')
  const { currentUser } = useAuth();
  const [lastTicketId, setLastTicketId] = useState(1);
  const { userList } = useUserContext();
  const [ticketFormData, setTicketFormData] = useState(
    ticketToUpdate
      ? ticketToUpdate
      : {
          id: "",
          title: "",
          status: "",
          label: "",
          assignee: "",
          createdDate: "",
          createdUserId: "",
          description: "",
        }
  );

  const getTicketCount = async () => {
    const coll = collection(db, "tickets");
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  };

  useEffect(() => {
    getTicketCount().then((data) =>
      data === 0 ? setLastTicketId(1) : setLastTicketId(data + 1)
    );
  }, []);

  const getCreatedUser = (id) => {
    return userList.find((user) => user.userId === id);
  };
  const [showDate, setShowDate] = useState(false);
  const getCreatedDate = () => {
    return moment
      .utc(ticketToUpdate.createdDate.toDate().toLocaleDateString())
      .local()
      .startOf("seconds")
      .fromNow();
  };

  
  const createdUser = useMemo(
    () => getCreatedUser(ticketToUpdate.createdUserId),
    [ticketToUpdate]
  );

  const issueStatus = [
    { icon: <BsCircle />, status: "To Do" },
    { icon: <BsCircleHalf />, status: "In Progress" },
    { icon: <BsFillCheckCircleFill />, status: "Done" },
  ];

  const labels = ["Feature", "Bug", "Error", "UI Fix"];

  const onHandleSaveTicket = (e) => {
    console.log('onHandleSubmit working:', e.target);
    e.preventDefault();
    let ticketId = "TIS-" + lastTicketId;
    if (ticketToUpdate) {
      updateTicket(ticketToUpdate.id, ticketFormData);
    } else {
      saveTicket(
        {
          ...ticketFormData,
          id: ticketId,
          createdUserId: currentUser.uid,
          createdDate: serverTimestamp(),
        },
        ticketId
      );
    }
    closePopup();
  };

  const onChangeInputValue = (event) => {
    const { name, value } = event.target;
    setTicketFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const onChangeMarkdown = (markdownText) => {
    console.log('markdown text:', markdownText)
    setTicketFormData(prevData => {
      return {
        ...prevData,
        description: markdownText,
      }
    })
  }

  const onChangeDropdownValue = (label, option) => {
    setTicketFormData((prevData) => {
      return {
        ...prevData,
        [label]: option,
      };
    });
  };

  const saveTicket = (data, id) => {
    setDoc(doc(db, "tickets", id), data);
  };

  const updateTicket = (id, data) => {
    const updateRef = doc(db, "tickets", id);
    updateDoc(updateRef, data);
  };
console.log('description in ticketpopup:', ticketFormData.description)
  return (
    <article className="ticket-popup">
      <header className="popup-header">
        <div className="issue-id">
          {ticketFormData.id ? " ":<span className="issue-id--name">TIS</span> }
          
          <span>{ticketFormData.id ? ticketFormData.id : " - New issue"}</span>
        </div>
        <button className="btn-close" onClick={closePopup}>
          <AiOutlineClose />
        </button>
      </header>
      <div className="ticket-form">
        <input
          type="text"
          placeholder="Issue Title"
          name="title"
          className="title-input"
          value={ticketFormData.title}
          onChange={onChangeInputValue}
        />
        {/* <textarea
          name="description"
          id="description"
          cols="30"
          rows="4"
          value={ticketFormData.description}
          onChange={onChangeInputValue}
          placeholder="Add description..."
        ></textarea> */}
        <Editor descriptionText={ticketFormData.description} onChangeMarkdown={onChangeMarkdown}/>
        <div className="dropdown-box">
          {/* <Dropdown options={labels} selectedOption={ticketFormData.label} label="label" onChange={onChangeDropdownValue}/>
          <Dropdown options={issueStatus} selectedOption={ticketFormData.status} label="status" onChange={onChangeDropdownValue}/>
          <Dropdown options={userList} selectedOption={ticketFormData.assignee} label="assignee" onChange={onChangeDropdownValue}/> */}

          <StatusDropdown
            options={issueStatus}
            selectedOption={ticketFormData}
            label="status"
            onChange={onChangeDropdownValue}
          />
          <LabelDropdown
            options={labels}
            selectedOption={ticketFormData.label}
            label="label"
            onChange={onChangeDropdownValue}
          />
          <AssigneeDropdown
            options={userList}
            selectedOption={ticketFormData.assignee}
            label="assignee"
            onChange={onChangeDropdownValue}
          />
        </div>
        <div className="button-box">
          <button type="submit" className="btn-save" onClick={(event) => onHandleSaveTicket(event)}>
            Save
          </button>
        </div>
      </div>
      <div className="breakline"></div>
      <div className="activity">
        <h2>Activity</h2>
        <div className="created-user">
          {createdUser?.profileURL ? (
            <img
              src={createdUser.profileURL}
              className="profile-assignee"
              alt="profile"
            />
          ) : (
            <AiOutlineUser className="profile-assignee-icon" />
          )}
          {ticketToUpdate.createdUserId && (
            <p>
              <span>{createdUser.name}</span> created the issue.{" "}
              <span onClick={() => setShowDate(!showDate)}>
                {" "}
                {getCreatedDate()}.
              </span>{" "}
              {showDate && (
                <small className="created-date">
                  <CreatedDate createdDate={ticketFormData.createdDate} />
                </small>
              )}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default TicketPopup;
