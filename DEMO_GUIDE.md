# 🧭 PlaceIQ - Quick Navigation Guide

## 🌐 **APPLICATION URL**
**Development Server**: http://localhost:5173

---

## 📍 **ALL ROUTES**

### **Public Routes** (No Authentication Required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Hero section, features, CTA buttons |
| `/about` | About Page | Platform information and mission |
| `/learning-preview` | Learning Preview | Public preview of learning paths |
| `/contact` | Contact Page | Contact form and information |
| `/register` | Registration Selection | Choose Student or Mentor |
| `/register-student` | Student Registration | Student signup form |
| `/register-mentor` | Mentor Registration | Mentor signup form |
| `/login` | Student Login | Login interface |

---

### **Student Dashboard Routes** (After Login)

| Route | Page | Key Features |
|-------|------|--------------|
| `/student/dashboard` | Dashboard Home | Welcome banner, stats, recommendations, placement preview |
| `/student/coding` | Coding Home | Python & Java language cards with progress |
| `/student/coding/python` | Python Learning | Beginner/Intermediate/Advanced modules with videos |
| `/student/coding/java` | Java Learning | Java concepts with product company badge |
| `/student/courses` | Courses Home | All 8 courses with progress and certificates |
| `/student/courses/dsa` | DSA Course | Data Structures & Algorithms detailed view |
| `/student/courses/mathematics-ai` | Math for AI | Linear Algebra, Calculus, Probability |
| `/student/courses/data-analysis` | Data Analysis | Pandas, NumPy, EDA |
| `/student/courses/machine-learning` | Machine Learning | Supervised/Unsupervised learning |
| `/student/courses/deep-learning` | Deep Learning | Neural networks, CNNs, RNNs |
| `/student/courses/sql-databases` | SQL & Databases | Database design and queries |
| `/student/courses/tools-git` | Tools & Git | Version control and dev tools |
| `/student/courses/aptitude-reasoning` | Aptitude | Quantitative aptitude and reasoning |
| `/student/learning` | Learning Paths | Department-wise learning paths |
| `/student/analytics` | Analytics | Weekly reports, focus score, skill readiness |
| `/student/placements` | Placements | Role matching, eligibility, skills checklist |
| `/student/ai-chat` | AI Chatbot | Learning assistant chat interface |
| `/student/profile` | Profile | User info, stats, skills, settings |

---

## 🎯 **QUICK DEMO PATH**

### **5-Minute Demo** (Core Features)
1. `/` → Landing Page
2. `/student/dashboard` → Dashboard Overview
3. `/student/coding/python` → Python Learning (expand a module, click a video)
4. `/student/courses` → Courses Overview
5. `/student/courses/dsa` → Course Detail (show video modal)
6. `/student/placements` → Placement Matching

### **10-Minute Demo** (Comprehensive)
1. `/` → Landing Page
2. `/register` → Registration Selection
3. `/student/dashboard` → Dashboard Home
4. `/student/coding` → Coding Home
5. `/student/coding/python` → Python Page (show video player)
6. `/student/courses` → Courses Home
7. `/student/courses/machine-learning` → ML Course Detail
8. `/student/analytics` → Analytics & Insights
9. `/student/placements` → Placement Recommendations
10. `/student/ai-chat` → AI Chatbot
11. `/student/profile` → User Profile

### **15-Minute Demo** (Full Walkthrough)
*All routes above + additional interactions*

---

## 🔑 **KEY INTERACTIONS TO DEMONSTRATE**

### **Dashboard Home** (`/student/dashboard`)
- ✅ Hover over stat cards
- ✅ Click recommended content cards
- ✅ View placement matches
- ✅ Check skill analysis ring

### **Python Coding** (`/student/coding/python`)
- ✅ Click module header to expand/collapse
- ✅ Click a concept to open video player
- ✅ Show focus tracking indicators
- ✅ Highlight quiz and task buttons
- ✅ Show completion checkmarks

### **Course Detail** (`/student/courses/dsa`)
- ✅ View progress ring in header
- ✅ Check stats bar (videos completed, progress, modules)
- ✅ Expand a module to see videos
- ✅ Click a video to open modal
- ✅ Show "Mark as Complete" and "Take Notes" buttons
- ✅ Highlight AI Insights sidebar

### **Analytics** (`/student/analytics`)
- ✅ Point out weekly activity chart
- ✅ Show focus vs distraction percentages
- ✅ Highlight skill readiness scores
- ✅ Read insights (strengths & improvements)

### **Placements** (`/student/placements`)
- ✅ Show match percentage rings
- ✅ Expand skills checklist (✓ acquired, ✗ missing)
- ✅ Point out eligibility badges
- ✅ Highlight "Apply Now" vs info messages

### **AI Chatbot** (`/student/ai-chat`)
- ✅ Type a message
- ✅ Press Enter to send
- ✅ Show typing indicator
- ✅ Receive demo response

---

## 🎨 **DESIGN HIGHLIGHTS TO MENTION**

1. **Lavender/Purple Gradient Theme** - Modern EdTech aesthetic
2. **Smooth Animations** - Hover effects, transitions, progress bars
3. **Progress Visualizations** - Rings, bars, charts
4. **Responsive Design** - Works on desktop, tablet, mobile
5. **Consistent UI** - Reusable components throughout
6. **Gamification** - XP, streaks, badges, levels
7. **AI-Powered Features** - Chatbot, insights, recommendations

---

## 📊 **DATA TO HIGHLIGHT**

### **Mock User: Sugan Mahendra**
- **Department**: B.Tech AI & DS
- **Year**: 3rd Year
- **Current Streak**: 12 Days
- **XP Earned**: 2,450 XP
- **Skill Level**: Intermediate
- **Modules Completed**: 14/20
- **Certificates Earned**: 2 (SQL & Databases, Tools & Git)

### **Progress Stats**
- **Python**: 65% (Bright)
- **Java**: 30% (Average)
- **DSA**: 45%
- **Machine Learning**: 25%
- **Data Analysis**: 70%
- **SQL**: 85% (Certificate ✓)

### **Placement Matches**
- **AI Engineer**: 75% (Almost Ready)
- **Data Analyst**: 90% (Eligible)
- **ML Intern**: 65% (Almost Ready)
- **Software Engineer**: 55% (Not Ready)

---

## 🛠️ **TECHNICAL DETAILS TO EXPLAIN**

### **Tech Stack**
- **React 19** - Latest version with modern hooks
- **TypeScript** - Full type safety
- **Vite** - Fast development and build
- **Tailwind CSS v4** - Utility-first styling
- **React Router v7** - Client-side routing
- **Lucide React** - Icon library

### **Architecture**
- **Component-Driven** - 25+ reusable components
- **Type-Safe** - TypeScript throughout
- **Modular** - Clean separation of concerns
- **Scalable** - Easy to extend with backend

### **File Structure**
```
src/
├── components/    # Reusable UI components
├── pages/         # Route pages
├── layouts/       # Layout wrappers
├── data/          # Mock data
├── types/         # TypeScript types
└── lib/           # Utilities
```

---

## 💡 **VIVA QUESTIONS & ANSWERS**

### **Q: Why React?**
**A:** Component reusability, large ecosystem, virtual DOM for performance, strong community support.

### **Q: Why TypeScript?**
**A:** Type safety prevents bugs, better IDE support, improved developer experience, easier refactoring.

### **Q: Why Tailwind CSS?**
**A:** Rapid development, consistent design, smaller bundle size, utility-first approach, easy customization.

### **Q: How would you integrate a backend?**
**A:** Supabase for database and auth, YouTube API for video tracking, Brevo for email notifications. Replace mock data with API calls.

### **Q: How do you handle state management?**
**A:** React hooks (useState, useEffect) for local state, Context API for global state, no need for Redux due to app size.

### **Q: Is it responsive?**
**A:** Yes, Tailwind's responsive utilities ensure it works on desktop (1920px+), laptop (1366px), tablet (768px), and mobile (375px).

### **Q: How do you ensure code quality?**
**A:** TypeScript for type checking, ESLint for linting, component-driven architecture, clean code principles.

### **Q: What's unique about PlaceIQ?**
**A:** AI & DS specific content, placement-focused features, video-based learning with focus tracking, gamification, AI insights.

---

## 🚀 **COMMANDS**

### **Start Development Server**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

### **Type Check**
```bash
npx tsc --noEmit
```

---

## ✅ **PRE-DEMO CHECKLIST**

- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to http://localhost:5173
- [ ] No console errors (F12 → Console)
- [ ] Zoom level at 100%
- [ ] Close unnecessary tabs
- [ ] Clear browser cache (optional)
- [ ] Review demo flow
- [ ] Practice key interactions
- [ ] Prepare talking points

---

## 🎬 **DEMO TIPS**

1. **Start with Landing Page** - Sets the context
2. **Show Dashboard First** - Overview of features
3. **Demonstrate Interactivity** - Click, expand, hover
4. **Highlight Unique Features** - Focus tracking, AI insights, placement matching
5. **Show Responsiveness** - Resize browser window
6. **Explain Design Choices** - Colors, layout, animations
7. **Mention Future Plans** - Backend integration, real AI, certificates
8. **Be Confident** - You built a production-grade app!

---

## 📞 **SUPPORT**

If you encounter any issues:
1. Check console for errors (F12)
2. Restart dev server (`Ctrl+C` then `npm run dev`)
3. Clear browser cache
4. Check that all dependencies are installed (`npm install`)

---

**Last Updated**: February 5, 2026
**Status**: ✅ READY FOR DEMO
**Demo URL**: http://localhost:5173

🎉 **Good luck with your demo!**
