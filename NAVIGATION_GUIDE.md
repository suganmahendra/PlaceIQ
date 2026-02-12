# 🗺️ PlaceIQ Navigation Guide

## Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open in browser**: `http://localhost:5173`

## 📍 Page Navigation Map

### 🌐 Public Pages (Not Logged In)

#### Landing Page (`/`)
- Hero section with PlaceIQ branding
- Features overview
- Call-to-action buttons
- **Actions**: 
  - Click "Login" → Student Login
  - Click "Register" → Registration Selection

#### Registration Selection (`/register`)
- Choose between Student or Mentor registration
- **Actions**:
  - Click "Student" → Student Registration
  - Click "Mentor" → Mentor Registration

#### Student Registration (`/register-student`)
- Registration form for students
- **Action**: Fill form → Redirects to Login

#### Student Login (`/login`)
- Login form
- **Action**: Login → Student Dashboard

#### Other Public Pages
- `/about` - About PlaceIQ
- `/learning-preview` - Learning features preview
- `/contact` - Contact information

---

### 🎓 Student Dashboard (Logged In)

#### Dashboard Home (`/student/dashboard`)
**What you'll see**:
- Welcome banner with personalized greeting
- 4 stat cards (Streak, XP, Skill Level, Modules)
- Recommended content cards
- Placement matches preview
- Skill analysis widget
- Daily challenge

**Quick Actions**:
- Click "Resume Learning" → Last accessed content
- Click course cards → Course details
- Click "View All Matches" → Placements page

---

#### Coding Section

##### Coding Home (`/student/coding`)
**What you'll see**:
- Overall coding progress stats
- Python language card
- Java language card
- Streak and performance indicators

**Navigation**:
- Click Python card → `/student/coding/python`
- Click Java card → `/student/coding/java`

##### Python Page (`/student/coding/python`)
**What you'll see**:
- Python progress header
- Performance stats (Bright/Average/Weak)
- 3 expandable modules:
  - Beginner (5 concepts)
  - Intermediate (3 concepts)
  - Advanced (2 concepts)

**Interactions**:
- Click module header → Expand/collapse
- Click concept → Expand video player
- Click "Take Quiz" → Quiz modal (UI only)
- Click "Practice Task" → Task page (UI only)

**Focus Tracking**:
- Pause count displayed
- Skip attempts shown
- Speed changes tracked

##### Java Page (`/student/coding/java`)
**What you'll see**:
- Java progress header with "Recommended for Product Companies" badge
- Performance stats
- Why Java info banner
- 3 expandable modules (same structure as Python)

---

#### Courses Section

##### Courses Home (`/student/courses`)
**What you'll see**:
- 4 stat cards (Total, Completed, In Progress, Avg Progress)
- 8 course cards divided into:
  - **Core AI & DS**: DSA, Math for AI, Data Analysis, ML, Deep Learning
  - **Essential Skills**: SQL, Git, Aptitude

**Course Card Info**:
- Progress ring
- Difficulty badge
- Estimated hours
- Certificate indicator (if earned)

**Navigation**:
- Click any course card → `/student/courses/:slug` (Coming Soon)

---

#### Analytics Page (`/student/analytics`)
**What you'll see**:
- 4 key metrics (Weekly hours, Focus score, Distraction, Avg/day)
- Weekly activity chart (Coding vs Courses)
- Skill readiness scores with progress bars
- Strengths & Areas to Improve insights

**Visual Elements**:
- Stacked bar chart for weekly activity
- Color-coded skill levels (Green/Amber/Red)
- Insight cards with recommendations

---

#### Placements Page (`/student/placements`)
**What you'll see**:
- 3 stat cards (Eligible roles, Avg match, Total roles)
- 4 role cards:
  1. **AI Engineer** (75% match, Almost Ready)
  2. **Data Analyst** (90% match, Eligible)
  3. **ML Intern** (65% match, Almost Ready)
  4. **Software Engineer** (55% match, Not Ready)

**Role Card Details**:
- Match percentage ring
- Required skills checklist (✓ acquired, ✗ missing)
- Eligibility status badge
- Salary range
- Apply button (if eligible)

---

#### AI Chatbot (`/student/ai-chat`)
**What you'll see**:
- Chat interface with gradient header
- Message history (user & assistant)
- Input box with send button

**Interactions**:
- Type message → Click Send or press Enter
- Messages appear with timestamps
- Typing indicator shows when "AI" is responding

**Note**: Currently UI-only, returns demo response

---

#### Profile Page (`/student/profile`)
**What you'll see**:
- Profile header with cover image
- User avatar and info
- Contact details
- 4 stat cards (Progress, Certificates, Streak, Courses)
- Top skills with progress bars
- Notification preferences
- Security settings

**Actions**:
- Click "Edit Profile" → Edit mode (UI only)
- Toggle notification checkboxes
- Click security options (UI only)

---

#### Learning Paths (`/student/learning`)
**What you'll see**:
- Department-wise learning paths
- Video-based curriculum
- Progress tracking

---

## 🎯 Key Features to Demonstrate

### 1. **Coding Section Highlights**
- Navigate to `/student/coding/python`
- Expand "Python Fundamentals" module
- Click on a concept to show video player
- Point out focus tracking metrics (pauses, skips, speed)
- Show quiz and task buttons

### 2. **Courses Overview**
- Navigate to `/student/courses`
- Show variety of courses
- Point out progress rings and difficulty badges
- Highlight completed courses with certificates

### 3. **Placement Matching**
- Navigate to `/student/placements`
- Show AI-powered matching
- Demonstrate skill checklist
- Explain eligibility statuses

### 4. **Analytics Dashboard**
- Navigate to `/student/analytics`
- Show weekly activity chart
- Explain skill readiness scores
- Point out insights section

### 5. **AI Chatbot**
- Navigate to `/student/ai-chat`
- Send a sample message
- Show typing indicator
- Demonstrate chat interface

## 🎨 Design Elements to Highlight

### Color Scheme
- **Primary**: Lavender/Purple gradients
- **Accent**: Soft purple tones
- **Status Colors**: Green (success), Amber (warning), Red (danger)

### Animations
- Hover effects on cards
- Progress bar animations
- Smooth transitions
- Typing indicators
- Loading states

### Components
- **Progress Rings**: Circular progress indicators
- **Progress Bars**: Linear progress with percentages
- **Badges**: Status and difficulty indicators
- **Cards**: Hover effects with shadows
- **Gradients**: Header backgrounds

## 🚀 Demo Flow Suggestion

1. **Start at Landing** (`/`)
2. **Login** (`/login`)
3. **Dashboard Overview** (`/student/dashboard`)
4. **Coding Section** (`/student/coding` → `/student/coding/python`)
5. **Courses** (`/student/courses`)
6. **Analytics** (`/student/analytics`)
7. **Placements** (`/student/placements`)
8. **AI Chat** (`/student/ai-chat`)
9. **Profile** (`/student/profile`)

## 💡 Tips for Viva/Demo

### When Asked About Features:
- **Authentication**: "We have student and mentor registration with email verification UI"
- **Learning Tracking**: "We track video watch time, pauses, skips, and speed changes"
- **AI Features**: "AI-powered placement matching and chatbot assistant"
- **Analytics**: "Comprehensive learning analytics with weekly reports"

### When Asked About Technology:
- **Frontend**: "React 19 with TypeScript for type safety"
- **Styling**: "Tailwind CSS v4 for modern, responsive design"
- **Routing**: "React Router v7 for navigation"
- **Build Tool**: "Vite for fast development and optimized builds"

### When Asked About Scalability:
- **Component-Based**: "Reusable components for easy maintenance"
- **Type-Safe**: "TypeScript ensures code quality"
- **Backend-Ready**: "Designed for easy Supabase integration"
- **Modular**: "Clean separation of concerns"

## 🔍 Quick Reference

### Main Sections
- **Coding**: `/student/coding`
- **Courses**: `/student/courses`
- **Analytics**: `/student/analytics`
- **Placements**: `/student/placements`
- **AI Chat**: `/student/ai-chat`
- **Profile**: `/student/profile`

### Key Pages
- **Dashboard**: `/student/dashboard`
- **Python**: `/student/coding/python`
- **Java**: `/student/coding/java`

---

**Remember**: This is a frontend-only demo. All data is mock/static. Backend integration is planned for future releases.
