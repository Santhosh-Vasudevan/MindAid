# MindAid - AI-Powered Mental Health Companion 🧠💙

> **A compassionate, 24×7 mental health support chatbot providing emotional assistance, mood tracking, crisis intervention, and wellness tools.**

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-purple)
![License](https://img.shields.io/badge/License-Demo-green)

## 🌟 Why MindAid?

Mental health services are often:
- ❌ **Expensive** - Therapy costs $100-300 per session
- ❌ **Limited Availability** - Not accessible 24×7
- ❌ **Stigmatized** - Fear of judgment prevents people from seeking help
- ❌ **Impersonal** - Existing chatbots feel robotic

**MindAid solves these problems by providing:**
- ✅ **Free, unlimited access** to emotional support
- ✅ **24×7 availability** - Always there when you need it
- ✅ **Private & judgment-free** - No stigma, complete anonymity
- ✅ **Empathetic AI** - Warm, compassionate, human-like conversations
- ✅ **Comprehensive tools** - Mood tracking, journaling, breathing exercises

---

## ✨ Key Features

### 💬 **Empathetic AI Conversations**
- Powered by Google Gemini AI (gemini-2.5-flash)
- Trained with mental health-focused system instructions
- Provides validation, active listening, and evidence-based coping strategies
- Multilingual support

### 📊 **Mood Tracking**
- Daily emotional check-ins with 5 mood levels
- Visual mood timeline and trend analysis
- 7-day average mood scoring
- Mood-influenced AI responses

### 🚨 **Crisis Detection & Intervention**
- Real-time detection of crisis keywords (suicide, self-harm, etc.)
- Immediate display of emergency resources
- National Suicide Prevention Lifeline (988)
- Crisis Text Line (741741)
- Emergency services (911)

### 📈 **Wellness Dashboard**
- Comprehensive mental health analytics
- Mood statistics and trends
- Journal and conversation metrics
- Personalized wellness tips

### 📝 **Private Journaling**
- 8 therapeutic reflection prompts
- Completely private - stored locally only
- Never sent to server or AI
- Entry history with timestamps

### 🌬️ **Guided Breathing Exercises**
- 3 breathing techniques (4-7-8, Box, Calm)
- Animated visual guidance
- Cycle tracking and timer
- Benefits information

---

## 🎯 Who Is This For?

- **Students** struggling with academic stress
- **Working professionals** dealing with burnout
- **Anyone** feeling lonely, anxious, or overwhelmed
- **People** who can't afford traditional therapy
- **Individuals** uncomfortable with in-person counseling
- **Night owls** needing support outside business hours

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key ([Get one free](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/openmind.git

# Navigate to project directory
cd openmind

# Install dependencies
npm install

# Start development server
npm start
```

The app will open automatically at `http://localhost:3000`

### First-Time Setup

1. **Enter API Key**: When the app opens, you'll see an API key modal
2. **Get Free Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get your free API key
3. **Test Connection**: Click "Test Connection" to verify
4. **Save**: Your key is stored securely in browser localStorage
5. **Start Chatting**: Select your mood and begin your conversation with MindAid

---

## 📱 How to Use

### **Chat View** 💬
- Start conversations with the AI
- Share your thoughts, feelings, and concerns
- Receive empathetic, supportive responses
- Crisis keywords trigger immediate help resources

### **Dashboard View** 📊
- View mood trends over the past 7 days
- Track journal entries and conversations
- See wellness tips tailored to your needs
- Monitor your mental health journey

### **Journal View** 📝
- Write private reflections using guided prompts
- Keep a personal mental health journal
- All entries stored locally - 100% private
- Review past entries anytime

### **Breathing View** 🌬️
- Practice stress-relief breathing techniques
- Follow animated visual guidance
- Choose from 3 scientifically-backed patterns
- Reduce anxiety in minutes

---

## 🛡️ Privacy & Security

### What We Store (Locally Only):
- ✅ Conversations with AI
- ✅ Mood history with timestamps
- ✅ Journal entries
- ✅ API key (encrypted)

### What We DON'T Store:
- ❌ No personal information collected
- ❌ No data sent to external servers
- ❌ No analytics or tracking
- ❌ Journal entries never shared with AI

**Your data never leaves your browser.** Everything is stored in localStorage and can be deleted anytime.

---

## 🎨 Design Philosophy

- **Calming Color Palette**: Purple gradients for trust and calm
- **Dark Theme**: Reduces eye strain for late-night users
- **Smooth Animations**: Creates a soothing user experience
- **Accessible**: High contrast, keyboard navigation, screen reader friendly
- **Minimalist**: Clean interface focuses on what matters - your wellbeing

---

## 🧪 Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18.2.0 |
| **Build Tool** | Webpack 5 |
| **Transpiler** | Babel |
| **Styling** | CSS3 with gradients & animations |
| **AI Model** | Google Gemini (gemini-2.5-flash) |
| **Icons** | Font Awesome |
| **Data Storage** | Browser localStorage |
| **Deployment** | Static hosting (no backend needed) |

---

## 📂 Project Structure

```
OpenMind/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   ├── ChatMessage.js      # Message display
│   │   ├── ChatInput.js        # Input with disclaimer
│   │   ├── MoodTracker.js      # Mood check-in modal
│   │   ├── CrisisAlert.js      # Crisis intervention modal
│   │   ├── WellnessDashboard.js # Analytics dashboard
│   │   ├── JournalEntry.js     # Private journaling
│   │   ├── BreathingExercise.js # Guided breathing
│   │   └── ApiKeyModal.js      # API key management
│   ├── App.js                  # Main app orchestrator
│   ├── index.js                # React entry point
│   └── styles.css              # Mental health themed CSS
├── package.json                # Dependencies
├── webpack.config.js           # Build configuration
├── README.md                   # This file
├── MENTAL_HEALTH_FEATURES.md   # Detailed feature documentation
└── TESTING_CHECKLIST.md        # QA testing guide
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test
```

### Environment Configuration

No environment variables needed! All configuration is managed through the UI.

---

## 🌍 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

---

## 🤝 Contributing

This is a demo project for mental health awareness. Contributions welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 Disclaimer

**⚠️ IMPORTANT: MindAid is a supportive tool, NOT a replacement for professional mental health care.**

If you are experiencing a mental health crisis, please contact:
- **Emergency Services**: 911 (US)
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text "HELLO" to 741741 (US)
- **International Association for Suicide Prevention**: [https://www.iasp.info/resources/Crisis_Centres/](https://www.iasp.info/resources/Crisis_Centres/)

MindAid is designed to provide emotional support and coping tools, but it cannot replace the expertise of licensed mental health professionals.

---

## 📄 License

This project is a demo application for educational and mental health awareness purposes.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For providing accessible AI technology
- **React Community** - For the amazing framework
- **Mental Health Advocates** - For inspiring this project
- **You** - For caring about mental health ❤️

---

## 📞 Support & Feedback

Have questions or suggestions? Open an issue on GitHub or contribute to make mental health support more accessible for everyone.

---

<div align="center">

**Remember: It's okay to not be okay. You're not alone. 💙**

*Built with ❤️ for mental health awareness*

</div>
