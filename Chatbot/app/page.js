'use client'
import Image from "next/image";

import { Box, Stack, Button, TextField } from '@mui/material'
import { useState } from 'react'


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: 'Hi, I am your Astrological assistant, how can I help you?'
    },
  ])
  const [message, setMessage] = useState('')


  const sendMessage = async () => {
    // Clear the message input field
    setMessage('');

    // Add the new user message to the message array
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: '' },
    ]);

    // Make the API call
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    });

    // Process the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    reader.read().then(function processText({ done, value }) {
      if (done) {
        return result;
      }
      const text = decoder.decode(value || new Int8Array(), { stream: true });
      setMessages((prevMessages) => {
        let lastMessage = prevMessages[prevMessages.length - 1];
        let otherMessages = prevMessages.slice(0, prevMessages.length - 1);

        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text,
          },
        ];
      });
      return reader.read().then(processText);
    });
  };

  return (<Box width='100vw'
    height='100vh'
    display='flex'
    flexDirection='column'
    justifyContent='center'
    alignItems='center'
  >
    <Stack direction='column'
      width='600px'
      height='700px'
      border='1px solid pink'
      p={2}
      spacing={3}
    >
      <Stack direction='column'
        flexGrow={1}
        maxHeight='100%'
        spacing={2}
        overflow='auto'
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display='flex'
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
          >
            <Box
              bgcolor={
                message.role === 'assistant' ? 'primary.main' : 'secondary.main'
              }
              color="white"
              borderRadius={16}
              p={3}
            >
              {message.content}
            </Box>
          </Box>
        ))

        }

      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          label="message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)} />
        <Button variant="contained" onClick={sendMessage}
        >Send</Button>
      </Stack>
    </Stack>
  </Box>
  )
}
