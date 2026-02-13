# 📚 Roadmaps Folder - Modular Roadmap System

## 🎯 Overview
This folder contains **individual JSON files** for each learning track roadmap. Each file represents one complete roadmap with all its phases, topics, and metadata.

## 📁 Structure

```
src/data/roadmaps/
├── index.ts              # Auto-imports all roadmaps
├── fullstack.json        # Full-Stack Mastery roadmap
├── dsa.json              # DSA & Algorithms roadmap
├── system-design.json    # System Design roadmap
├── soft-skills.json      # Soft Skills & HR roadmap
└── README.md            # This file
```

## ✨ How It Works

### Automatic Import System
The `index.ts` file automatically imports all roadmap JSON files and combines them into a single array. Components import from the index file:

```tsx
import roadmapsData from '../../data/roadmaps';
// roadmapsData is an array of all roadmaps
```

## 🚀 Adding a New Roadmap (3 Steps!)

### Step 1: Create a New JSON File
Create a new file in this folder, e.g., `machine-learning.json`:

```json
{
  "id": "machine-learning",
  "title": "Machine Learning Mastery",
  "level": "Advanced",
  "modules": 15,
  "duration": "6 months",
  "color": "green",
  "icon": "Brain",
  "description": "Master ML from basics to deep learning",
  "phases": [
    {
      "title": "Foundations",
      "duration": "4 weeks",
      "topics": [
        {
          "name": "Python for ML",
          "description": "NumPy, Pandas, Matplotlib",
          "completed": false,
          "resources": 20
        }
      ]
    }
  ]
}
```

### Step 2: Add to index.ts
```typescript
import machineLearning from './machine-learning.json';

export const roadmaps = [
  fullstack,
  dsa,
  systemDesign,
  softSkills,
  machineLearning,  // Add here
];

export { fullstack, dsa, systemDesign, softSkills, machineLearning };
```

### Step 3: Add Icon & Color Mapping (if new)
In `/src/pages/public/LearningPage.tsx`:

```tsx
import { Brain } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,  // Add this
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-600',
  purple: 'bg-purple-500/20 text-purple-600',
  orange: 'bg-orange-500/20 text-orange-600',
  pink: 'bg-pink-500/20 text-pink-600',
  green: 'bg-green-500/20 text-green-600',  // Add this
};
```

### Done! 🎉
The new roadmap card will automatically appear on the Learning Tracks page!

## 📊 Roadmap Schema

Each roadmap JSON file must follow this structure:

```typescript
{
  id: string;              // Unique URL-friendly identifier (kebab-case)
  title: string;           // Display name
  level: string;           // "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  modules: number;         // Total number of modules
  duration: string;        // e.g., "4 months", "12 weeks"
  color: string;           // Color theme: "blue" | "purple" | "orange" | "pink" | "green"
  icon: string;            // Icon name from Lucide: "Globe" | "Code" | "Cpu" | etc.
  description: string;     // Short 1-2 sentence description
  phases: Phase[];         // Array of learning phases
}
```

### Phase Structure
```typescript
{
  title: string;           // Phase name
  duration: string;        // e.g., "4 weeks"
  topics: Topic[];         // Array of topics in this phase
}
```

### Topic Structure
```typescript
{
  name: string;            // Topic title
  description: string;     // What you'll learn (1 sentence)
  completed: boolean;      // Progress tracking (false by default)
  resources: number;       // Number of learning resources available
}
```

## 🎨 Available Colors

| Color | Usage | Visual |
|-------|-------|--------|
| `blue` | Beginner-friendly tracks | 🔵 Blue gradient |
| `purple` | Intermediate challenges | 🟣 Purple gradient |
| `orange` | Advanced topics | 🟠 Orange gradient |
| `pink` | Soft skills | 🌸 Pink gradient |
| `green` | New/growing fields | 🟢 Green gradient |

## 🔧 Available Icons (from Lucide)

Pre-configured icons:
- `Globe` - Full-stack, web development
- `Code` - Programming, DSA
- `Cpu` - System design, architecture
- `MessageSquare` - Communication, soft skills
- `Brain` - AI/ML, intelligence
- `Database` - Data engineering
- `Shield` - Security, DevOps
- `Smartphone` - Mobile development

[Browse all Lucide icons](https://lucide.dev/icons/)

## ✅ Best Practices

### DO:
✅ Use kebab-case for file names and IDs (`machine-learning.json`)  
✅ Keep roadmaps focused (3-5 phases max)  
✅ Write clear, actionable topic names  
✅ Include realistic time estimates  
✅ Group related topics in phases  
✅ Test your JSON for valid syntax  

### DON'T:
❌ Use spaces or special characters in file names  
❌ Create phases with only 1 topic (combine them)  
❌ Exceed 20 topics per roadmap  
❌ Duplicate content across roadmaps  
❌ Use technical jargon in descriptions  

## 🎯 File Naming Convention

Follow this pattern:
```
<topic-name>.json
```

Examples:
- ✅ `machine-learning.json`
- ✅ `mobile-development.json`
- ✅ `cloud-computing.json`
- ❌ `Machine Learning.json` (has spaces)
- ❌ `ml_roadmap.json` (use kebab-case, not snake_case)

## 🔥 Current Roadmaps

| File | Roadmap | Modules | Duration |
|------|---------|---------|----------|
| `fullstack.json` | Full-Stack Mastery | 12 | 4 months |
| `dsa.json` | DSA & Algorithms | 18 | 5 months |
| `system-design.json` | System Design | 8 | 3 months |
| `soft-skills.json` | Soft Skills & HR | 6 | 2 months |

## 💡 Why Individual Files?

### ✅ Advantages:
1. **Modularity**: Each roadmap is independent
2. **Easy to Add**: Create file → Add to index → Done!
3. **Better Git Diffs**: Changes to one roadmap don't affect others
4. **Team Collaboration**: Multiple people can work on different roadmaps
5. **Clear Organization**: One file = one roadmap
6. **Easy to Remove**: Just delete the file and remove from index

### vs Single JSON File:
- ❌ Hard to merge conflicts
- ❌ One change affects entire file
- ❌ Harder to review changes
- ❌ More prone to syntax errors

## 🚨 Troubleshooting

### Roadmap not appearing?
1. ✅ Check JSON syntax is valid (use a JSON validator)
2. ✅ Ensure file is imported in `index.ts`
3. ✅ Verify `id` is unique
4. ✅ Check color exists in `colorMap`
5. ✅ Check icon exists in `iconMap`

### Syntax Error?
- Run: `npx jsonlint yourfile.json`
- Or use VS Code JSON validator (auto-enabled)

### Icon not showing?
- Import it from `lucide-react`
- Add to `iconMap` in LearningPage.tsx

## 📝 Validation Checklist

Before committing a new roadmap, verify:
- [ ] Valid JSON syntax
- [ ] Unique `id` (no duplicates)
- [ ] Color exists in colorMap
- [ ] Icon imported and added to iconMap
- [ ] File added to `index.ts`
- [ ] File exported in `index.ts`
- [ ] All phases have topics
- [ ] All topics have required fields
- [ ] Descriptions are clear and concise
- [ ] Time estimates are realistic

## 🎓 Example: Complete Workflow

```bash
# 1. Create new file
touch src/data/roadmaps/mobile-dev.json

# 2. Add content (use existing files as template)
# (Edit mobile-dev.json)

# 3. Import in index.ts
# Add: import mobileDev from './mobile-dev.json';
# Add to array: mobileDev
# Add to exports: mobileDev

# 4. Add icon/color if needed
# (Edit LearningPage.tsx)

# 5. Test
npm run dev
# Visit: http://localhost:5173/learning-preview

# 6. Commit
git add src/data/roadmaps/mobile-dev.json
git add src/data/roadmaps/index.ts
git commit -m "Add mobile development roadmap"
```

---

**🎉 That's it! Add unlimited roadmaps by just creating JSON files!**

**Questions? Check the main documentation in `/ROADMAP_SYSTEM.md`**
