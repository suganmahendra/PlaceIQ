# 🎓 PlaceIQ - Advanced AI & DS Placement Platform

**PlaceIQ** is a modern, intelligent, AI-powered learning platform designed specifically for B.Tech Artificial Intelligence & Data Science students to become placement-ready through structured coding practice and industry-required courses.

## 🌟 Features

### 🔐 Authentication ✅ **FULLY IMPLEMENTED**
- ✅ **Student Registration** (Email/Password + Google OAuth)
- ✅ **Mentor Registration** (Email/Password + Google OAuth)
- ✅ **Student Login** with AI Robot welcome
- ✅ **Mentor Login** with professional styling
- ✅ **Password Recovery** with email reset
- ✅ **Google OAuth Integration** for both roles
- ✅ **Automatic Profile Creation** via database triggers
- ✅ **Security Event Logging** for all auth actions
- ✅ **Profile Completion Flow** (optional)
- ✅ **Role-Based Access Control** with RLS policies

**📚 Documentation:**
- [Complete Setup Guide](./backend/COMPLETE_SETUP_GUIDE.md) - Full Supabase & OAuth setup
- [Auth API Reference](./backend/AUTH_API_REFERENCE.md) - All authentication methods
- [Implementation Summary](./backend/IMPLEMENTATION_SUMMARY.md) - What's been completed

### 📊 Student Dashboard
- **Welcome Banner** with personalized greetings
- **Overall Progress Ring** showing learning completion
- **Stats Overview** (Streak, XP, Skill Level, Modules)
- **Recommended Content** based on learning path
- **Placement Matches Preview**
- **Skill Analysis** with readiness score
- **Daily Challenge** to maintain streak

### 💻 Coding Section
- **Language Mastery**: Python & Java
- **Structured Learning Path**: Beginner → Intermediate → Advanced
- **Video-Based Learning** with YouTube integration
- **Focus Tracking**: 
  - Pause count monitoring
  - Skip attempt tracking
  - Playback speed change detection
- **Interactive Features**:
  - Concept quizzes
  - Practice tasks
  - Completion status
- **Performance Indicators**: Weak / Average / Bright
- **Daily Coding Streak** tracking

### 📚 Courses Section
8 Industry-Ready Courses:
1. **Data Structures & Algorithms** (Intermediate)
2. **Mathematics for AI** (Intermediate)
3. **Data Analysis** (Beginner)
4. **Machine Learning** (Advanced)
5. **Deep Learning Intro** (Advanced)
6. **SQL & Databases** (Beginner)
7. **Tools & Git** (Beginner)
8. **Aptitude & Reasoning** (Beginner)

Each course includes:
- Structured modules
- YouTube playlist integration
- Progress tracking
- Quiz & task buttons
- Focus score indicators
- Certificate placeholders

### 💼 Placements
- **AI-Powered Role Matching**
- **Match Percentage** based on skills
- **Required Skills Checklist**
- **Eligibility Status**: Eligible / Almost Ready / Not Ready
- **Salary Range** information
- **Role Recommendations**:
  - AI Engineer
  - Data Analyst
  - ML Intern
  - Software Engineer

### 📈 Analytics & Insights
- **Weekly Learning Report**
  - Coding vs Courses comparison
  - Daily activity breakdown
- **Focus vs Distraction Chart**
- **Skill Readiness Score**
- **Performance Insights**:
  - Strengths identification
  - Areas to improve
- **Learning Patterns** visualization

### 🤖 AI Chatbot
- **24/7 Learning Assistant**
- **Contextual Help** for:
  - Coding concepts
  - Course recommendations
  - Study tips
  - Doubt clarification
- **Chat Interface** with typing indicators
- **Message History**

### 👤 Profile & Settings
- **User Profile** with stats
- **Progress Overview**
- **Skill Levels** visualization
- **Certificates Earned**
- **Notification Preferences**
- **Security Settings**
- **Account Management**

## 🎨 Design Features

### Theme
- **Modern, Premium Light UI**
- **Primary Colors**: Lavender, soft purple, pastel gradients
- **Design Style**: Clean, minimal, professional EdTech look
- **Typography**: Modern sans-serif (Inter/Poppins style)
- **Animations**: Smooth micro-interactions, progress animations, hover effects

### UI/UX Highlights
- **Responsive Design**: Desktop-first, fully responsive for tablet & mobile
- **Gradient Backgrounds**: Fluid, colorful backgrounds throughout
- **Glass Morphism**: Modern card designs with subtle transparency
- **Micro-animations**: Engaging hover effects and transitions
- **Progress Visualizations**: Rings, bars, and charts
- **Badge System**: Difficulty, status, and achievement badges

## 🛠️ Tech Stack

### Core
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7

### Styling
- **CSS Framework**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Utilities**: clsx, tailwind-merge

### State Management
- React Context (lightweight state)
- Component-level state with hooks

### Backend (Completed)
- ✅ **Supabase** (Database & Auth) - Fully configured
- ✅ **Complete Database Schema** - 17+ tables with RLS
- ✅ **Authentication System** - Email/Password + Google OAuth
- 🔄 **YouTube API** (Video tracking) - Planned
- 🔄 **Email Service** (Notifications) - Planned

## 📁 Project Structure

```
PlaceIQ/
├── src/
│   ├── components/
│   │   ├── coding/
│   │   │   ├── ConceptCard.tsx
│   │   │   └── LanguageCard.tsx
│   │   ├── courses/
│   │   │   └── CourseCard.tsx
│   │   ├── landing/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── learning/
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── ProgressRing.tsx
│   │       └── VideoPlayer.tsx
│   ├── data/
│   │   ├── coursesData.ts
│   │   └── pythonConcepts.ts
│   ├── layouts/
│   │   ├── DashboardLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── StudentLogin.tsx
│   │   │   ├── StudentRegister.tsx
│   │   │   ├── MentorRegister.tsx
│   │   │   └── RegisterSelection.tsx
│   │   ├── public/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── LearningPage.tsx
│   │   │   └── ContactPage.tsx
│   │   └── student/
│   │       ├── DashboardHome.tsx
│   │       ├── CodingHomePage.tsx
│   │       ├── PythonCodingPage.tsx
│   │       ├── CoursesHomePage.tsx
│   │       ├── AnalyticsPage.tsx
│   │       ├── PlacementsPage.tsx
│   │       ├── AIChatbotPage.tsx
│   │       ├── ProfilePage.tsx
│   │       └── LearningPathPage.tsx
│   ├── types/
│   │   ├── coding.ts
│   │   └── course.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd PlaceIQ
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open browser
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📱 Routes

### Public Routes
- `/` - Landing Page
- `/about` - About Page
- `/learning-preview` - Learning Preview
- `/contact` - Contact Page
- `/register` - Registration Selection
- `/register-student` - Student Registration
- `/register-mentor` - Mentor Registration
- `/login-mentor` - Mentor Login
- `/complete-profile` - Profile Completion (Optional)

### Student Dashboard Routes
- `/student/dashboard` - Dashboard Home
- `/student/coding` - Coding Home
- `/student/coding/python` - Python Learning
- `/student/coding/java` - Java Learning (Coming Soon)
- `/student/courses` - Courses Home
- `/student/courses/:slug` - Course Detail (Coming Soon)
- `/student/learning` - Learning Paths
- `/student/quiz` - Practice & Quiz (Coming Soon)
- `/student/analytics` - Analytics & Insights
- `/student/ai-chat` - AI Chatbot
- `/student/placements` - Placement Recommendations
- `/student/profile` - User Profile

## 🎯 Key Components

### Reusable UI Components
- **ProgressRing**: Circular progress indicator with animations
- **ProgressBar**: Linear progress bar with customizable colors
- **Badge**: Status and category badges with variants
- **VideoPlayer**: YouTube video player with tracking UI
- **Button**: Customizable button component

### Feature Components
- **LanguageCard**: Programming language selection card
- **CourseCard**: Course overview card with progress
- **ConceptCard**: Expandable video concept card with focus tracking

## 📊 Mock Data

The application currently uses mock data for demonstration:
- Python concepts (Beginner, Intermediate, Advanced)
- 8 Course categories with progress
- Placement role recommendations
- Analytics and learning statistics

## 🔮 Future Enhancements

### Backend Integration
- [x] **Supabase authentication** ✅ Complete
- [x] **Complete database schema** ✅ Complete
- [x] **Google OAuth integration** ✅ Complete
- [x] **Security event logging** ✅ Complete
- [ ] Real-time progress tracking
- [ ] Video watch time analytics
- [ ] Quiz and task submissions
- [ ] Certificate generation

### AI Features
- [ ] Intelligent chatbot with NLP
- [ ] Personalized learning recommendations
- [ ] Adaptive difficulty adjustment
- [ ] Skill gap analysis

### Additional Features
- [ ] Code editor integration
- [ ] Live coding sessions
- [ ] Peer collaboration
- [ ] Mentor-student matching
- [ ] Interview preparation tools
- [ ] Mock interviews
- [ ] Resume builder

## 🎓 Target Audience

- **B.Tech AI & Data Science Students**
- Focus on placement preparation
- Industry-ready skill development
- Technical interview preparation

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Developer

Built with ❤️ for AI & DS students

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Backend (Optional but Recommended)

Follow the [Complete Setup Guide](./backend/COMPLETE_SETUP_GUIDE.md) to:
- Create a Supabase project
- Run the database schema
- Configure environment variables
- Set up Google OAuth (optional)

### 3. Run the Application
```bash
npm run dev
```

---

**Note**: The authentication backend is **fully implemented** and ready to use! Follow the setup guide in `backend/COMPLETE_SETUP_GUIDE.md` to configure Supabase and enable all authentication features. The app works without backend setup, but you'll need it for user registration and login.
