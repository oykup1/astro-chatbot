'use client'
import Image from "next/image";
import { Box, Stack } from '@mui/material'
import { useState } from 'react'
export default function Home() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: 'Hi, I am your Astrology assistant, how can I help you?'
  }])
  const [message, SetMessage] = useState('')

  const sendMessage = async () => {
    setMessages('')
    setMessages((message) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' },
    ])
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }])
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
    })


  }
  return <Box width='100vw'
    height='100vh'
    display='flex'
    flexDirection='column'
    justifyContent='center'
    alignItems='center'>
    <Stack direction='column'
      width='600px'
      height='700px'
      border='1px solid black'
      p={2}
      spacing={3}>
      <Stack direction='column'
        flexGrow={1}
        maxHeight='100%'
        p={2}
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
    </Stack>
  </Box>
}
