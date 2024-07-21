// src/components/Signup.js
import React, { useState } from 'react';
import { auth, signInWithGoogle } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 80px auto;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
`;

const Button = styled.button`
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

const GoogleButton = styled(Button)`
  background-color: #db4437;

  &:hover {
    background-color: #c23321;
  }
`;

const LinkText = styled.p`
  margin-top: 20px;
  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
    }
  };

  return (
    <Container>
      <h2>Signup</h2>
      <Form onSubmit={handleSignup}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit">Signup</Button>
      </Form>
      <GoogleButton onClick={handleGoogleSignIn}>Sign in with Google</GoogleButton>
      <LinkText>
        Already have an account? <Link to="/login">Login</Link>
      </LinkText>
    </Container>
  );
}

export default Signup;
