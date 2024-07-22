import React, { useEffect, useState } from "react";
import Sidebar from './SideBar';
import axios from "axios";
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { TablePagination, Grid, Paper, useMediaQuery, useTheme, Drawer, IconButton, AppBar, Toolbar, Typography,Card, CssBaseline, Box } from "@mui/material";
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const drawerWidth = 280;

const Student = () => {
  const styles = {
    card: {
      marginBottom: '2rem',
    },
    cardBody: {
      padding: '1.5rem',
    },
    table: {
      width: '100%',
      marginBottom: '1rem',
      color: '#212529',
      textAlign: 'center',
    },
    thead: {
      backgroundColor: '#f8f9fa',
    },
    th: {
      padding: '1rem',
      verticalAlign: 'top',
      borderTop: '1px solid #dee2e6',
    },
    tbody: {
      backgroundColor: '#fff',
    },
    tr: {
      borderTop: '1px solid #dee2e6',
    },
    td: {
      padding: '1rem',
      verticalAlign: 'top',
      borderTop: '1px solid #dee2e6',
    },
    badge: {
      display: 'inline-block',
      padding: '.35em .65em',
      fontSize: '75%',
      fontWeight: '700',
      lineHeight: '1',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      verticalAlign: 'baseline',
      borderRadius: '.25rem',
      backgroundColor: '#007bff',
      color: '#fff',
    },
    progress: {
      height: '1rem',
      overflow: 'hidden',
      fontSize: '.75rem',
      backgroundColor: '#e9ecef',
      borderRadius: '.25rem',
    },
    progressBar: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      backgroundColor: '#007bff',
      transition: 'width .6s ease',
    },
    linkButton: {
      display: 'inline-block',
      fontWeight: '400',
      color: '#007bff',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      userSelect: 'none',
      backgroundColor: '#007bff',
      border: '1px solid #007bff',
      padding: '.375rem .75rem',
      fontSize: '1rem',
      lineHeight: '1.5',
      borderRadius: '.25rem',
      textDecoration: 'none',
      color: '#fff',
    },
    rowHover: {
      '&:hover': {
        backgroundColor: '#f2f2f2',
      },
    },
  };

  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();
  const history = useNavigate ();
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const userId = userData ? userData._id : null;
  const username = userData?.userName;
  const activity = userData?.role;
  const email = userData?.email;

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    console.log('Retrieved from storage:', userDataFromStorage);

    if (userDataFromStorage) {
      try {
        const parsedData = JSON.parse(userDataFromStorage);
        setUserData(parsedData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axiosInstance.get("/api/code", {
          headers: {
            Authorization: "Bearer " + token,
          }
        });
        setData(response.data.codes);
      } catch (error) {
        console.error("Error fetching codes:", error);
      }
    };

    fetchCodes();
  }, []);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axiosInstance.get("/api/purchased-courses", {
          headers: {
            Authorization: "Bearer " + token,
          }
        });

        console.log('Purchased courses response:', response.data); 

        setPurchasedCourses(response.data.courses.flat());
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
      }
    };

    if (userId) {
      fetchPurchasedCourses();
    }
  }, [userId]);

  const getStatus = (output) => {
    if (!output) return "No Output";
    if (/error/i.test(output)) return "Error";
    return "Success";
  };

  const [roomCount, setRoomCount] = useState(null);
  const fetchRoomCount = async (userId) => {
    try {
      const response = await axiosInstance.get(`/room/api/rooms/count?userId=${userId}`);
      setRoomCount(response.data.count);
    } catch (error) {
      console.error('Error fetching room count:', error);
      setRoomCount(null);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRoomCount(userId);
    }
  }, [userId]);

  const outputStatusData = data.reduce((acc, row) => {
    const status = getStatus(row.output);
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  }, {});

  const userCodeCount = data.reduce((acc, row) => {
    if (!acc[row.user]) {
      acc[row.user] = 0;
    }
    acc[row.user]++;
    return acc;
  }, {});

  const languageCount = data.reduce((acc, row) => {
    if (!acc[row.language]) {
      acc[row.language] = 0;
    }
    acc[row.language]++;
    return acc;
  }, {});

  const outputStatusChartData = {
    labels: Object.keys(outputStatusData),
    datasets: [
      {
        label: 'Output Status',
        data: Object.values(outputStatusData),
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const userCodeCountChartData = {
    labels: Object.keys(userCodeCount),
    datasets: [
      {
        label: 'Number of Codes',
        data: Object.values(userCodeCount),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(outputStatusData),
    datasets: [
      {
        label: 'Output Status',
        data: Object.values(outputStatusData),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Number of Codes',
        data: Object.values(userCodeCount),
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function truncateText(text, wordLimit) {
    if (!text) return ''; // Return an empty string if text is undefined or null
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  }

  const handleLogout = () => {
    // Dispatch logout action
    localStorage.clear("user");
    localStorage.clear("auth_token");
    dispatch({ type: "CLEAR__USER" });
   history("/login")
  };


  const drawer = (
    <div>
      <div>
        <Typography variant="h6" noWrap>
          Welcome {username}
        </Typography>
      </div>
      <Sidebar />
    </div>
  );

  return (
    <div>
      
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }} className="bg-white">
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <img src= "assets/logo10.png" alt="Logo" style={{ height: "30px", marginRight: "5px" }} />
          <div className="app-header-right ms-auto ">
        <div className="app-header-right d-flex align-items-center">
        <div className="container">
    
        <div className="nav-item nav-link active">
                {
                  userData ?
                    <div className="nav-item dropdown">
                      <a href="/" className="nav-link dropdown-toggle text-#6200ea" data-toggle="dropdown"
                       style={{color : "#6200ea"}}>{userData.userName}
                       <i className="fa fa-user-cirle-o mt-1" aria-hidden="true"></i></a>
                      <div className="dropdown-menu  rounded-0 border-0 m-0">
                       
                        <button className="dropdown-item text-danger"  onClick={handleLogout} >Logout</button>
                      </div>
                    </div> :
                    <Link to="/login" className="nav-item nav-link active">Login</Link>
                }
              </div>
          
              </div>
              </div>
              </div>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant={isSmUp ? 'permanent' : 'temporary'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
      <Paper>
        <Card>
        <div className="container mb-4">

        <div class="table-responsive">
      <table className="table table-hover mt-4">
      <thead >
            <tr>
              <th scope="col" >Name</th>
              <th scope="col">Email</th>
              <th scope="col">Link</th>

            </tr>
          </thead>
        <tbody>
          <tr>

            <td>{username}</td>
            <td>{email}</td>
            <td>{activity}</td>
          </tr>
       
        </tbody>
      </table>
      </div>

    </div>
    </Card>
    </Paper>
    <Paper>
    <Card className="mt-4">
      <div className="table-responsive">
        <table className="table table-hover">
      
          <thead className="text-center">
            <tr>
              <th scope="col" >Language</th>
              <th scope="col">Code</th>
              <th scope="col">Output</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody >
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row) => (
                                <tr key={row._id}>
                                <td className="tableCustomar">
                                  <span className="badge rounded-pill text-bg-success">{row.language}</span>
                                </td>
                                <td className="tableId"><span></span>  {truncateText(row.code, 9)}</td>
                                <td className="tableId">{row.output}</td>
                                <td className="tableId">{getStatus(row.output)}</td>
                              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Card>
        </Paper>

        <Paper>
        <Card className="mt-4">

        <h4 className="text-center">Purchased Courses</h4>
        <div className="table-responsive">
        <table className="table table-hover">
      
          <thead >
            <tr>
              <th scope="col" >Course Title</th>
              <th scope="col">Progress</th>
              <th scope="col">Link</th>

            </tr>
          </thead>
          <tbody >
            {purchasedCourses.map((course, index) => (
              <tr key={index} >
                <td >{course.courseName}</td>

                <td>Progress</td>
                <td >
                  <Link to={`/course/${course._id}`} sx={styles.linkButton}>View Course</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
</div>
        </Card>
        </Paper>
        {/* <Typography variant="h4" gutterBottom>Additional Info</Typography>
        <Typography variant="body1">Room Count: {roomCount !== null ? roomCount : 'Loading...'}</Typography> */}
          <Grid container spacing={3} className="mt-4">
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={styles.card}>
              <div sx={styles.cardBody}>
                <Bar data={outputStatusChartData} />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={styles.card}>
              <div sx={styles.cardBody}>
                <Line data={lineChartData} />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Paper sx={styles.card}>
              <div sx={styles.cardBody}>
                <Bar data={userCodeCountChartData} />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
    </div>
  );
};

export default Student;
