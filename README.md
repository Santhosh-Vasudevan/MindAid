# ChatGPT Clone

A fully functional ChatGPT clone built with React (JavaScript) - powered by **Google Gemini AI**!

## Features

✨ **Core Features:**
- 🤖 **Real AI Integration** - Powered by Google's Gemini AI model
- 💬 Real-time chat interface with actual AI responses
- 🎨 Authentic ChatGPT-like UI design
- 📱 Responsive design (works on mobile and desktop)
- 💾 Multiple chat conversations support
- 🗑️ Delete chat functionality
- ⌨️ Auto-expanding text input
- 🎯 Example prompts to get started
- ⚡ Typing indicators for AI responses
- 🔑 Secure API key management (stored locally)
- 📝 Conversation history and context awareness

## Setup Instructions

### 1. Get Your Free Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (keep it safe!)

### 2. Install and Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

   The app will automatically open in your browser at `http://localhost:3000`

3. **Enter your API key:**
   - A modal will appear asking for your Gemini API key
   - Paste your API key and click "Save"
   - Your key is stored securely in your browser's local storage

4. **Start chatting!**
   - Type your message and press Enter
   - The AI will respond with real, intelligent answers
   - Your conversation history is maintained for context

## How It Works

This application uses **Google's Gemini AI** (formerly Bard) to provide intelligent responses:

1. **User sends a message** → Message is added to the conversation
2. **API call to Gemini** → Your message + conversation history is sent to Google's AI
3. **AI processes** → Gemini analyzes the context and generates a response
4. **Response displayed** → The AI's answer appears in the chat
5. **Context maintained** → Previous messages are remembered for follow-up questions

## Project Structure

```
OpenMind/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.js  # API key configuration modal
│   │   ├── ChatInput.js    # Message input component
│   │   ├── ChatMessage.js  # Individual message display
│   │   └── Sidebar.js      # Chat history sidebar
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── styles.css          # Global styles
├── .babelrc                # Babel configuration
├── webpack.config.js       # Webpack configuration
└── package.json            # Project dependencies
```

## Key Components

### App.js
- Main application logic with AI integration
- Manages chat state and conversations
- Handles API calls to Gemini AI
- Provides chat switching and history functionality
- Manages API key storage

### ApiKeyModal
- Secure API key input interface
- Instructions for obtaining Gemini API key
- Local storage management
- Show/hide password functionality

### Sidebar
- Displays list of all chat conversations
- Create new chat button
- Delete chat functionality
- API settings access
- Active chat highlighting

### ChatMessage
- Renders individual messages
- Different styling for user vs AI messages
- Typing indicator animation
- Message formatting support

### ChatInput
- Auto-expanding textarea
- Send button with icon
- Enter to send (Shift+Enter for new line)
- Disabled state when empty

## API Integration Details

### Gemini AI API
The app uses Google's Gemini Pro model with the following configuration:

- **Model:** `gemini-pro`
- **Temperature:** 0.9 (creative responses)
- **Max Tokens:** 2048
- **Context:** Full conversation history sent with each request

### Privacy & Security
- ✅ API key stored only in your browser (localStorage)
- ✅ No backend server - direct browser to Google AI communication
- ✅ Your conversations are not stored anywhere except your browser
- ✅ API key can be changed anytime via settings

## Alternative AI Models

### Using OpenAI Instead

To switch to OpenAI's GPT models, modify the API call in `App.js`:

```javascript
const response = await fetch(
  'https://api.openai.com/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', // or 'gpt-4'
      messages: conversationHistory,
      temperature: 0.9,
      max_tokens: 2048
    })
  }
);
```

### Using Other AI APIs
The architecture supports any REST-based AI API. Just modify:
1. The API endpoint URL
2. The request format
3. The response parsing logic

### Styling

All styles are in `src/styles.css`. The color scheme follows ChatGPT's dark theme:
- Background: `#343541`
- Sidebar: `#202123`
- Accents: `#10a37f` (green)
- User messages: `#5436da` (purple)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- **React 18** - UI framework
- **Google Gemini AI** - AI language model
- **Webpack 5** - Module bundler
- **Babel** - JavaScript compiler
- **Font Awesome** - Icons
- **CSS3** - Styling and animations

## Troubleshooting

### API Key Issues
- Make sure you copied the entire API key
- Check that your API key is activated in Google AI Studio
- Try generating a new API key if problems persist

### API Errors
- Ensure you have internet connection
- Check browser console for detailed error messages
- Verify your API key hasn't been revoked

### Rate Limiting
- Gemini has free tier rate limits
- If you hit limits, wait a few minutes before trying again
- Consider upgrading to paid tier for higher limits

## Cost Information

**Google Gemini AI:**
- ✅ **Free tier available** with generous limits
- Great for development and personal use
- No credit card required to get started

**OpenAI GPT:**
- Requires paid API access
- Pay-per-use pricing
- More expensive but very capable

## Notes

This application provides a **fully functional AI chat experience** using real AI models. The conversation quality depends on:
- The AI model you choose (Gemini, GPT, etc.)
- Your API key's access level
- The conversation context you provide

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications!

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

Built with ❤️ using React
