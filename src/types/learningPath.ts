// Learning Path System Type Definitions

export type DepartmentType = 'IT' | 'MECH' | 'CIVIL' | 'ECE' | 'EEE';

export type StudentLevel = 'bright' | 'average' | 'weak';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Department {
    id: DepartmentType;
    name: string;
    fullName: string;
    description: string;
    icon: string;
    color: string;
    courses: Course[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    icon: string;
    totalVideos: number;
    estimatedHours: number;
    levels: {
        bright: VideoContent[];
        average: VideoContent[];
        weak: VideoContent[];
    };
}

export interface VideoContent {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnail: string;
    duration: string; // e.g., "15:30"
    channel: string;
    difficulty: DifficultyLevel;
    tags: string[];
    conceptCheck?: ConceptCheck;
    order: number;
}

export interface ConceptCheck {
    id: string;
    videoId: string;
    questions: Question[];
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface EngagementMetrics {
    videoId: string;
    focusScore: number; // 0-100
    attentionLevel: 'high' | 'medium' | 'low';
    pauseCount: number;
    skipCount: number;
    rewatchCount: number;
    completionPercentage: number;
    lastWatched: Date;
    distractionDetected: boolean;
}

export interface LearningProgress {
    studentId: string;
    departmentId: DepartmentType;
    courseId: string;
    currentLevel: StudentLevel;
    suggestedLevel: StudentLevel;
    completedVideos: string[];
    currentVideoId: string | null;
    overallProgress: number; // 0-100
    courseProgress: {
        [courseId: string]: number;
    };
    engagementMetrics: {
        [videoId: string]: EngagementMetrics;
    };
    conceptCheckScores: {
        [checkId: string]: number;
    };
    weakAreas: string[];
    strongAreas: string[];
    lastActive: Date;
}

export interface AdaptiveRecommendation {
    type: 'revise' | 'proceed' | 'switch_difficulty' | 'rewatch';
    message: string;
    targetVideoId?: string;
    targetLevel?: StudentLevel;
    reason: string;
    priority: 'high' | 'medium' | 'low';
}

export interface DashboardStats {
    departmentProgress: {
        [departmentId: string]: number;
    };
    totalVideosWatched: number;
    totalHoursLearned: number;
    averageFocusScore: number;
    currentStreak: number;
    topicStrengths: {
        topic: string;
        score: number;
    }[];
    focusTrend: {
        date: string;
        score: number;
    }[];
}
