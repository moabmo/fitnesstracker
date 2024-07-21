// src/components/MotivationalQuotes.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const QuoteContainer = styled.div`
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 18px;
`;

const QuoteText = styled.p`
  font-style: italic;
`;

const NewQuoteButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
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

const MotivationalQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const response = await fetch('https://type.fit/api/quotes');
    const quotes = await response.json();
    setQuotes(quotes);
    setCurrentQuote(getRandomQuote(quotes));
  };

  const getRandomQuote = (quotes) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex].text;
  };

  const handleNewQuote = () => {
    setCurrentQuote(getRandomQuote(quotes));
  };

  return (
    <QuoteContainer>
      <QuoteText>{currentQuote}</QuoteText>
      <NewQuoteButton onClick={handleNewQuote}>Get a New Quote</NewQuoteButton>
    </QuoteContainer>
  );
};

export default MotivationalQuotes;
