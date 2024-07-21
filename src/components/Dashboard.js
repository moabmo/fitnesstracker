// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Workout from './Workout';
import { Line, Pie } from 'react-chartjs-2';
import styled from 'styled-components';
import { FiLogOut } from 'react-icons/fi';
import MotivationalQuotes from './MotivationalQuotes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContainer = styled.div`
  padding: 20px;
  background: #f4f6f8;
  min-height: 100vh;
`;

const WelcomeMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`;

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 40px;
  gap: 20px;
`;

const ChartBox = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableContainer = styled.div`
  margin-top: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #007bff;
  color: white;
`;

const TableBody = styled.tbody`
  background-color: #f4f6f8;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #dee2e6;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [workoutsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUser(user);
        await fetchWorkouts(user.uid);
      } else {
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const fetchWorkouts = async (uid) => {
    const q = query(collection(firestore, 'workouts'), where('userId', '==', uid));
    const workoutSnapshots = await getDocs(q);
    const fetchedWorkouts = workoutSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setWorkouts(fetchedWorkouts);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const handleWorkoutLogged = () => {
    if (user) {
      fetchWorkouts(user.uid);
    }
  };

  const lineData = {
    labels: workouts.map((workout, index) => `Workout ${index + 1}`),
    datasets: [
      {
        label: 'Weight Lifted (kg)',
        data: workouts.map((workout) => workout.weight),
        borderColor: '#007bff',
        fill: false,
      },
    ],
  };

  const lineOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Workout Sessions',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
        },
      },
    },
  };

  const pieData = {
    labels: workouts.map((workout) => workout.exercise),
    datasets: [
      {
        label: 'Exercise Distribution',
        data: workouts.map((workout) => workout.weight),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  // Pagination logic
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = workouts.slice(indexOfFirstWorkout, indexOfLastWorkout);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardContainer>
      {user && (
        <>
          <WelcomeMessage>
            <p>Welcome, {user.email}</p>
            <LogoutButton onClick={handleLogout}>
              <FiLogOut size={24} /> Logout
            </LogoutButton>
          </WelcomeMessage>
          <Workout user={user} onWorkoutLogged={handleWorkoutLogged} />
          <ChartsContainer>
            <ChartBox>
              <h3>Progress Chart</h3>
              <Line data={lineData} options={lineOptions} />
            </ChartBox>
            <ChartBox>
              <h3>Exercise Distribution</h3>
              <Pie data={pieData} />
            </ChartBox>
          </ChartsContainer>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Exercise</TableCell>
                  <TableCell>Sets</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Weight (kg)</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell>{workout.exercise}</TableCell>
                    <TableCell>{workout.sets}</TableCell>
                    <TableCell>{workout.reps}</TableCell>
                    <TableCell>{workout.weight}</TableCell>
                    <TableCell>{new Date(workout.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationContainer>
              {Array.from({ length: Math.ceil(workouts.length / workoutsPerPage) }, (_, index) => (
                <PaginationButton
                  key={index}
                  onClick={() => paginate(index + 1)}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationButton>
              ))}
            </PaginationContainer>
          </TableContainer>
          <MotivationalQuotes />
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
