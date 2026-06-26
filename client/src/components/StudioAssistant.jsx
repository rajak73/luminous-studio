import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import api from '../api';
import './StudioAssistant.css';

const FAQ_RESPONSES = [
  { keywords: ['services', 'offer', 'packages'], answer: 'We offer a range of photography services including Wedding Photography, Pre-Wedding Shoots, Birthday Events, Corporate Coverage, and Portrait Sessions.' },
  { keywords: ['price', 'cost', 'pricing', 'charge'], answer: 'Our pricing varies by package. For example, Portrait sessions start at ₹8,000, and comprehensive Wedding packages start at ₹45,000. You can view all pricing on our Services page.' },
  { keywords: ['book', 'booking', 'schedule'], answer: 'You can easily book us by adding your desired packages to the Cart and proceeding to checkout. Our team will contact you to confirm the date and details.' },
  { keywords: ['contact', 'email', 'phone', 'location', 'address'], answer: 'You can reach us through our contact page or email us directly. Our physical studio is located in Hyderabad, Telangana.' },
  { keywords: ['portfolio', 'gallery', 'past work', 'photos'], answer: 'Our Portfolio features our best work categorized into Weddings, Birthdays, Corporate events, and more. Feel free to explore it!' }
];

const DEFAULT_ANSWER = 'I can help with Luminos Studio services, booking, portfolio, and contact details. For other questions, please use the booking/contact form.';

const StudioAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to Luminos Studio. How can I help you today?', options: ['What services do you offer?', 'What is your pricing?', 'How do I book?'] }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Hide entirely if on admin routes
  if (location.pathname.startsWith('/admin')) return null;

  const getFaqResponse = (query) => {
    const lowerQ = query.toLowerCase();
    for (let faq of FAQ_RESPONSES) {
      if (faq.keywords.some(kw => lowerQ.includes(kw))) {
        return faq.answer;
      }
    }
    return DEFAULT_ANSWER;
  };

  const processUserMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Simulate network/typing delay
    setTimeout(async () => {
      // Check if AI is enabled via env (Mode B)
      const aiEnabled = import.meta.env.VITE_AI_ENABLED === 'true';
      
      let botReply = '';
      if (aiEnabled && import.meta.env.VITE_AI_API_KEY) {
        // Mode B placeholder (if AI proxy route was created)
        try {
          const { data } = await api.post('/assistant/chat', { message: text });
          botReply = data.reply;
        } catch (err) {
          botReply = getFaqResponse(text); // Fallback on API failure
        }
      } else {
        // Mode A: Local FAQ
        botReply = getFaqResponse(text);
      }

      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSend = (e) => {
    e.preventDefault();
    processUserMessage(input);
  };

  return (
    <div className="assistant-widget">
      {!isOpen ? (
        <button className="assistant-btn" onClick={() => setIsOpen(true)} aria-label="Open Assistant">
          <FiMessageSquare size={24} />
        </button>
      ) : (
        <div className="assistant-panel">
          <div className="assistant-header">
            <div className="assistant-header-title">
              <FiMessageSquare /> Studio Assistant
            </div>
            <button className="assistant-close" onClick={() => setIsOpen(false)}>
              <FiX size={20} />
            </button>
          </div>
          
          <div className="assistant-body">
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={`assistant-msg ${msg.sender}`}>
                  {msg.text}
                </div>
                {msg.options && msg.sender === 'bot' && (
                  <div className="assistant-options">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i} 
                        className="assistant-option-btn"
                        onClick={() => processUserMessage(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="assistant-typing">
                <div className="assistant-dot" />
                <div className="assistant-dot" />
                <div className="assistant-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="assistant-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              className="assistant-input" 
              placeholder="Ask a question..." 
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="assistant-send" disabled={!input.trim()}>
              <FiSend size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudioAssistant;
