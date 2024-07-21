// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding: 20px;
  background: #f4f6f8;
  min-height: 100vh;
`;

const ProfileCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 40px auto;
`;

const ProfileTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const ProfileInput = styled.input`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
`;

const ProfileButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (user) {
      await user.updateProfile({
        displayName: name,
        photoURL: photoURL,
      });
      setUser(auth.currentUser);
      firestore.collection('users').doc(user.uid).set(
        {
          displayName: name,
          photoURL: photoURL,
        },
        { merge: true }
      );
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileTitle>Profile</ProfileTitle>
        {user && (
          <ProfileForm onSubmit={handleProfileUpdate}>
            <ProfileInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
            <ProfileInput
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="Photo URL"
            />
            <ProfileButton type="submit">Update Profile</ProfileButton>
          </ProfileForm>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
