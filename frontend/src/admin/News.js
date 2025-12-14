import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import NewsForm from "./NewsForm";
import "./News.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";




const News = () => {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editNews, setEditNews] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
const [selectedId, setSelectedId] = useState(null);

  const fetchNews = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/news`
      );
      setNews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const confirmDelete = id => {
  setSelectedId(id);
  setShowConfirm(true);
};

const deleteNews = async () => {
  try {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}api/admin/news/${selectedId}`,
      { withCredentials: true }
    );
    fetchNews();
  } catch (err) {
    console.error(err);
  } finally {
    setShowConfirm(false);
    setSelectedId(null);
  }
};

  return (
    <div className="news-page">
      <div className="news-header">
        <h2>News</h2>
        <button className="create-btn" onClick={() => {
          setEditNews(null);
          setShowModal(true);
        }}>
          + Create News
        </button>
      </div>

      <div className="news-list">
        {news.length === 0 && <p>No news published yet</p>}

        {news.map(item => (
          <div key={item._id} className="news-card">
            <div className="news-card-header">
              <h3>{item.title}</h3>

              <div className="news-actions">
                <button onClick={() => {
                  setEditNews(item);
                  setShowModal(true);
                }}>
                  <FontAwesomeIcon icon={faPen} />
                </button>

                <button className="delete" onClick={() => confirmDelete(item._id)}>
  <FontAwesomeIcon icon={faTrash} />
</button>
              </div>
            </div>

            <p className="summary">{item.summary}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editNews ? "Edit News" : "Post News"}</h2>

            <button className="close-btn" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <NewsForm
              initialData={editNews}
              onSuccess={() => {
                setShowModal(false);
                fetchNews();
              }}
            />
          </div>
        </div>
      )}
      {showConfirm && (
  <ConfirmModal
    title="Delete News"
    message="This action cannot be undone. Do you want to continue?"
    confirmText="Delete"
    onConfirm={deleteNews}
    onCancel={() => setShowConfirm(false)}
  />
)}
    </div>
  );
};

export default News;
