import { useAuth } from "../context/Auth.context";
import { AiOutlinePlus, AiOutlineUser } from "react-icons/ai";


import { useMemo, useState, useEffect } from "react";
import TicketPopup from "../components/TicketPopup";
import Ticket from "../components/Ticket";

import { db } from "../firebase";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [ticketToUpdate, setTicketToUpdate] = useState("");
  const ticketTypeList = ["All", "To Do", "In Progress", "Done"];
  const [indexValue, setIndexValue] = useState(0);
  const [userProfileImage, setUserProfileImage] = useState(null);

  const getUserInfo = () => {
    const userId = currentUser.uid;
    const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
      setUserProfileImage(doc.data().profileURL);
  });
  return unsub;
  }

  useEffect(() => {
    return getUserInfo();
  }, []);

  const filterTickets = (tickets, index) => {
    const type = ticketTypeList[index];

    if (type === "All") {
      return tickets;
    }

    return tickets.filter((ticket) => ticket.status === type);
  };

  const filteredTickets = useMemo(
    () => filterTickets(tickets, indexValue),
    // eslint-disable-next-line
    [tickets, indexValue]
  );

  const getTickets = () => {
    const q = collection(db, "tickets");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketDataArray = [];
      snapshot.forEach((doc) => {
        ticketDataArray.push(doc.data());
      });
      setTickets(ticketDataArray);
    });
    setLoading(false);
    return unsubscribe;
  };

  useEffect(() => {
    return getTickets();
  }, []);

  const updateTicket = (ticketId) => {
    setTicketToUpdate(tickets.find((ticket) => ticket.id === ticketId));
    showPopupBox();
  };

  const showPopupBox = () => {
    setShowPopup((show) => !show);
  };
  const closePopup = () => {
    setTicketToUpdate("");
    setShowPopup((show) => !show);
  };

  const [showProfileSetitngs, setShowProfileSettings] = useState(false);
  
  return (
    <>
      <main className="main-page">
        <header className="main-header">
          <h1>Ticketing System</h1>
          <div className="profile-box">
            <div className="profile"></div>
            <button
              className="profile-btn"
              onClick={() => setShowProfileSettings((show) => !show)}
            >
              {userProfileImage ? <img src={userProfileImage} className="profile-image" alt="prfoile" />:<AiOutlineUser />}
            </button>
            {showProfileSetitngs && (
              <div className="profile-settings">
                <div><Link to="/profile" className="profile-link">User Profile</Link></div>
                <div onClick={logout}>Logout</div>
              </div>
            )}
            {/* <button className="btn-logout" onClick={logout}>
            Logout
          </button> */}
          </div>
        </header>
        <section className="section-issues">
          <header className="header-issue">
            <div className="ticket-type">
              {ticketTypeList.map((type, index) => {
                return (
                  <button
                    className={`btn-type ${
                      indexValue === index ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => setIndexValue(index)}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            <button className="btn-new" onClick={showPopupBox}>
              <AiOutlinePlus /> <span className="new-ticket">New ticket</span>
            </button>
          </header>

          {loading ? (
            <div>
              <h1>Loading....</h1>
            </div>
          ) : (
            <article className="ticket-table">
              {filteredTickets.map((ticket) => {
                return (
                  <Ticket
                    key={ticket.id}
                    ticket={ticket}
                    updateTicket={updateTicket}
                  />
                );
              })}
            </article>
          )}
        </section>
        {showPopup ? (
          <TicketPopup
            showPopup={showPopupBox}
            closePopup={closePopup}
            ticketToUpdate={ticketToUpdate}
          />
        ) : null}
      </main>
    </>
  );
};

export default Dashboard;
