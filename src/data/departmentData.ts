import type { Department, DepartmentType } from '../types/learningPath';

// Curated YouTube-based learning paths for each department
export const departmentData: Department[] = [
    {
        id: 'IT',
        name: 'IT',
        fullName: 'Information Technology (CSE / AI&DS / AI&ML)',
        description: 'Comprehensive learning paths for Computer Science, AI & Data Science, and AI & Machine Learning students',
        icon: '💻',
        color: 'bg-blue-500',
        courses: [
            {
                id: 'dsa',
                title: 'Data Structures & Algorithms',
                description: 'Master the backbone of technical interviews',
                icon: '🔢',
                totalVideos: 24,
                estimatedHours: 40,
                levels: {
                    bright: [
                        {
                            id: 'dsa-b-1',
                            title: 'Advanced Graph Algorithms - Competitive Programming',
                            description: 'Deep dive into advanced graph theory for competitive coding',
                            youtubeId: 'tWVWeAqZ0WU',
                            thumbnail: 'https://img.youtube.com/vi/tWVWeAqZ0WU/maxresdefault.jpg',
                            duration: '45:20',
                            channel: 'Abdul Bari',
                            difficulty: 'advanced',
                            tags: ['graphs', 'algorithms', 'competitive'],
                            order: 1
                        },
                        {
                            id: 'dsa-b-2',
                            title: 'Dynamic Programming Patterns - Interview Mastery',
                            description: 'Master all DP patterns for FAANG interviews',
                            youtubeId: 'oBt53YbR9Kk',
                            thumbnail: 'https://img.youtube.com/vi/oBt53YbR9Kk/maxresdefault.jpg',
                            duration: '52:15',
                            channel: 'NeetCode',
                            difficulty: 'advanced',
                            tags: ['dynamic-programming', 'patterns', 'interview'],
                            order: 2
                        }
                    ],
                    average: [
                        {
                            id: 'dsa-a-1',
                            title: 'Data Structures Full Course',
                            description: 'Complete data structures with step-by-step examples',
                            youtubeId: 'RBSGKlAvoiM',
                            thumbnail: 'https://img.youtube.com/vi/RBSGKlAvoiM/maxresdefault.jpg',
                            duration: '2:30:45',
                            channel: 'freeCodeCamp',
                            difficulty: 'intermediate',
                            tags: ['data-structures', 'fundamentals'],
                            order: 1
                        },
                        {
                            id: 'dsa-a-2',
                            title: 'Sorting Algorithms Visualized',
                            description: 'Visual explanations of all major sorting algorithms',
                            youtubeId: 'kPRA0W1kECg',
                            thumbnail: 'https://img.youtube.com/vi/kPRA0W1kECg/maxresdefault.jpg',
                            duration: '18:30',
                            channel: 'Timo Bingmann',
                            difficulty: 'intermediate',
                            tags: ['sorting', 'visualization'],
                            order: 2
                        }
                    ],
                    weak: [
                        {
                            id: 'dsa-w-1',
                            title: 'Introduction to Data Structures - Beginner Friendly',
                            description: 'Gentle introduction with real-world analogies',
                            youtubeId: 'zg9ih6SVACc',
                            thumbnail: 'https://img.youtube.com/vi/zg9ih6SVACc/maxresdefault.jpg',
                            duration: '12:45',
                            channel: 'Programming with Mosh',
                            difficulty: 'beginner',
                            tags: ['basics', 'introduction'],
                            order: 1
                        },
                        {
                            id: 'dsa-w-2',
                            title: 'Arrays Explained Simply',
                            description: 'Understanding arrays from scratch with examples',
                            youtubeId: 'QJNwK2uJyGs',
                            thumbnail: 'https://img.youtube.com/vi/QJNwK2uJyGs/maxresdefault.jpg',
                            duration: '15:20',
                            channel: 'CS Dojo',
                            difficulty: 'beginner',
                            tags: ['arrays', 'fundamentals'],
                            order: 2
                        }
                    ]
                }
            },
            {
                id: 'dbms',
                title: 'Database Management Systems',
                description: 'SQL, NoSQL, and database design principles',
                icon: '🗄️',
                totalVideos: 18,
                estimatedHours: 30,
                levels: {
                    bright: [
                        {
                            id: 'dbms-b-1',
                            title: 'Advanced SQL Query Optimization',
                            description: 'Performance tuning and complex query optimization',
                            youtubeId: 'HXV3zeQKqGY',
                            thumbnail: 'https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg',
                            duration: '38:15',
                            channel: 'Hussein Nasser',
                            difficulty: 'advanced',
                            tags: ['sql', 'optimization', 'performance'],
                            order: 1
                        }
                    ],
                    average: [
                        {
                            id: 'dbms-a-1',
                            title: 'SQL Tutorial - Full Database Course',
                            description: 'Complete SQL from basics to intermediate',
                            youtubeId: 'HXV3zeQKqGY',
                            thumbnail: 'https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg',
                            duration: '4:20:00',
                            channel: 'freeCodeCamp',
                            difficulty: 'intermediate',
                            tags: ['sql', 'database'],
                            order: 1
                        }
                    ],
                    weak: [
                        {
                            id: 'dbms-w-1',
                            title: 'What is a Database? - Simple Explanation',
                            description: 'Understanding databases with everyday examples',
                            youtubeId: 'Tk1t3WKK-ZY',
                            thumbnail: 'https://img.youtube.com/vi/Tk1t3WKK-ZY/maxresdefault.jpg',
                            duration: '10:30',
                            channel: 'Fireship',
                            difficulty: 'beginner',
                            tags: ['basics', 'introduction'],
                            order: 1
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'MECH',
        name: 'MECH',
        fullName: 'Mechanical Engineering',
        description: 'Core mechanical engineering concepts and practical applications',
        icon: '⚙️',
        color: 'bg-orange-500',
        courses: [
            {
                id: 'thermodynamics',
                title: 'Thermodynamics',
                description: 'Laws of thermodynamics and heat transfer',
                icon: '🔥',
                totalVideos: 20,
                estimatedHours: 35,
                levels: {
                    bright: [
                        {
                            id: 'thermo-b-1',
                            title: 'Advanced Thermodynamic Cycles',
                            description: 'Deep analysis of Carnot, Rankine, and Brayton cycles',
                            youtubeId: '3BdPxAFMUOw',
                            thumbnail: 'https://img.youtube.com/vi/3BdPxAFMUOw/maxresdefault.jpg',
                            duration: '42:30',
                            channel: 'MIT OpenCourseWare',
                            difficulty: 'advanced',
                            tags: ['cycles', 'efficiency'],
                            order: 1
                        }
                    ],
                    average: [
                        {
                            id: 'thermo-a-1',
                            title: 'Thermodynamics - Complete Course',
                            description: 'Comprehensive coverage with problem-solving',
                            youtubeId: 'MgvTEDXy-Aw',
                            thumbnail: 'https://img.youtube.com/vi/MgvTEDXy-Aw/maxresdefault.jpg',
                            duration: '3:15:00',
                            channel: 'NPTEL',
                            difficulty: 'intermediate',
                            tags: ['fundamentals', 'problems'],
                            order: 1
                        }
                    ],
                    weak: [
                        {
                            id: 'thermo-w-1',
                            title: 'Introduction to Thermodynamics',
                            description: 'Basic concepts explained with real-world examples',
                            youtubeId: 'OH8m6oqJp4k',
                            thumbnail: 'https://img.youtube.com/vi/OH8m6oqJp4k/maxresdefault.jpg',
                            duration: '18:45',
                            channel: 'Khan Academy',
                            difficulty: 'beginner',
                            tags: ['basics', 'introduction'],
                            order: 1
                        }
                    ]
                }
            },
            {
                id: 'som',
                title: 'Strength of Materials',
                description: 'Stress, strain, and material behavior',
                icon: '🏗️',
                totalVideos: 22,
                estimatedHours: 38,
                levels: {
                    bright: [
                        {
                            id: 'som-b-1',
                            title: 'Advanced Stress Analysis',
                            description: 'Complex stress states and failure theories',
                            youtubeId: 'BVRdJj5MxD8',
                            thumbnail: 'https://img.youtube.com/vi/BVRdJj5MxD8/maxresdefault.jpg',
                            duration: '35:20',
                            channel: 'Engineering Explained',
                            difficulty: 'advanced',
                            tags: ['stress', 'analysis'],
                            order: 1
                        }
                    ],
                    average: [
                        {
                            id: 'som-a-1',
                            title: 'Strength of Materials Full Course',
                            description: 'Complete SOM with numerical examples',
                            youtubeId: '2iYqMOb_YBY',
                            thumbnail: 'https://img.youtube.com/vi/2iYqMOb_YBY/maxresdefault.jpg',
                            duration: '2:45:00',
                            channel: 'NPTEL',
                            difficulty: 'intermediate',
                            tags: ['fundamentals', 'numericals'],
                            order: 1
                        }
                    ],
                    weak: [
                        {
                            id: 'som-w-1',
                            title: 'What is Stress and Strain?',
                            description: 'Simple explanation with everyday examples',
                            youtubeId: 'BHZALtqAjeM',
                            thumbnail: 'https://img.youtube.com/vi/BHZALtqAjeM/maxresdefault.jpg',
                            duration: '12:15',
                            channel: 'The Efficient Engineer',
                            difficulty: 'beginner',
                            tags: ['basics', 'concepts'],
                            order: 1
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'CIVIL',
        name: 'CIVIL',
        fullName: 'Civil Engineering',
        description: 'Structural design, construction, and infrastructure',
        icon: '🏛️',
        color: 'bg-green-500',
        courses: [
            {
                id: 'structural-analysis',
                title: 'Structural Analysis',
                description: 'Analysis of beams, frames, and trusses',
                icon: '🌉',
                totalVideos: 25,
                estimatedHours: 42,
                levels: {
                    bright: [
                        {
                            id: 'struct-b-1',
                            title: 'Advanced Structural Analysis Methods',
                            description: 'Matrix methods and finite element analysis',
                            youtubeId: 'QUKP0NLEZxw',
                            thumbnail: 'https://img.youtube.com/vi/QUKP0NLEZxw/maxresdefault.jpg',
                            duration: '48:30',
                            channel: 'MIT OpenCourseWare',
                            difficulty: 'advanced',
                            tags: ['matrix', 'fem'],
                            order: 1
                        }
                    ],
                    average: [
                        {
                            id: 'struct-a-1',
                            title: 'Structural Analysis Complete Course',
                            description: 'Beams, frames, and trusses with examples',
                            youtubeId: '5Zg0LJhZXu8',
                            thumbnail: 'https://img.youtube.com/vi/5Zg0LJhZXu8/maxresdefault.jpg',
                            duration: '3:30:00',
                            channel: 'NPTEL',
                            difficulty: 'intermediate',
                            tags: ['beams', 'frames'],
                            order: 1
                        }
                    ],
                    weak: [
                        {
                            id: 'struct-w-1',
                            title: 'Introduction to Structural Analysis',
                            description: 'Basic concepts and terminology',
                            youtubeId: 'BHZALtqAjeM',
                            thumbnail: 'https://img.youtube.com/vi/BHZALtqAjeM/maxresdefault.jpg',
                            duration: '15:40',
                            channel: 'The Efficient Engineer',
                            difficulty: 'beginner',
                            tags: ['basics', 'introduction'],
                            order: 1
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'ECE',
        name: 'ECE',
        fullName: 'Electronics & Communication Engineering',
        description: 'Digital systems, signals, and communication',
        icon: '📡',
        color: 'bg-purple-500',
        courses: [
            {
                id: 'signals',
                title: 'Signals & Systems',
                description: 'Signal processing and system analysis',
                icon: '📊',
                totalVideos: 28,
                estimatedHours: 45,
                levels: {
                    bright: [
                        {
                            id: 'signals-b-1',
                            title: 'Advanced Signal Processing',
                            description: 'Fourier analysis and filter design',
                            youtubeId: 'spUNpyF58BY',
                            thumbnail: 'https://img.youtube.com/vi/spUNpyF58BY/maxresdefault.jpg',
                            duration: '52:15',
                            channel: 'MIT OpenCourseWare',
                            difficulty: 'advanced',
                            tags: ['fourier', 'filters'],
                            order: 1
                        }
                    ],
                    average: [
                        {
                            id: 'signals-a-1',
                            title: 'Signals and Systems Full Course',
                            description: 'Complete coverage with problem-solving',
                            youtubeId: 'UrZxGGHfJ1E',
                            thumbnail: 'https://img.youtube.com/vi/UrZxGGHfJ1E/maxresdefault.jpg',
                            duration: '4:00:00',
                            channel: 'NPTEL',
                            difficulty: 'intermediate',
                            tags: ['fundamentals', 'problems'],
                            order: 1
                        }
                    ],
                    weak: [
                        {
                            id: 'signals-w-1',
                            title: 'What are Signals? - Simple Explanation',
                            description: 'Understanding signals with real-world examples',
                            youtubeId: 'VyWH6qkBXg0',
                            thumbnail: 'https://img.youtube.com/vi/VyWH6qkBXg0/maxresdefault.jpg',
                            duration: '14:20',
                            channel: 'Khan Academy',
                            difficulty: 'beginner',
                            tags: ['basics', 'introduction'],
                            order: 1
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'EEE',
        name: 'EEE',
        fullName: 'Electrical & Electronics Engineering',
        description: 'Power systems, machines, and control',
        icon: '⚡',
        color: 'bg-yellow-500',
        courses: [
            {
                id: 'power-systems',
                title: 'Power Systems',
                description: 'Generation, transmission, and distribution',
                icon: '🔌',
                totalVideos: 26,
                estimatedHours: 44,
                levels: {
                    bright: [
                        {
                            id: 'power-b-1',
                            title: 'Advanced Power System Analysis',
                            description: 'Load flow and fault analysis',
                            youtubeId: 'XgC5tYFMW3A',
                            thumbnail: 'https://img.youtube.com/vi/XgC5tYFMW3A/maxresdefault.jpg',
                            duration: '46:40',
                            channel: 'MIT OpenCourseWare',
                            difficulty: 'advanced',
                            tags: ['load-flow', 'faults'],
                            order: 1
                        }
                    ],
                    average: [
                        {
                            id: 'power-a-1',
                            title: 'Power Systems Complete Course',
                            description: 'Comprehensive power systems with examples',
                            youtubeId: 'Omz0JkVFUdY',
                            thumbnail: 'https://img.youtube.com/vi/Omz0JkVFUdY/maxresdefault.jpg',
                            duration: '3:45:00',
                            channel: 'NPTEL',
                            difficulty: 'intermediate',
                            tags: ['fundamentals', 'examples'],
                            order: 1
                        }
                    ],
                    weak: [
                        {
                            id: 'power-w-1',
                            title: 'Introduction to Power Systems',
                            description: 'Basic concepts of electricity generation',
                            youtubeId: 'w2itwFJCgFQ',
                            thumbnail: 'https://img.youtube.com/vi/w2itwFJCgFQ/maxresdefault.jpg',
                            duration: '16:30',
                            channel: 'Practical Engineering',
                            difficulty: 'beginner',
                            tags: ['basics', 'generation'],
                            order: 1
                        }
                    ]
                }
            }
        ]
    }
];

export const getDepartmentById = (id: DepartmentType): Department | undefined => {
    return departmentData.find(dept => dept.id === id);
};

export const getCourseById = (departmentId: DepartmentType, courseId: string) => {
    const department = getDepartmentById(departmentId);
    return department?.courses.find(course => course.id === courseId);
};
