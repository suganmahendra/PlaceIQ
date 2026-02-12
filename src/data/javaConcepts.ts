import type { ConceptModule, VideoConcept } from '../types/coding';

// Java Beginner Concepts (Weak Students) - "Java Foundations"
const javaBeginnerConcepts: VideoConcept[] = [
    {
        id: 'java-b-1',
        title: 'Java Syntax & Basics',
        description: 'Writing your first Java program',
        youtubeUrl: 'https://www.youtube.com/watch?v=ntLJmHOJ0ME', // CodeWithHarry
        channel: 'CodeWithHarry',
        duration: 45,
        level: 'Beginner',
        order: 1,
        completed: true,
        watchPercentage: 100,
        pauseCount: 3,
        skipAttempts: 0,
        speedChanges: 0,
        lastWatched: new Date('2026-01-25'),
    },
    {
        id: 'java-b-2',
        title: 'Variables & Data Types',
        description: 'Primitives and non-primitives explained',
        youtubeUrl: 'https://www.youtube.com/watch?v=UmnCZ7-9yDY', // Telusko
        channel: 'Telusko',
        duration: 40,
        level: 'Beginner',
        order: 2,
        completed: true,
        watchPercentage: 100,
        pauseCount: 5,
        skipAttempts: 1,
        speedChanges: 0,
        lastWatched: new Date('2026-01-27'),
    },
    {
        id: 'java-b-3',
        title: 'Loops and Control Flow',
        description: 'For loops, While loops, and If-Else',
        youtubeUrl: 'https://www.youtube.com/watch?v=hGk_hK_9r90', // CodeWithHarry
        channel: 'CodeWithHarry',
        duration: 50,
        level: 'Beginner',
        order: 3,
        completed: false,
        watchPercentage: 30,
        pauseCount: 4,
        skipAttempts: 2,
        speedChanges: 0,
    },
    {
        id: 'java-b-4',
        title: 'Introduction to OOP',
        description: 'Basics of Object Oriented Programming',
        youtubeUrl: 'https://www.youtube.com/watch?v=a199U1nLL3k', // Telusko
        channel: 'Telusko',
        duration: 60,
        level: 'Beginner',
        order: 4,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    }
];

// Java Intermediate Concepts (Average Students) - "Core Java Development"
const javaIntermediateConcepts: VideoConcept[] = [
    {
        id: 'java-i-1',
        title: 'OOP Deep Dive',
        description: 'Inheritance, Polymorphism, Abstraction, Encapsulation',
        youtubeUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34', // Mosh
        channel: 'Programming with Mosh',
        duration: 90,
        level: 'Intermediate',
        order: 1,
        completed: false,
        watchPercentage: 15,
        pauseCount: 2,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'java-i-2',
        title: 'Collections Framework',
        description: 'List, Set, Map, and queues',
        youtubeUrl: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4', // Edureka
        channel: 'edureka!',
        duration: 75,
        level: 'Intermediate',
        order: 2,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'java-i-3',
        title: 'Exception Handling',
        description: 'Try-catch blocks and throwing exceptions',
        youtubeUrl: 'https://www.youtube.com/watch?v=1XAfhehNBOU', // Telusko
        channel: 'Telusko',
        duration: 45,
        level: 'Intermediate',
        order: 3,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'java-i-4',
        title: 'Basic Backend Concepts',
        description: 'Connecting to databases and servers',
        youtubeUrl: 'https://www.youtube.com/watch?v=GqyUA59D8z0', // Amigoscode
        channel: 'Amigoscode',
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

// Java Advanced Concepts (Bright Students) - "Advanced Java for Placements"
const javaAdvancedConcepts: VideoConcept[] = [
    {
        id: 'java-a-1',
        title: 'Multithreading Mastery',
        description: 'Threads, Runnable, and Synchronization',
        youtubeUrl: 'https://www.youtube.com/watch?v=cKQZ4W7s4g8', // Telusko
        channel: 'Telusko',
        duration: 65,
        level: 'Advanced',
        order: 1,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'java-a-2',
        title: 'Advanced Collections',
        description: 'ConcurrentHashMap and advanced data structures',
        youtubeUrl: 'https://www.youtube.com/watch?v=q6-4j02-NII', // Amigoscode
        channel: 'Amigoscode',
        duration: 70,
        level: 'Advanced',
        order: 2,
        completed: false,
        watchPercentage: 0,
        pauseCount: 0,
        skipAttempts: 0,
        speedChanges: 0,
    },
    {
        id: 'java-a-3',
        title: 'Industry Clean Coding',
        description: 'SOLID principles and design patterns',
        youtubeUrl: 'https://www.youtube.com/watch?v=fh8jX461pMIV', // Amigoscode
        channel: 'Amigoscode',
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

export const javaModules: ConceptModule[] = [
    {
        id: 'java-beginner',
        title: 'Java Foundations', // Green
        level: 'Beginner',
        concepts: javaBeginnerConcepts,
        progress: 40,
    },
    {
        id: 'java-intermediate',
        title: 'Core Java Development', // Yellow
        level: 'Intermediate',
        concepts: javaIntermediateConcepts,
        progress: 10,
    },
    {
        id: 'java-advanced',
        title: 'Advanced Java for Placements', // Blue
        level: 'Advanced',
        concepts: javaAdvancedConcepts,
        progress: 0,
    },
];

