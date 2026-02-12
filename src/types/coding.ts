export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LanguageType = 'Python' | 'Java';
export type PerformanceLevel = 'Weak' | 'Average' | 'Bright';

export interface VideoConcept {
    id: string;
    title: string;
    description: string;
    youtubeUrl: string;
    channel: string; // YouTube Channel Name
    duration: number; // in minutes
    level: DifficultyLevel;
    order: number;
    completed: boolean;
    watchPercentage: number;
    pauseCount: number;
    skipAttempts: number;
    speedChanges: number;
    lastWatched?: Date;
}

export interface ConceptModule {
    id: string;
    title: string;
    level: DifficultyLevel;
    concepts: VideoConcept[];
    progress: number; // 0-100
}

export interface LanguageProgress {
    language: LanguageType;
    overallProgress: number; // 0-100
    conceptsCompleted: number;
    totalConcepts: number;
    performanceLevel: PerformanceLevel;
    streakDays: number;
    lastActivity?: Date;
    modules: ConceptModule[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface ConceptQuiz {
    conceptId: string;
    questions: QuizQuestion[];
    score?: number;
    completed: boolean;
    attempts: number;
}

export interface PracticeTask {
    id: string;
    conceptId: string;
    title: string;
    description: string;
    difficulty: DifficultyLevel;
    completed: boolean;
    code?: string;
    testsPassed?: number;
    totalTests?: number;
}
