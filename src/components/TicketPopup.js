import { useEffect } from "react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  doc,
  setDoc,
  collection,
  getCountFromServer,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const TicketPopup = ({ ticketToUpdate, closePopup }) => {
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
          description: "",
        }
  );
  const [lastTicketId, setLastTicketId] = useState(1);

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

  const status = ["To Do", "In Progress", "Done"];
  const developers = ["San", "Thi", "Jun"];
  const labels = ["Feature", "Bug", "Error", "UI Fix"];

  const onHandleSubmit = (e) => {
    e.preventDefault();
    let ticketId = "TIS-" + lastTicketId;
    if (ticketToUpdate) {
      updateTicket(ticketToUpdate.id, ticketFormData);
    } else {
      saveTicket(
        {
          ...ticketFormData,
          id: ticketId,
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

  const saveTicket = (data, id) => {
    setDoc(doc(db, "tickets", id), data);
  };

  const updateTicket = (id, data) => {
    const updateRef = doc(db, "tickets", id);
    updateDoc(updateRef, data);
  };

  return (
    <article className="ticket-popup">
      <header className="popup-header">
        <div className="issue-id">
          <span className="issue-id--name">TIS</span> - <span>{ticketFormData.id? ticketFormData.id : "New issue"}</span>
        </div>
        <button className="btn-close" onClick={closePopup}>
          <AiOutlineClose />
        </button>
      </header>
      <form className="ticket-form" onSubmit={onHandleSubmit}>
        <input
          type="text"
          placeholder="Issue Title"
          name="title"
          className="title-input"
          value={ticketFormData.title}
          onChange={onChangeInputValue}
        />
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="4"
          value={ticketFormData.description}
          onChange={onChangeInputValue}
          placeholder="Add description..."
        ></textarea>
        <div className="dropdown-box">
          <select
            name="status"
            id="status-select"
            value={ticketFormData.status}
            onChange={onChangeInputValue}
          >
            {/* <option value="">Status</option> */}
            {status.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name="label"
            id="label-select"
            value={ticketFormData.label}
            onChange={onChangeInputValue}
          >
            <option value="">Label</option>
            {labels.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name="assignee"
            id="assignee-select"
            value={ticketFormData.assignee}
            onChange={onChangeInputValue}
          >
            <option value="">Assignee</option>
            {developers.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="button-box">
          <button type="submit" className="btn-save">
            Save
          </button>
        </div>
      </form>
    </article>
  );
};

export default TicketPopup;
