export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    youtubePlaylistUrl?: string;
    videos: CourseVideo[];
    progress: number; // 0-100
    order: number;
}

export interface CourseVideo {
    id: string;
    title: string;
    youtubeUrl: string;
    duration: number; // in minutes
    watched: boolean;
    watchPercentage: number;
    focusScore: number; // 0-100
    notes?: string;
}

export interface Course {
    id: string;
    name: string;
    slug: string;
    description: string;
    difficulty: CourseDifficulty;
    estimatedHours: number;
    progress: number; // 0-100
    modules: CourseModule[];
    certificateEarned: boolean;
    enrolledDate?: Date;
    completedDate?: Date;
    icon: string; // Icon name from lucide-react
}

export interface CourseQuiz {
    id: string;
    moduleId: string;
    questions: QuizQuestion[];
    passingScore: number;
    userScore?: number;
    completed: boolean;
    attempts: number;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    points: number;
}

export interface MiniProject {
    id: string;
    courseId: string;
    title: string;
    description: string;
    requirements: string[];
    datasetUrl?: string;
    completed: boolean;
    submissionUrl?: string;
    feedback?: string;
}
