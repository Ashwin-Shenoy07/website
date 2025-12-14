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
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const fetchEvents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/events`);
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async () => {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}api/admin/events/${deleteEvent._id}`,
      { withCredentials: true }
    );
    setDeleteEvent(null);
    fetchEvents();
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h2>Events</h2>
        <button className="create-btn" onClick={() => {
          setEditEvent(null);
          setShowModal(true);
        }}>
          + Create News
        </button>
      </div>

      <div className="events-list">
        {events.length === 0 && <p>No events created</p>}

        {events.map(event => (
          <div key={event._id} className="event-card">
            <img src={event.image || "/placeholder.jpg"} alt="" />
            <h3>{event.title}</h3>
            <p className="date">
              📅 {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p>{event.summary}</p>

            <div className="card-actions">
              <button onClick={() => {
                setEditEvent(event);
                setShowModal(true);
              }}>Edit</button>

              <button className="danger" onClick={() => setDeleteEvent(event)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editEvent ? "Edit Event" : "Post Event"}</h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>
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

      {/* Delete Confirmation */}
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
