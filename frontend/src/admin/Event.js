// src/admin/Events.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import EventForm from "./EventForm";
import ConfirmModal from "../components/ConfirmModal";
import "./Event.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

const fetchEvents = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}api/admin/events`,
    { withCredentials: true }
  );
  setEvents(res.data);
};

  useEffect(() => {
    fetchEvents();
  }, []);

const today = new Date();
today.setHours(0, 0, 0, 0);
const filteredEvents = events.filter(e => {
  const eventDate = new Date(e.date);
  eventDate.setHours(0, 0, 0, 0);

  
  return activeTab === "upcoming"
    ? eventDate >= today
    : eventDate < today;
});

  // pagination logic
  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleDelete = async () => {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}api/admin/events/${deleteEvent._id}`,
      { withCredentials: true }
    );
    setDeleteEvent(null);
    fetchEvents();
  };

  // reset page on tab/limit change
  useEffect(() => {
    setPage(1);
  }, [activeTab, rowsPerPage]);

  return (
    <div className="events-page">
      {/* Header */}
      <div className="events-header">
        <h2>Events</h2>
        <button
          className="create-btn"
          onClick={() => {
            setEditEvent(null);
            setShowModal(true);
          }}
        >
          + Create Event
        </button>
      </div>

      {/* Tabs */}
      <div className="event-tabs">
        <button
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </button>

        <button
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>

      {/* Controls */}
      <div className="table-controls">
        <span className="record-counts">
          Showing {paginatedEvents.length} of {filteredEvents.length}
        </span>

        <select
          value={rowsPerPage}
          onChange={e => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
        </select>
      </div>

      {/* Table */}
      <table className="events-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Date</th>
            <th>Summary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedEvents.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-cell">
                No events found
              </td>
            </tr>
          ) : (
            paginatedEvents.map(event => (
              <tr key={event._id}>
                <td>
                  <img
                    src={event.image || "/placeholder.jpg"}
                    alt=""
                    className="table-img"
                  />
                </td>
                <td>{event.title}</td>
                <td>
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td>{event.summary}</td>
                <td className="action-col">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditEvent(event);
                      setShowModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => setDeleteEvent(event)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editEvent ? "Edit Event" : "Create Event"}</h2>
            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <EventForm
              editData={editEvent}
              onSuccess={fetchEvents}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteEvent && (
        <ConfirmModal
          title="Delete Event?"
          message="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteEvent(null)}
        />
      )}
    </div>
  );
};

export default Events;
