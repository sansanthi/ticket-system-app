import { useEffect, useMemo, useState } from "react";
import { BsCircle, BsCircleHalf, BsFillCheckCircleFill } from "react-icons/bs";
import { useUserContext } from "../context/User.context";
import CreatedDate from "./CreatedDate";

const Ticket = ({ ticket, updateTicket }) => {
  const { userList } = useUserContext();
  const getUserProfileImage = (assingee) => {
    console.log("ticket assignee:", assingee)
    if(assingee === " ") {
      return null;
    }
    return userList.find((user) => user.name === assingee);
  };
  const userProfile = useMemo(
    () => getUserProfileImage(ticket.assignee),
    [ticket]
  );
 

  return (
    <div className="ticket" key={ticket.id}>
      <div className="ticket-info" onClick={() => updateTicket(ticket.id)}>
        {ticket.status === "To Do" ? (
          <BsCircle className="ticket-status" />
        ) : ticket.status === "In Progress" ? (
          <BsCircleHalf className="ticket-status" />
        ) : (
          <BsFillCheckCircleFill className="ticket-status" />
        )}
        <h3 className="ticket-id">{ticket.id}</h3>
        <h2 className="ticket-title">{ticket.title}</h2>
      </div>
      <div className="ticket-info">
        <div className="ticket-created">
          <CreatedDate createdDate={ticket.createdDate} />
        </div>
        <div className="ticket-assignee">
          {userProfile?.profileURL ? (
            <img
              src={userProfile.profileURL}
              className="profile-assignee"
              alt="profile"
            />
          ) : (
            <span>{ticket.assignee}</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Ticket;
