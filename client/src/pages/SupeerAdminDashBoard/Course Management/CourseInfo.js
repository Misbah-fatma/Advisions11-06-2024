import React, { useEffect, useState, useMemo } from "react";
import Sidebar from '../SideBar';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourseInfo, deleteCourseItem } from "../../../redux/course/courseAction";
import { Link } from "react-router-dom";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { GridToolbar } from '@mui/x-data-grid';

const CourseInfo = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentCourseThumbnail, setCurrentCourseThumbnail] = useState("");
    const [currentCoursePdf, setCurrentCoursePdf] = useState([]);
    const [currentLecturePdf, setCurrentLecturePdf] = useState(null);
    const [openDeleteCourseDialog, setOpenDeleteCourseDialog] = useState(false);
    const [openDeleteLectureDialog, setOpenDeleteLectureDialog] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [lectureToDelete, setLectureToDelete] = useState(null);
    const [popUpText, setpopUp] = useState('');

    const confirmDeleteoneCourse = (courseId) => {
        setCourseToDelete(courseId);
        setOpenDeleteCourseDialog(true);
    };

    const confirmDeleteLecture = (lectureId) => {
        setLectureToDelete(lectureId);
        setOpenDeleteLectureDialog(true);
    };

    const handleCloseDeleteCourseDialog = () => {
        setOpenDeleteCourseDialog(false);
        setCourseToDelete(null);
    };

    const handleCloseDeleteLectureDialog = () => {
        setOpenDeleteLectureDialog(false);
        setLectureToDelete(null);
    };

    const handleconfirmDeleteoneCourse = () => {
        dispatch(deleteCourseItem(courseToDelete));
        handleCloseDeleteCourseDialog();
    };

    const handleConfirmDeleteLecture = async () => {
        try {
            const response = await axiosInstance.delete(`/lectures/${lectureToDelete}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth_token"),
                },
            });

            if (response.status === 200) {
                console.log("Lecture deleted successfully");
                dispatch(fetchAllCourseInfo()); // Refresh course info after deletion
            } else {
                console.error('Failed to delete lecture');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        handleCloseDeleteLectureDialog();
    };

    useEffect(() => {
        const userDataFromStorage = localStorage.getItem('user');
        if (userDataFromStorage) {
            setUserData(JSON.parse(userDataFromStorage));
        }
    }, []);

    const userId = userData ? userData._id : null;
    const courseData = useSelector((state) => state.course.courseInfo || []);
    console.log(courseData)
    const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

    useEffect(() => {
        dispatch(fetchAllCourseInfo());
    }, [dispatch]);

    const filteredCourses = useMemo(() => Array.isArray(courseData) ?
        courseData.filter(course => course.teacher === userId) : [], [courseData, userId]);

    const editLectureHandler = (lecture) => {
        setCurrentLecture(lecture);
        setOpenEditDialog(true);
    };

    const editCourseHandler = (course) => {
        setCurrentCourse(course);
        setOpenEditCourseDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setCurrentLecture(null);
        setCurrentLecturePdf(null); // Reset lecture PDF state
    };

    const handleEditCourseDialogClose = () => {
        setOpenEditCourseDialog(false);
        setCurrentCourse(null);
    };

    const handleLectureSave = async () => {
        try {
            const formData = new FormData();
            formData.append("title", currentLecture.title);
            formData.append("description", currentLecture.description);
            formData.append("videoUrl", currentLecture.videoUrl);
            if (currentLecturePdf) {
                formData.append("pdf", currentLecturePdf);
            }

            const response = await axiosInstance.put(`/lectures/${currentLecture._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + localStorage.getItem("auth_token"),
                },
            });

            if (response.status === 200) {
                const updatedLecture = response.data;
                setCurrentLecture(updatedLecture);
                handleEditDialogClose();
                dispatch(fetchAllCourseInfo()); // Refresh course info after update
            } else {
                console.error('Failed to update lecture');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCourseSave = async () => {
        try {
            const formData = new FormData();
            formData.append("courseName", currentCourse.courseName);
            formData.append("courseDescription", currentCourse.courseDescription);
            formData.append("coursePrice", currentCourse.coursePrice);
            formData.append("courseLink", currentCourse.courseLink);
            formData.append("popUpText", currentCourse.popUpText);
            if (currentCourseThumbnail) {
                formData.append("courseThumbnail", currentCourseThumbnail);
            }
            for (let i = 0; i < currentCoursePdf.length; i++) {
                formData.append("coursePdf", currentCoursePdf[i]);
            }

            const response = await axiosInstance.put(`/courses/${currentCourse._id}`, formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth_token"),
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                const updatedCourse = response.data;
                setCurrentCourse(updatedCourse);
                setCurrentCourseThumbnail(""); // Reset current course thumbnail state
                setCurrentCoursePdf([]); // Reset current course PDF state
                handleEditCourseDialogClose();
                dispatch(fetchAllCourseInfo()); // Refresh course info after update
            } else {
                console.error('Failed to update course');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]; // Assuming single file upload
        setCurrentCourseThumbnail(file);
    };

    const handlePdfChange = (e) => {
        const files = e.target.files;
        setCurrentCoursePdf([...files]);
    };

    const handleLecturePdfChange = (e) => {
        const file = e.target.files[0];
        setCurrentLecturePdf(file);
    };

    const handleLectureChange = (e) => {
        const { name, value } = e.target;
        setCurrentLecture(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        setCurrentCourse(prevState => ({ ...prevState, [name]: value }));
    };

    const courseColumns = [
        { field: 'courseThumbnail', headerName: 'Course', renderCell: (params) => (
            <div className="listproduct-section">
                <div className="listproducts-image">
                    <img
                        style={{ height: "40px", width: "60px", objectFit: "contain" }}
                        src={params.value}
                        alt=""
                    />
                </div>
                <div className="product-pera">
                    <p className="priceDis">
                        {params.row.courseName}
                    </p>
                </div>
            </div>
        ) },
        { field: 'courseDescription', headerName: 'Description', width: 200 },
        { field: 'coursePrice', headerName: 'Price', width: 100 },
        { field: 'teacherName', headerName: 'Instructor', width: 150 },
        { field: 'courseLink', headerName: 'Course Link', width: 200 },
        { field: 'coursePdf', headerName: 'Course Pdf', renderCell: (params) => (
            <a href={params.value}>Pdf Url</a>
        ) },
        { field: 'status', headerName: 'Status', renderCell: () => (
            <div className="statusItem">
                <div className="circleDot animatedCompleted"></div>
                <div className="statusText">
                    <span className="stutsCompleted">Active</span>
                </div>
            </div>
        ) },
        { field: 'addLecture', headerName: 'Add Lecture', renderCell: (params) => (
            <Link to="/createAdminLectures/" state={params.row._id}>
                <EditIcon color="primary" />
            </Link>
        ) },
        { field: 'actions', headerName: 'Actions', renderCell: (params) => (
            <div>
                <IconButton onClick={() => confirmDeleteoneCourse(params.row._id)}>
                    <DeleteIcon color="secondary" />
                </IconButton>
                <IconButton onClick={() => editCourseHandler(params.row)}>
                    <EditIcon color="primary" />
                </IconButton>
            </div>
        ) }
    ];

    const lectureColumns = [
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'videoUrl', headerName: 'Video URL', width: 200 },
        { field: 'pdfUrl', headerName: 'Pdf URL', width: 200 },
        { field: 'actions', headerName: 'Actions', renderCell: (params) => (
            <div>
                <IconButton onClick={() => confirmDeleteLecture(params.row._id)}>
                    <DeleteIcon color="secondary" />
                </IconButton>
                <IconButton onClick={() => editLectureHandler(params.row)}>
                    <EditIcon color="primary" />
                </IconButton>
            </div>
        ) }
    ];

    return (
        <>
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
                  <div className="card mb-5">
                    <div className="card-body">
                      <div >
            <div className="container mb-3 mt-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="course-table">
                            <div className="d-md-flex mb-3">
                                <h4 className="navyBlueColor">Course Management</h4>
                            </div>
                            {courseData.map(course => (
                    <div key={course._id} style={{ marginTop: 20 }}>
                        <h2>{course.courseName}</h2>
                        <div >
                            <DataGrid
                                rows={[course]}
                                columns={courseColumns}
                               
                                getRowId={(row) => row._id}
                                components={{ Toolbar: GridToolbar }}
                            />
                        </div>

                        <h3>Lectures for {course.courseName}</h3>
                        <div>
                            <DataGrid
                                rows={course.lectures}
                                columns={lectureColumns}
                                getRowId={(row) => row._id}
                                components={{ Toolbar: GridToolbar }}
                            />
                        </div>
                    </div>
                ))}
                          </div>
                    </div>
                </div>
        
                  
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>

            </div>

            {/* Delete Course Confirmation Dialog */}
            <Dialog open={openDeleteCourseDialog} onClose={handleCloseDeleteCourseDialog}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this course?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteCourseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleconfirmDeleteoneCourse} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Lecture Confirmation Dialog */}
            <Dialog open={openDeleteLectureDialog} onClose={handleCloseDeleteLectureDialog}>
                <DialogTitle>Delete Lecture</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this lecture?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteLectureDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDeleteLecture} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Lecture Dialog */}
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Lecture</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Title" name="title" fullWidth value={currentLecture?.title || ''} onChange={handleLectureChange} />
                    <TextField margin="dense" label="Description" name="description" fullWidth value={currentLecture?.description || ''} onChange={handleLectureChange} />
                    <TextField margin="dense" label="Video URL" name="videoUrl" fullWidth value={currentLecture?.videoUrl || ''} onChange={handleLectureChange} />
                    <Button variant="contained" component="label">
                        Upload PDF
                        <input type="file" hidden onChange={handleLecturePdfChange} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">Cancel</Button>
                    <Button onClick={handleLectureSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Course Dialog */}
            <Dialog open={openEditCourseDialog} onClose={handleEditCourseDialogClose}>
                <DialogTitle>Edit Course</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Course Name" name="courseName" fullWidth value={currentCourse?.courseName || ''} onChange={handleCourseChange} />
                    <TextField margin="dense" label="Course Description" name="courseDescription" fullWidth value={currentCourse?.courseDescription || ''} onChange={handleCourseChange} />
                    <TextField margin="dense" label="Course Price" name="coursePrice" fullWidth value={currentCourse?.coursePrice || ''} onChange={handleCourseChange} />
                    <TextField margin="dense" label="Course Link" name="courseLink" fullWidth value={currentCourse?.courseLink || ''} onChange={handleCourseChange} />
                    <TextField margin="dense" label="Course PopUp" name="popUpText" fullWidth value={currentCourse?.popUpText || ''} onChange={handleCourseChange} />
                    <Button variant="contained" component="label">
                        Upload Course Thumbnail
                        <input type="file" hidden onChange={handleThumbnailChange} />
                    </Button>
                    <Button variant="contained" component="label">
                        Upload Course PDF
                        <input type="file" multiple hidden onChange={handlePdfChange} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCourseDialogClose} color="primary">Cancel</Button>
                    <Button onClick={handleCourseSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CourseInfo;

