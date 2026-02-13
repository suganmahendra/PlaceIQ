# 🎯 Quick Start: Adding New Roadmaps

## ✨ Super Simple 3-Step Process

### Step 1: Create JSON File
Create `src/data/roadmaps/your-topic.json`:

```json
{
  "id": "your-topic",
  "title": "Your Topic Mastery",
  "level": "Intermediate",
  "modules": 10,
  "duration": "3 months",
  "color": "blue",
  "icon": "Code",
  "description": "Short description here",
  "phases": [
    {
      "title": "Phase Name",
      "duration": "2 weeks",
      "topics": [
        {
          "name": "Topic Name",
          "description": "What you'll learn",
          "completed": false,
          "resources": 15
        }
      ]
    }
  ]
}
```

### Step 2: Add to Index
Edit `src/data/roadmaps/index.ts`:

```typescript
import yourTopic from './your-topic.json';

export const roadmaps = [
  fullstack,
  dsa,
  systemDesign,
  softSkills,
  yourTopic,  // ← Add here
];

export { fullstack, dsa, systemDesign, softSkills, yourTopic };
```

### Step 3: Add Icon/Color (if new)
Edit `src/pages/public/LearningPage.tsx`:

```tsx
// If using a new icon:
import { YourIcon } from 'lucide-react';
const iconMap = {
  YourIcon: <YourIcon className="w-6 h-6" />,
};

// If using a new color:
const colorMap = {
  yourcolor: 'bg-yourcolor-500/20 text-yourcolor-600',
};
```

## 🎉 Done!
Your roadmap card will automatically appear on `/learning-preview`!

---

## 📁 File Structure

```
src/data/roadmaps/
├── index.ts              ← Combines all roadmaps
├── fullstack.json        ← One roadmap per file
├── dsa.json
├── system-design.json
├── soft-skills.json
└── your-new-topic.json   ← Just add files here!
```

## 🎨 Available Options

### Colors
`blue`, `purple`, `orange`, `pink`, `green`

### Icons (from Lucide)
`Globe`, `Code`, `Cpu`, `MessageSquare`, `Brain`, `Database`, `Shield`, `Smartphone`

[Browse more icons](https://lucide.dev/icons/)

### Difficulty Levels
`Absolute Beginner`, `Beginner`, `Intermediate`, `Advanced`, `All Levels`

---

## 📚 Full Documentation
- **Detailed Guide**: See `/src/data/roadmaps/README.md`
- **Architecture**: See `/ROADMAP_SYSTEM.md`
- **Implementation**: See `/ROADMAP_IMPLEMENTATION.md`

**That's it! Copy an existing file as a template and modify it! 🚀**
