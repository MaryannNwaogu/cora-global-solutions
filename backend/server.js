const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatbotRoutes = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Health check endpoint
app.get('/welcome', (req, res) => {
  res.json({
    reply: "Hello 👋 Welcome to Cora Global Solutions. Tell me how I can help you with travel, marketing, analytics, or web development."
  });
});

// Routes
app.use('/api/chat', chatbotRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Cora Chatbot Backend running on port ${PORT}`);
  console.log(`🤖 Ready to handle conversations with OpenAI`);
  
  // Check if API key is configured
  if (process.env.OPENAI_API_KEY) {
    console.log('✅ OpenAI API key is configured');
  } else {
    console.warn('⚠️  OpenAI API key is NOT configured. Chatbot will use fallback responses.');
    console.warn('📝 To enable full AI capabilities, set OPENAI_API_KEY in your environment variables.');
  }
});
