# 🚀 PlaceIQ - Quick Start Guide

## 📋 What is PlaceIQ?

**PlaceIQ** is an advanced, AI-powered placement preparation platform designed specifically for **B.Tech AI & Data Science students**. It provides structured learning paths, coding practice, industry-ready courses, and AI-driven placement recommendations.

---

## ⚡ Quick Setup (5 Minutes)

### 1. Prerequisites
Ensure you have:
- **Node.js** 18 or higher
- **npm** or **yarn**

### 2. Installation
```bash
# Navigate to project directory
cd PlaceIQ

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

### 3. Open in Browser
```
http://localhost:5173
```

That's it! 🎉

---

## 🎯 First-Time Navigation

### Start Here:
1. **Landing Page** (`/`) - See the platform overview
2. **Click "Login"** → Go to `/login`
3. **Click "Dashboard"** in navbar → Go to `/student/dashboard`

### Explore Main Sections:
- **Coding**: `/student/coding` → Choose Python or Java
- **Courses**: `/student/courses` → Browse 8 courses
- **Analytics**: `/student/analytics` → View learning stats
- **Placements**: `/student/placements` → See role matches
- **AI Chat**: `/student/ai-chat` → Chat with AI assistant
- **Profile**: `/student/profile` → View your profile

---

## 📁 Project Structure Overview

```
PlaceIQ/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # All page components
│   ├── data/           # Mock data
│   ├── types/          # TypeScript types
│   ├── layouts/        # Layout components
│   └── lib/            # Utilities
├── public/             # Static assets
└── Documentation files (README, guides, etc.)
```

---

## 🎨 Key Features at a Glance

### ✅ Implemented Features

| Feature | Route | Description |
|---------|-------|-------------|
| **Dashboard** | `/student/dashboard` | Overview with stats, recommendations |
| **Coding - Python** | `/student/coding/python` | Python learning with video concepts |
| **Coding - Java** | `/student/coding/java` | Java learning path |
| **Courses** | `/student/courses` | 8 industry-ready courses |
| **Analytics** | `/student/analytics` | Learning insights & charts |
| **Placements** | `/student/placements` | AI-powered role matching |
| **AI Chatbot** | `/student/ai-chat` | Learning assistant |
| **Profile** | `/student/profile` | User profile & settings |

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Animations**: Framer Motion

---

## 📊 What's Inside?

### Pages: **20+**
- 4 Authentication pages
- 4 Public pages
- 12+ Student dashboard pages

### Components: **15+**
- Progress rings & bars
- Video players
- Language & course cards
- Badges & buttons

### Routes: **25+**
- Public routes
- Student dashboard routes
- Dynamic routes

---

## 🎯 Quick Demo Flow (5 Minutes)

1. **Landing** (`/`) - 30 seconds
2. **Dashboard** (`/student/dashboard`) - 1 minute
3. **Python Coding** (`/student/coding/python`) - 1 minute
4. **Courses** (`/student/courses`) - 1 minute
5. **Analytics** (`/student/analytics`) - 30 seconds
6. **Placements** (`/student/placements`) - 1 minute
7. **AI Chat** (`/student/ai-chat`) - 30 seconds
8. **Profile** (`/student/profile`) - 30 seconds

**Total**: ~5 minutes for complete overview

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `IMPLEMENTATION_SUMMARY.md` | What's been built |
| `NAVIGATION_GUIDE.md` | How to navigate the app |
| `FEATURE_CHECKLIST.md` | Testing checklist |
| `QUICK_START.md` | This file! |

---

## 🎓 For Viva/Demo Preparation

### Key Talking Points:

1. **Purpose**: "PlaceIQ helps AI & DS students become placement-ready"
2. **Features**: "Coding practice, courses, analytics, AI matching"
3. **Tech**: "React + TypeScript + Tailwind for modern, type-safe development"
4. **Design**: "Premium UI with lavender theme and smooth animations"
5. **Scalability**: "Component-based architecture, ready for backend integration"

### Demo Highlights:

- **Coding Section**: Show video player with focus tracking
- **Analytics**: Display weekly activity charts
- **Placements**: Demonstrate AI-powered matching
- **AI Chat**: Show interactive chatbot
- **Design**: Highlight animations and responsive design

---

## 🔮 Future Enhancements

### Backend Integration (Planned):
- Supabase for authentication & database
- YouTube API for video tracking
- Brevo for email notifications
- Real AI chatbot with NLP

### Additional Features:
- Code editor integration
- Live coding sessions
- Mock interviews
- Resume builder
- Peer collaboration

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Issue?
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors?
```bash
# Check TypeScript errors
npm run build

# If errors, check console for details
```

---

## 📞 Need Help?

### Check These First:
1. **Console Errors**: Open browser DevTools (F12)
2. **Terminal Output**: Look for error messages
3. **Documentation**: Read README.md for details

### Common Issues:
- **Blank Page**: Check if dev server is running
- **404 Error**: Verify route in App.tsx
- **Styling Issues**: Clear browser cache

---

## ✅ Quick Checklist

Before demo/viva:
- [ ] Dev server running (`npm run dev`)
- [ ] No console errors
- [ ] All main pages load
- [ ] Navigation works
- [ ] Animations smooth
- [ ] Responsive on different screens

---

## 🎉 You're Ready!

PlaceIQ is a **production-grade, frontend-only** platform showcasing:
- ✅ Modern React development
- ✅ TypeScript type safety
- ✅ Premium UI/UX design
- ✅ Comprehensive features
- ✅ Scalable architecture

**Perfect for**: Viva, Demo, Portfolio, External Presentation

---

## 📖 Next Steps

1. **Explore**: Navigate through all sections
2. **Test**: Use the feature checklist
3. **Customize**: Add your own data/content
4. **Present**: Use navigation guide for demo
5. **Extend**: Plan backend integration

---

**Built with ❤️ for AI & DS Students**

**Version**: 1.0.0 (Frontend Only)

**Last Updated**: February 2026

---

## 🔗 Quick Links

- **Start Dev Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Preview Build**: `npm run preview`
- **Main Dashboard**: `http://localhost:5173/student/dashboard`

---

**Happy Coding! 🚀**
