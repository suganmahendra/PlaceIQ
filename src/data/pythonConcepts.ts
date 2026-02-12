import type { ConceptModule, VideoConcept } from '../types/coding';

// Python Beginner Concepts (Weak Students) - "Python Foundations"
const pythonBeginnerConcepts: VideoConcept[] = [
    {
        id: 'py-b-1',
        title: 'Python Basics & Variables',
        description: 'Variables, data types, and simple programs',
        youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', // Mosh
        channel: 'Programming with Mosh',
        duration: 45,
        level: 'Beginner',
        order: 1,
        completed: true,
        watchPercentage: 100,
        pauseCount: 2,
        skipAttempts: 0,
        speedChanges: 0,
        lastWatched: new Date('2026-02-01'),
    },
    {
        id: 'py-b-2',
        title: 'Conditional Statements',
        description: 'If/Else logic and decision making',
        youtubeUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', // freeCodeCamp
        channel: 'freeCodeCamp.org',
        duration: 30,
        level: 'Beginner',
        order: 2,
        completed: false,
        watchPercentage: 45,
        pauseCount: 5,
        skipAttempts: 2,
        speedChanges: 0,
        lastWatched: new Date('2026-02-04'),
    },
    {
        id: 'py-b-3',
        title: 'Loops and Function Logic',
        description: 'While loops, For loops, and basic functions',
        youtubeUrl: 'https://www.youtube.com/watch?v=sxTmJE4k0ho', // Tech With Tim
        channel: 'Tech With Tim',
        duration: 40,
        level: 'Beginner',
        order: 3,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'py-b-4',
        title: 'Writing Simple Programs',
        description: 'Building a calculator and guessing game',
        youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', // Mosh
        channel: 'Programming with Mosh',
        duration: 50,
        level: 'Beginner',
        order: 4,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    }
];

// Python Intermediate Concepts (Average Students) - "Python Core Development"
const pythonIntermediateConcepts: VideoConcept[] = [
    {
        id: 'py-i-1',
        title: 'Object Oriented Programming',
        description: 'Classes, Objects, Inheritance, and Polymorphism',
        youtubeUrl: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM', // Corey Schafer
        channel: 'Corey Schafer',
        duration: 60,
        level: 'Intermediate',
        order: 1,
        completed: false,
        watchPercentage: 10,
        pauseCount: 1,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'py-i-2',
        title: 'File Handling & Modules',
        description: 'Working with files, imports, and packages',
        youtubeUrl: 'https://www.youtube.com/watch?v=W555K_05WfI', // Tech With Tim
        channel: 'Tech With Tim',
        duration: 45,
        level: 'Intermediate',
        order: 2,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'py-i-3',
        title: 'Exception Handling',
        description: 'Try, Except, and error management',
        youtubeUrl: 'https://www.youtube.com/watch?v=NIWwJbo-9_8', // Corey Schafer
        channel: 'Corey Schafer',
        duration: 35,
        level: 'Intermediate',
        order: 3,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'py-i-4',
        title: 'APIs & Scripting',
        description: 'Fetching data and automating tasks',
        youtubeUrl: 'https://www.youtube.com/watch?v=hPC6TKCi_pI', // Tech With Tim
        channel: 'Tech With Tim',
        duration: 55,
        level: 'Intermediate',
        order: 4,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    }
];

// Python Advanced Concepts (Bright Students) - "Python for AI & Data Science"
const pythonAdvancedConcepts: VideoConcept[] = [
    {
        id: 'py-a-1',
        title: 'NumPy & Data Arrays',
        description: 'High-performance computing with NumPy',
        youtubeUrl: 'https://www.youtube.com/watch?v=8JfDAm9y_7s', // Sentdex
        channel: 'Sentdex',
        duration: 50,
        level: 'Advanced',
        order: 1,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'py-a-2',
        title: 'Pandas for Data Analysis',
        description: 'Data manipulation and analysis real-world capabilities',
        youtubeUrl: 'https://www.youtube.com/watch?v=jQVbWkXVXoo', // Sentdex
        channel: 'Sentdex',
        duration: 65,
        level: 'Advanced',
        order: 2,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'py-a-3',
        title: 'Machine Learning Basics',
        description: 'Intro to ML algorithms and concepts',
        youtubeUrl: 'https://www.youtube.com/watch?v=OGxgnH8y2NM', // Sentdex
        channel: 'Sentdex',
        duration: 80,
        level: 'Advanced',
        order: 3,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    }
];

export const pythonModules: ConceptModule[] = [
    {
        id: 'py-beginner',
        title: 'Python Foundations', // Green
        level: 'Beginner',
        concepts: pythonBeginnerConcepts,
        progress: 35,
    },
    {
        id: 'py-intermediate',
        title: 'Python Core Development', // Yellow
        level: 'Intermediate',
        concepts: pythonIntermediateConcepts,
        progress: 10,
    },
    {
        id: 'py-advanced',
        title: 'Python for AI & Data Science', // Blue
        level: 'Advanced',
        concepts: pythonAdvancedConcepts,
        progress: 0,
    },
];

