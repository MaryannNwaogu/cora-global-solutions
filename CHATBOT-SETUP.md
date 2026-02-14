# Cora AI Chatbot - Setup Guide

## Overview
The Cora Global Solutions website now includes an AI-powered chatbot that uses OpenAI's GPT-4o model. The chatbot consists of:
- **Frontend**: Enhanced JavaScript chatbot in `js/chatbot.js`
- **Backend**: Node.js + Express server that interfaces with OpenAI API

## Prerequisites
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- OpenAI API Key - [Get one](https://platform.openai.com/api-keys)
- npm (comes with Node.js)

## Setup Instructions

### Step 1: Set Up Backend
Navigate to the backend folder:
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
(On Windows: `copy .env.example .env`)

2. Edit `.env` file and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-api-key-here
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost,http://127.0.0.1,https://www.coraglobalsolutions.com
```

### Step 4: Start the Backend Server
```bash
npm start
```

You should see:
```
🚀 Cora Chatbot Backend running on port 5000
🤖 Ready to handle conversations with OpenAI
```

### Step 5: Access the Chatbot
1. Open your website in a browser (e.g., `http://localhost` or your domain)
2. Look for the blue chat button in the bottom-right corner
3. Click to open the chat window
4. Start chatting with the AI-powered Cora Assistant!

## Features

### Smart Responses
- The chatbot uses OpenAI's GPT-4o model for natural, context-aware responses
- Maintains conversation history during a session
- Automatically embeds Cora's company information (services, contact details, etc.)

### Conversation Management
- Each user gets a unique session ID
- Conversation history is maintained in memory (up to 20 messages)
- Sessions can be cleared via the backend API

### Error Handling
- Fallback error messages if backend is unavailable
- Clear guidance on how to start the backend server
- Helpful debugging information

## API Endpoints

### POST `/api/chat/message`
Send a user message and get a response from the AI.

**Request:**
```json
{
  "message": "I want to book a flight",
  "sessionId": "unique-session-id"
}
```

**Response:**
```json
{
  "response": "AI response here...",
  "sessionId": "unique-session-id",
  "model": "gpt-4o",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 75,
    "total_tokens": 225
  }
}
```

### GET `/api/chat/session`
Create a new chat session.

**Response:**
```json
{
  "sessionId": "generated-session-id"
}
```

### POST `/api/chat/clear`
Clear conversation history for a session.

**Request:**
```json
{
  "sessionId": "session-id-to-clear"
}
```

### GET `/health`
Check if the backend server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Cora Chatbot Backend is running"
}
```

## Development

### Enable Debug Logging
In browser console, run:
```javascript
window.CORA_DEBUG = true
```

### Install Development Dependencies
```bash
npm install --save-dev nodemon
```

### Run in Watch Mode
```bash
npm run dev
```

Server will auto-restart when files change.

## Deployment

### For Production:
1. Update `.env` with your production settings:
   - Add production OpenAI API key
   - Update `ALLOWED_ORIGINS` with your production domain
   - Set `NODE_ENV=production`

2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "cora-chatbot"
pm2 startup
pm2 save
```

3. Use reverse proxy (nginx, Apache) to forward requests to port 5000

## Troubleshooting

### "Connection error: The backend server is not running"
- Ensure you've started the backend server: `npm start`
- Check that port 5000 is not already in use
- Verify backend is running: `curl http://localhost:5000/health`

### "Invalid OpenAI API key"
- Double-check your OpenAI API key in `.env`
- Ensure key is valid and has API credits
- Visit [OpenAI Console](https://platform.openai.com/) to verify

### CORS Errors
- Update `ALLOWED_ORIGINS` in `.env` with your domain
- For local development, default settings should work
- Format: `http://domain1.com,http://domain2.com` (comma-separated)

### Server crashes on startup
- Check Node.js version: `node --version` (needs v16+)
- Verify all dependencies installed: `npm install`
- Check console output for specific errors

## API Costs
Each conversation uses tokens from your OpenAI account:
- Input tokens: $0.005 per 1K tokens (GPT-4o)
- Output tokens: $0.015 per 1K tokens (GPT-4o)

Monitor usage at: https://platform.openai.com/account/usage/overview

## Security Notes
- Never commit `.env` file to Git (already in `.gitignore`)
- Keep OpenAI API key confidential
- Implement rate limiting in production
- Consider IP whitelisting for backend access
- Use HTTPS in production

## Support
For issues or questions:
- Email: info@coraglobalsolutions.com
- Phone: +234 913 088 0553

---
**Last Updated:** February 2026
