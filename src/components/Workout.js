// src/components/Workout.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import styled from 'styled-components';

const WorkoutFormContainer = styled.div`
  margin-top: 20px;
`;

const WorkoutForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WorkoutInput = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(100% - 20px);
  margin: 5px;
`;

const WorkoutButton = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Workout = ({ user, onWorkoutLogged }) => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'workouts'), {
        userId: user.uid,
        exercise,
        sets,
        reps,
        weight,
        createdAt: new Date(),
      });
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      if (onWorkoutLogged) onWorkoutLogged();
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  };

  return (
    <WorkoutFormContainer>
      <h3>Log Workout</h3>
      <WorkoutForm onSubmit={handleSubmit}>
        <WorkoutInput
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise"
          required
        />
        <WorkoutInput
          type="number"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          placeholder="Sets"
          required
        />
        <WorkoutInput
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          required
        />
        <WorkoutInput
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
          required
        />
        <WorkoutButton type="submit">Log Workout</WorkoutButton>
      </WorkoutForm>
    </WorkoutFormContainer>
  );
};

export default Workout;
