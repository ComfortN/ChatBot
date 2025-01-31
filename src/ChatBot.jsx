import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };


const handleSendMessage = async () => {
  if (input.trim() === '') return;

  const userMessage = { text: input, user: 'me' };
  setMessages([...messages, userMessage]);

  try {
    const response = await axios.post('http://localhost:3000/chat', {
      prompt: input
    });

    const botMessage = { 
      text: response.data.data,
      user: 'bot' 
    };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  } catch (error) {
    console.error('Error fetching response from backend:', error);
    alert('Error: Unable to fetch response. Please try again.');
  }

  setInput('');
};

const formatMessage = (text) => {
  // First handle the headers with bullet points
  let formattedText = text.replace(/\*\*\*(.*?):\*\*/g, (match, title) => {
    return `\n<div class="message-header">• ${title}</div>`;
  });
  
  // Remove remaining asterisks
  formattedText = formattedText.replace(/\*(.*?)\*/g, (match, content) => {
    return content;
  });
  
  // Split into paragraphs and wrap content
  const paragraphs = formattedText.split('\n\n').filter(p => p.trim());
  return paragraphs.map(p => `<div class="message-paragraph">${p}</div>`).join('');
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSendMessage();
  }
};

  return (
    <div className="chatbot">
      <div className="messages">
  {messages.map((message, index) => (
    <div 
      key={index} 
      className={`message ${message.user}`}
      dangerouslySetInnerHTML={
        message.user === 'bot' 
          ? { __html: formatMessage(message.text) }
          : { __html: message.text }
      }
    />
  ))}
</div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;