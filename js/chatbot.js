/* ============================================
   CORA GLOBAL SOLUTIONS - AI CHATBOT
   Powered by OpenAI GPT-4o
   ============================================ */

class CoraChat {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.conversationState = 'greeting';
    this.userPreferences = {};
    this.sessionId = null;
    this.apiUrl = 'http://localhost:5000/api/chat';
    this.isLoading = false;
    
    this.init();
  }
  
  init() {
    this.createChatHTML();
    this.attachEventListeners();
    this.initializeSession();
    this.debugLog('Chat initialized with OpenAI integration');
  }
  
  async initializeSession() {
    try {
      const response = await fetch(`${this.apiUrl}/session`);
      const data = await response.json();
      this.sessionId = data.sessionId;
      this.debugLog('Session initialized:', this.sessionId);
    } catch (error) {
      this.debugLog('Failed to initialize session:', error);
    }
  }
  
  createChatHTML() {
    const chatHTML = `
      <div class="chat-button" title="Open Chat (Press C)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="chat-badge">1</span>
      </div>
      
      <div class="chat-window" style="display: none;">
        <div class="chat-header">
          <div class="chat-title">
            <h4>Cora Assistant 🤖</h4>
            <p>Online • Powered by OpenAI</p>
          </div>
          <button class="chat-close" type="button">×</button>
        </div>
        
        <div class="chat-messages">
          <div class="chat-message bot-message">
            <div class="chat-bubble">
              <p>Welcome to Cora Global Solutions! 👋</p>
              <p>How can we assist you today?</p>
            </div>
          </div>
        </div>
        
        <div class="chat-suggestions">
          <button class="chat-suggestion" data-action="travel">
            ✈️ Book Travel Service
          </button>
          <button class="chat-suggestion" data-action="data">
            📊 Data Consultation
          </button>
          <button class="chat-suggestion" data-action="marketing">
            📈 Digital Marketing
          </button>
          <button class="chat-suggestion" data-action="general">
            ❓ General Questions
          </button>
        </div>
        
        <div class="chat-input-area">
          <input type="text" class="chat-input" placeholder="Type your message..." />
          <button class="chat-send" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    const chatContainer = document.createElement('div');
    chatContainer.id = 'cora-chat-container';
    chatContainer.innerHTML = chatHTML;
    document.body.appendChild(chatContainer);
  }
  
  attachEventListeners() {
    const chatButton = document.querySelector('.chat-button');
    const chatClose = document.querySelector('.chat-close');
    const chatWindow = document.querySelector('.chat-window');
    const chatInput = document.querySelector('.chat-input');
    const chatSend = document.querySelector('.chat-send');
    const suggestions = document.querySelectorAll('.chat-suggestion');
    
    // Toggle chat window
    chatButton.addEventListener('click', () => this.toggleChat());
    chatClose.addEventListener('click', () => this.toggleChat());
    
    // Send message
    chatSend.addEventListener('click', () => this.sendMessage());
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Suggestion buttons
    suggestions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleSuggestionClick(action);
      });
    });
  }
  
  toggleChat() {
    const chatWindow = document.querySelector('.chat-window');
    const chatInput = document.querySelector('.chat-input');
    
    this.isOpen = !this.isOpen;
    chatWindow.style.display = this.isOpen ? 'flex' : 'none';
    
    if (this.isOpen) {
      setTimeout(() => chatInput.focus(), 100);
    }
    
    this.debugLog('Chat toggled:', this.isOpen);
  }
  
  async sendMessage() {
    const chatInput = document.querySelector('.chat-input');
    const message = chatInput.value.trim();
    
    if (!message || this.isLoading) return;
    
    // Add user message
    this.addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    this.isLoading = true;
    
    try {
      // Call backend API
      const response = await fetch(`${this.apiUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: this.sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update session ID if provided
      if (data.sessionId) {
        this.sessionId = data.sessionId;
      }
      
      this.removeTypingIndicator();
      this.addMessage(data.response, 'bot');
      
    } catch (error) {
      this.removeTypingIndicator();
      this.debugLog('Error calling API:', error);
      
      // Provide offline responses while API is unavailable
      const offlineResponse = this.getOfflineResponse(message);
      this.addMessage(offlineResponse, 'bot');
    } finally {
      this.isLoading = false;
    }
  }
  
  getOfflineResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Contact information
    if (msg.includes('contact') || msg.includes('phone') || msg.includes('email')) {
      return '📞 **Contact Cora Global Solutions**\n\n' +
        'Phone: +234 913 088 0553\n' +
        'Email: info@coraglobalsolutions.com\n' +
        'WhatsApp: +234 913 088 0553\n' +
        'Address: E 304 Rd3, Ikota shopping Complex, Lekki 106104, Lagos, Nigeria';
    }
    
    // Services
    if (msg.includes('service') || msg.includes('offer') || msg.includes('what do you')) {
      return '✈️ **Our Services:**\n\n' +
        '1. **Travel Bookings** - Flight bookings and travel management\n' +
        '2. **Data Analytics** - Business intelligence and data consulting\n' +
        '3. **Digital Marketing** - SEO, content marketing, and social media strategies\n\n' +
        'Want to book? Visit our booking page or contact us!';
    }
    
    // Booking
    if (msg.includes('book') || msg.includes('schedule') || msg.includes('consultation')) {
      return '📅 Ready to book? Visit our booking page at:\nhttps://yoursite.com/booking.html\n\n' +
        'Or contact us directly:\n' +
        'Phone: +234 913 088 0553\n' +
        'WhatsApp: https://wa.me/2349130880553';
    }
    
    // Default response
    return '🤖 **Note:** Full AI responses are temporarily offline. I can help with basic info!\n\n' +
      'Try asking about:\n' +
      '• Our services\n' +
      '• Contact information\n' +
      '• How to book\n\n' +
      '❌ To restore full AI features:\n' +
      '1. Get OpenAI API key from https://platform.openai.com/api-keys\n' +
      '2. Add it to backend/.env\n' +
      '3. Run: npm start in backend folder';
  }
  
  removeTypingIndicator() {
    const existingIndicator = document.querySelector('.typing-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
  }
  
  showTypingIndicator() {
    const chatMessages = document.querySelector('.chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.innerHTML = '<div class="chat-bubble"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  addMessage(text, sender = 'user') {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    this.messages.push({ text, sender, timestamp: new Date() });
  }
  
  showTypingIndicator() {
    const chatMessages = document.querySelector('.chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.innerHTML = `
      <div class="chat-bubble">
        <div class="typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    typingDiv.id = 'typing-indicator';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }
  
  handleSuggestionClick(action) {
    const messages = {
      travel: 'I want to book a flight',
      data: 'I need data analysis services',
      marketing: 'I\'m interested in digital marketing',
      general: 'I have a general question'
    };
    
    const message = messages[action] || 'Can you help me?';
    const chatInput = document.querySelector('.chat-input');
    chatInput.value = message;
    chatInput.focus();
    this.sendMessage();
  }

  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  debugLog(...args) {
    if (window.CORA_DEBUG) {
      console.log('[CORA CHAT]', ...args);
    }
  }
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.coraChat = new CoraChat();
});

// Inject chat styles
const chatStyles = `
#cora-chat-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00a8e8, #0085a8);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 168, 232, 0.3);
  transition: all 0.3s ease;
  z-index: 999;
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(0, 168, 232, 0.4);
}

.chat-button svg {
  width: 28px;
  height: 28px;
}

.chat-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b35;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.chat-window {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 380px;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 999;
  animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.chat-header {
  background: linear-gradient(135deg, #1a3a52, #2d5a8c);
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 168, 232, 0.2);
}

.chat-title h4 {
  color: white;
  margin: 0;
  font-size: 1.1rem;
}

.chat-title p {
  color: #b0d4e8;
  font-size: 0.8rem;
  margin: 0;
}

.chat-close {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-close:hover {
  transform: rotate(90deg);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  display: flex;
  animation: slideInUp 0.4s ease;
}

.chat-message.user-message {
  justify-content: flex-end;
}

.chat-message.bot-message {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 70%;
  padding: 1rem;
  border-radius: 12px;
  word-wrap: break-word;
}

.bot-message .chat-bubble {
  background: #f0f4f8;
  color: #1a3a52;
  border-bottom-left-radius: 2px;
}

.user-message .chat-bubble {
  background: #00a8e8;
  color: white;
  border-bottom-right-radius: 2px;
}

.chat-bubble p {
  margin: 0;
  font-size: 0.95rem;
}

.chat-bubble p:not(:last-child) {
  margin-bottom: 0.5rem;
}

.typing {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 20px;
}

.typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00a8e8;
  animation: bounce 1.4s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-suggestions {
  padding: 0 1rem 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.chat-suggestion {
  background: #f0f4f8;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #1a3a52;
  border: none;
}

.chat-suggestion:hover {
  background: #00a8e8;
  color: white;
  transform: translateX(4px);
}

.chat-input-area {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}

.chat-input {
  flex: 1;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
}

.chat-input:focus {
  outline: none;
  border-color: #00a8e8;
  box-shadow: 0 0 0 3px rgba(0, 168, 232, 0.1);
}

.chat-send {
  background: #00a8e8;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.chat-send:hover {
  background: #0085a8;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 40px);
    max-width: 100%;
    right: 20px;
    left: 20px;
    bottom: 80px;
    max-height: calc(100vh - 120px);
  }
  
  .chat-button {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
  
  .chat-bubble {
    max-width: 85%;
  }
}
`;

const styleTag = document.createElement('style');
styleTag.textContent = chatStyles;
document.head.appendChild(styleTag);
