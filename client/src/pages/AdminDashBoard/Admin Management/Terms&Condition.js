// src/components/AddTerms.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../SideBar";

const AddTerms = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [terms, setTerms] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/terms/terms", {
        title,
        content,
      });
      setMessage(response.data.message);
      fetchTerms();
    } catch (error) {
      setMessage("Error adding terms and policy");
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/terms/terms");
      setTerms(response.data);
    } catch (error) {
      console.error("Error fetching terms", error);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div>
      <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
        <div className="app-main bg-white">
          <Sidebar />
          <div className="app-main-outer">
            <div className="app-main-inner">
              <div className="page-title-actions px-3 d-flex">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="">Dashboard</a></li>
                    <li className="breadcrumb-item"><a href="">Instructor</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Create</li>
                  </ol>
                </nav>
              </div>
              <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                  <div className="main-card card d-flex h-100 flex-column">
                    <div className="card-body">
                      <h2>Add Terms and Policy</h2>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3 mt-4">
                          <label htmlFor="title" className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="content" className="form-label">Content</label>
                          <textarea
                            className="form-control"
                            id="content"
                            rows="5"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                      </form>
                      {message && <p className="mt-3">{message}</p>}
                      <h2 className="mt-5">Terms and Policies</h2>
                      <ul>
                        {terms.map(term => (
                          <li key={term._id}>
                            <h5>{term.title}</h5>
                            <p>{term.content}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTerms;
