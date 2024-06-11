import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const userId = // Get user ID from your authentication system, e.g., localStorage

    axios.get(`http://localhost:5000/api/user/${userId}/courses`)
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  return (
    <div className="container">
      <h2>Your Courses</h2>
      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-4">
            <div className="card">
              <img src={course.courseThumbnail} className="card-img-top" alt={course.courseName} />
              <div className="card-body">
                <h5 className="card-title">{course.courseName}</h5>
                <p className="card-text">{course.courseDescription}</p>
                <Link to={`/course/${course.id}`} className="btn btn-primary">Go to Course</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
