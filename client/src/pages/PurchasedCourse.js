import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PurchasedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });


  useEffect(() => {
    axiosInstance.get('/purchased', {
      headers:
      { Authorization : "Bearer" + localStorage.getItem("auth_token"),
      },
    })
    .then(response => setPurchasedCourses(response.data))
    .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Purchased Courses</h1>
      {purchasedCourses.length === 0 ? (
        <p>You have not purchased any courses yet.</p>
      ) : (
        purchasedCourses.map(course => (
          <div key={course._id}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PurchasedCourses;