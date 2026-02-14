const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt for Cora's assistant
const SYSTEM_PROMPT = `You are Cora, an AI assistant for Cora Global Solutions LTD, a premium consulting firm specializing in:
1. Executive Travel Services - Flight bookings, corporate travel management, and travel arrangements
2. Data Analytics - Business intelligence, data insights, and analytics consulting
3. Digital Marketing - SEO optimization, content marketing, social media management, and digital campaigns

Company Information:
- Email: info@coraglobalsolutions.com
- Phone: +234 913 088 0553
- WhatsApp: https://wa.me/2349130880553
- Address: E 304 Rd3, Ikota shopping Complex, V.G.C, Lekki 106104, Lagos, Nigeria
- Website: https://www.coraglobalsolutions.com
- Tagline: Digital Innovation for Growth

Your role is to:
1. Answer questions about our services with enthusiasm and professionalism
2. Help users understand how our services can benefit their business
3. Provide information about pricing, availability, and consultation scheduling
4. Direct users to appropriate resources or team members when needed
5. Be conversational, helpful, and solution-oriented
6. Always mention our contact details when relevant
7. Guide users to book consultations or services

Keep responses concise (2-4 sentences max for most queries). Be friendly and professional. Use relevant emojis occasionally to match the web style. Always maintain brand consistency.`;

// Store conversation history per session
const conversationHistory = new Map();

// Generate unique session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Fallback responses for when OpenAI API is not available
function getFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  // Travel-related queries
  if (msg.includes('travel') || msg.includes('flight') || msg.includes('book')) {
    return '✈️ We offer premium executive travel services including flight bookings, corporate travel management, and travel arrangements. Contact us at +234 913 088 0553 or info@coraglobalsolutions.com for a consultation!';
  }
  
  // Data analytics queries
  if (msg.includes('data') || msg.includes('analytics') || msg.includes('analytics')) {
    return '📊 Our data analytics services provide business intelligence, data insights, and consulting. We help businesses make data-driven decisions. Reach out to discuss your analytics needs!';
  }
  
  // Marketing queries
  if (msg.includes('market') || msg.includes('seo') || msg.includes('marketing') || msg.includes('digital')) {
    return '📈 We specialize in digital marketing including SEO optimization, content marketing, social media management, and digital campaigns. Let\'s grow your brand together!';
  }
  
  // Contact information
  if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('address')) {
    return '📞 **Contact Cora Global Solutions:**\n\n📧 Email: info@coraglobalsolutions.com\n📱 Phone: +234 913 088 0553\n💬 WhatsApp: https://wa.me/2349130880553\n📍 Address: E 304 Rd3, Ikota shopping Complex, Lekki 106104, Lagos, Nigeria';
  }
  
  // Default greeting
  return '👋 Hello! I\'m Cora, your AI assistant. I can help you with travel bookings, data analytics, or digital marketing services. What can I assist you with today?';
}

// POST /api/chat/message - Handle chatbot responses
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    const trimmedMessage = message.trim();
    let session = sessionId || generateSessionId();

    // Get or initialize conversation history
    let history = conversationHistory.get(session) || [];

    // Add user message to history
    history.push({
      role: 'user',
      content: trimmedMessage
    });

    // Keep history to last 20 messages to avoid token overflow
    if (history.length > 20) {
      history = history.slice(-20);
    }

    let assistantMessage;

    // Try to use OpenAI API if key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        // Call OpenAI API with conversation history
        const response = await openai.chat.completions.create({
          model: 'gpt-4o', // Using latest available model
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            ...history
          ],
          temperature: 0.7,
          max_tokens: 300,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.5
        });

        assistantMessage = response.choices[0].message.content;

        // Add assistant response to history
        history.push({
          role: 'assistant',
          content: assistantMessage
        });

        // Save updated history
        conversationHistory.set(session, history);

        return res.json({
          response: assistantMessage,
          sessionId: session,
          model: response.model,
          usage: {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens
          }
        });

      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        
        // Check for specific error types
        if (openaiError.status === 401) {
          console.warn('Invalid OpenAI API key. Using fallback responses.');
          // Fall through to fallback
        } else if (openaiError.status === 429) {
          return res.status(429).json({ 
            error: 'Rate limit exceeded. Please try again later.' 
          });
        } else {
          console.warn('OpenAI API error, using fallback responses:', openaiError.message);
          // Fall through to fallback
        }
      }
    } else {
      console.warn('OpenAI API key not configured. Using fallback responses.');
    }

    // Use fallback response
    assistantMessage = getFallbackResponse(trimmedMessage);

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Save updated history
    conversationHistory.set(session, history);

    res.json({
      response: assistantMessage,
      sessionId: session,
      model: 'fallback',
      note: 'Using fallback responses. Set OPENAI_API_KEY in environment for full AI capabilities.'
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate response. Please try again later.'
    });
  }
});

// POST /api/chat/clear - Clear conversation history
router.post('/clear', (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessionId) {
      conversationHistory.delete(sessionId);
      res.json({ message: 'Conversation history cleared', sessionId });
    } else {
      conversationHistory.clear();
      res.json({ message: 'All conversation histories cleared' });
    }

  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// GET /api/chat/session - Get or create new session
router.get('/session', (req, res) => {
  const sessionId = generateSessionId();
  res.json({ sessionId });
});

module.exports = router;
