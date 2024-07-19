import React, { useEffect, useState } from "react";
import Sidebar from '../SideBar';
import axios from "axios";
import StudentDetailModal from './StudentsDetails';
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Snackbar, Alert, Container, Box, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const StudentList = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  const userList = async () => {
    try {
      const user = await axiosInstance.get("/users/student", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        }
      });
      setData(user.data.studentInfo);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    userList();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Do you want to delete?")) {
      try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        setMessage(response.data.message);
        setSnackbarMessage("Student deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        userList();
      } catch (error) {
        setSnackbarMessage("Failed to delete student");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setMessage(error.response?.data?.message || "An error occurred");
      }
    }
  };

  const handleShow = (student) => {
    setSelectedStudent(student);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    { field: 'userName', headerName: 'Student', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Box className="circleDot animatedCompleted" mr={1}></Box>
          <Typography variant="body2">Active</Typography>
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleDeleteUser(params.row._id)} color="secondary">
            <DeleteIcon />
          </IconButton>
          <Typography variant="body2" component="a" href="#" onClick={() => handleShow(params.row)}>
            Details
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
    <div className="app-main">
      <Sidebar />
      <div className="app-main-outer">
        <div className="app-main-inner">
          <div className="page-title-actions px-3 d-flex">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Enrollment</li>
              </ol>
            </nav>
          </div>
          <div className="row" id="deleteTableItem">
            <div className="col-md-12">

    <Container maxWidth="lg">
      <Box my={4}>

        <Box my={4}>
          <Card>
            <CardHeader title="Enrollment" />
            <CardContent>
              <Box height={400}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  getRowId={(row) => row._id}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      {selectedStudent && (
        <StudentDetailModal
          show={show}
          handleClose={handleClose}
          student={selectedStudent}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>

  );
};

export default StudentList;
