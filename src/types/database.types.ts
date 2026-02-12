export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            user_roles: {
                Row: {
                    id: string
                    user_id: string
                    role: 'student' | 'mentor' | 'admin'
                    permissions: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    role?: 'student' | 'mentor' | 'admin'
                    permissions?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    role?: 'student' | 'mentor' | 'admin'
                    permissions?: Json
                    created_at?: string
                }
                Relationships: []
            }
            departments: {
                Row: {
                    id: string
                    name: string
                    code: string
                    description: string | null
                    head_of_dept: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code: string
                    description?: string | null
                    head_of_dept?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    code?: string
                    description?: string | null
                    head_of_dept?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            students: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string
                    email: string
                    department_id: string | null
                    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
                    xp: number
                    readiness_score: number
                    profile_completion: number
                    bio: string | null
                    avatar_url: string | null
                    resume_url: string | null
                    social_links: Json
                    joined_at: string
                    last_active: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    full_name: string
                    email: string
                    department_id?: string | null
                    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
                    xp?: number
                    readiness_score?: number
                    profile_completion?: number
                    bio?: string | null
                    avatar_url?: string | null
                    resume_url?: string | null
                    social_links?: Json
                    joined_at?: string
                    last_active?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    full_name?: string
                    email?: string
                    department_id?: string | null
                    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
                    xp?: number
                    readiness_score?: number
                    profile_completion?: number
                    bio?: string | null
                    avatar_url?: string | null
                    resume_url?: string | null
                    social_links?: Json
                    joined_at?: string
                    last_active?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "students_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "students_department_id_fkey"
                        columns: ["department_id"]
                        referencedRelation: "departments"
                        referencedColumns: ["id"]
                    }
                ]
            }
            mentors: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string
                    expertise: string[] | null
                    years_of_experience: number
                    company: string | null
                    verified_status: boolean
                    rating: number
                    availability_status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    full_name: string
                    expertise?: string[] | null
                    years_of_experience?: number
                    company?: string | null
                    verified_status?: boolean
                    rating?: number
                    availability_status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    full_name?: string
                    expertise?: string[] | null
                    years_of_experience?: number
                    company?: string | null
                    verified_status?: boolean
                    rating?: number
                    availability_status?: string
                    created_at?: string
                }
                Relationships: []
            }
            courses: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string | null
                    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null
                    estimated_hours: number | null
                    thumbnail_url: string | null
                    category: string | null
                    is_published: boolean
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description?: string | null
                    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null
                    estimated_hours?: number | null
                    thumbnail_url?: string | null
                    category?: string | null
                    is_published?: boolean
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string | null
                    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null
                    estimated_hours?: number | null
                    thumbnail_url?: string | null
                    category?: string | null
                    is_published?: boolean
                    created_by?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            course_modules: {
                Row: {
                    id: string
                    course_id: string
                    title: string
                    description: string | null
                    order_index: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    course_id: string
                    title: string
                    description?: string | null
                    order_index: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    course_id?: string
                    title?: string
                    description?: string | null
                    order_index?: number
                    created_at?: string
                }
                Relationships: []
            }
            course_lessons: {
                Row: {
                    id: string
                    module_id: string
                    title: string
                    video_url: string | null
                    duration_mins: number | null
                    content_markdown: string | null
                    order_index: number
                    is_preview: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    module_id: string
                    title: string
                    video_url?: string | null
                    duration_mins?: number | null
                    content_markdown?: string | null
                    order_index: number
                    is_preview?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    module_id?: string
                    title?: string
                    video_url?: string | null
                    duration_mins?: number | null
                    content_markdown?: string | null
                    order_index?: number
                    is_preview?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            enrollments: {
                Row: {
                    id: string
                    student_id: string
                    course_id: string
                    status: 'active' | 'completed' | 'dropped'
                    progress_percent: number
                    enrolled_at: string
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    student_id: string
                    course_id: string
                    status?: 'active' | 'completed' | 'dropped'
                    progress_percent?: number
                    enrolled_at?: string
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    student_id?: string
                    course_id?: string
                    status?: 'active' | 'completed' | 'dropped'
                    progress_percent?: number
                    enrolled_at?: string
                    completed_at?: string | null
                }
                Relationships: []
            }
            lesson_progress: {
                Row: {
                    id: string
                    enrollment_id: string
                    lesson_id: string
                    is_completed: boolean
                    watch_time_seconds: number
                    last_watched_at: string
                }
                Insert: {
                    id?: string
                    enrollment_id: string
                    lesson_id: string
                    is_completed?: boolean
                    watch_time_seconds?: number
                    last_watched_at?: string
                }
                Update: {
                    id?: string
                    enrollment_id?: string
                    lesson_id?: string
                    is_completed?: boolean
                    watch_time_seconds?: number
                    last_watched_at?: string
                }
                Relationships: []
            }
            quizzes: {
                Row: {
                    id: string
                    related_module_id: string | null
                    title: string
                    passing_score: number
                    time_limit_mins: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    related_module_id?: string | null
                    title: string
                    passing_score?: number
                    time_limit_mins?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    related_module_id?: string | null
                    title?: string
                    passing_score?: number
                    time_limit_mins?: number
                    created_at?: string
                }
                Relationships: []
            }
            quiz_questions: {
                Row: {
                    id: string
                    quiz_id: string
                    question_text: string
                    options: Json
                    correct_option_index: number
                    explanation: string | null
                    points: number
                    order_index: number
                }
                Insert: {
                    id?: string
                    quiz_id: string
                    question_text: string
                    options: Json
                    correct_option_index: number
                    explanation?: string | null
                    points?: number
                    order_index: number
                }
                Update: {
                    id?: string
                    quiz_id?: string
                    question_text?: string
                    options?: Json
                    correct_option_index?: number
                    explanation?: string | null
                    points?: number
                    order_index?: number
                }
                Relationships: []
            }
            quiz_attempts: {
                Row: {
                    id: string
                    student_id: string
                    quiz_id: string
                    score: number
                    passed: boolean
                    answers: Json
                    attempted_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    quiz_id: string
                    score: number
                    passed: boolean
                    answers?: Json
                    attempted_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    quiz_id?: string
                    score?: number
                    passed?: boolean
                    answers?: Json
                    attempted_at?: string
                }
                Relationships: []
            }
            job_listings: {
                Row: {
                    id: string
                    company_name: string
                    title: string
                    description: string | null
                    location: string | null
                    type: 'Full-time' | 'Internship' | 'Contract' | null
                    salary_range: string | null
                    required_skills: string[] | null
                    min_readiness_score: number
                    deadline: string | null
                    posted_at: string
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    company_name: string
                    title: string
                    description?: string | null
                    location?: string | null
                    type?: 'Full-time' | 'Internship' | 'Contract' | null
                    salary_range?: string | null
                    required_skills?: string[] | null
                    min_readiness_score?: number
                    deadline?: string | null
                    posted_at?: string
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    company_name?: string
                    title?: string
                    description?: string | null
                    location?: string | null
                    type?: 'Full-time' | 'Internship' | 'Contract' | null
                    salary_range?: string | null
                    required_skills?: string[] | null
                    min_readiness_score?: number
                    deadline?: string | null
                    posted_at?: string
                    is_active?: boolean
                }
                Relationships: []
            }
            job_applications: {
                Row: {
                    id: string
                    job_id: string
                    student_id: string
                    status: 'applied' | 'review' | 'shortlisted' | 'rejected' | 'hired'
                    applied_at: string
                }
                Insert: {
                    id?: string
                    job_id: string
                    student_id: string
                    status?: 'applied' | 'review' | 'shortlisted' | 'rejected' | 'hired'
                    applied_at?: string
                }
                Update: {
                    id?: string
                    job_id?: string
                    student_id?: string
                    status?: 'applied' | 'review' | 'shortlisted' | 'rejected' | 'hired'
                    applied_at?: string
                }
                Relationships: []
            }
            xp_history: {
                Row: {
                    id: string
                    student_id: string
                    amount: number
                    reason: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    amount: number
                    reason: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    amount?: number
                    reason?: string
                    created_at?: string
                }
                Relationships: []
            }
            student_alliances: {
                Row: {
                    id: string
                    student_a_id: string
                    student_b_id: string
                    status: 'pending' | 'accepted' | 'blocked'
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_a_id: string
                    student_b_id: string
                    status?: 'pending' | 'accepted' | 'blocked'
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_a_id?: string
                    student_b_id?: string
                    status?: 'pending' | 'accepted' | 'blocked'
                    created_at?: string
                }
                Relationships: []
            }
            student_achievements: {
                Row: {
                    id: string
                    student_id: string
                    achievement_id: string
                    unlocked_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    achievement_id: string
                    unlocked_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    achievement_id?: string
                    unlocked_at?: string
                }
                Relationships: []
            }
            user_security_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    event_type: 'login' | 'logout' | 'reset' | 'fail' | 'register'
                    ip_address: string | null
                    device_info: Json | null
                    timestamp: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    event_type: 'login' | 'logout' | 'reset' | 'fail' | 'register'
                    ip_address?: string | null
                    device_info?: Json | null
                    timestamp?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    event_type?: 'login' | 'logout' | 'reset' | 'fail' | 'register'
                    ip_address?: string | null
                    device_info?: Json | null
                    timestamp?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    email: string | null
                    department: string | null
                    role: 'student' | 'mentor' | 'admin' | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    email?: string | null
                    department?: string | null
                    role?: 'student' | 'mentor' | 'admin' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    email?: string | null
                    department?: string | null
                    role?: 'student' | 'mentor' | 'admin' | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
    }
}
