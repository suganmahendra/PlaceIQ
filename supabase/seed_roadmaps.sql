-- Add columns to tables if not exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'blue';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS description TEXT;

-- 1. DSA & Algorithms
WITH dsa_course AS (
    INSERT INTO courses (title, slug, description, difficulty, estimated_hours, category, color, is_published, is_featured)
    VALUES (
        'DSA & Algorithms', 
        'dsa-algorithms', 
        'The backbone of technical interviews. Learn efficiency, complexity, and patterns.', 
        'Intermediate', 
        120, 
        'Computer Science', 
        'purple', 
        true, 
        true
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        difficulty = EXCLUDED.difficulty,
        color = EXCLUDED.color
    RETURNING id
),
dsa_phase_1 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Foundations', 'Big O, Time & Space Complexity', 1 FROM dsa_course
    RETURNING id
),
dsa_phase_2 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Linear Data Structures', 'Lists, Stacks, Queues', 2 FROM dsa_course
    RETURNING id
),
dsa_phase_3 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Non-Linear Structures', 'Trees, Graphs, Heaps', 3 FROM dsa_course
    RETURNING id
),
dsa_phase_4 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Advanced Topics', 'DP, Greedy, Patterns', 4 FROM dsa_course
    RETURNING id
)
INSERT INTO course_lessons (module_id, title, description, content_markdown, order_index)
SELECT id, 'Time & Space Complexity', 'Big O notation analysis', '# Time & Space Complexity\n\nUnderstand the efficiency of your code.', 1 FROM dsa_phase_1
UNION ALL
SELECT id, 'Arrays & Strings', 'Sliding Window, Two Pointers', '# Arrays & Strings\n\nCore techniques for interview problems.', 2 FROM dsa_phase_1
UNION ALL
SELECT id, 'Hashing & Sets', 'Hash Maps usage', '# Hashing\n\nFast lookups with O(1) complexity.', 3 FROM dsa_phase_1
UNION ALL
SELECT id, 'Linked Lists', 'Singly & Doubly Linked Lists', '# Linked Lists\n\nPointer manipulation mastery.', 1 FROM dsa_phase_2
UNION ALL
SELECT id, 'Stacks & Queues', 'LIFO & FIFO', '# Stacks & Queues\n\nEssential for processing order.', 2 FROM dsa_phase_2
UNION ALL
SELECT id, 'Trees & Binary Trees', 'Traversals (Inorder, Preorder)', '# Trees\n\nHierarchical data structures.', 1 FROM dsa_phase_3
UNION ALL
SELECT id, 'Graphs', 'BFS, DFS, Shortest Path', '# Graphs\n\nModeling complex relationships.', 2 FROM dsa_phase_3
UNION ALL
SELECT id, 'Dynamic Programming', 'Memoization & Tabulation', '# Dynamic Programming\n\nSolving complex problems by breaking them down.', 1 FROM dsa_phase_4;

-- 2. Full-Stack Mastery
WITH fs_course AS (
    INSERT INTO courses (title, slug, description, difficulty, estimated_hours, category, color, is_published, is_featured)
    VALUES (
        'Full-Stack Mastery', 
        'full-stack-mastery', 
        'Master modern web development from HTML/CSS to advanced React and Node.js.', 
        'Beginner', 
        160, 
        'Web Development', 
        'blue', 
        true, 
        true
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        color = EXCLUDED.color
    RETURNING id
),
fs_phase_1 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Foundation', 'HTML, CSS, JS Basics', 1 FROM fs_course
    RETURNING id
),
fs_phase_2 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Frontend Development', 'React, Tailwind', 2 FROM fs_course
    RETURNING id
),
fs_phase_3 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Backend Development', 'Node.js, Express, DBs', 3 FROM fs_course
    RETURNING id
)
INSERT INTO course_lessons (module_id, title, description, content_markdown, order_index)
SELECT id, 'HTML & CSS Basics', 'Semantic Web & Styling', '# HTML & CSS\n\nThe building blocks of the web.', 1 FROM fs_phase_1
UNION ALL
SELECT id, 'JavaScript Fundamentals', 'ES6+, DOM', '# JavaScript\n\nThe language of the web.', 2 FROM fs_phase_1
UNION ALL
SELECT id, 'React Fundamentals', 'Components, Props, State', '# React\n\nBuilding UI with components.', 1 FROM fs_phase_2
UNION ALL
SELECT id, 'Node.js & Express', 'Server-side JS', '# Node.js\n\nJavaScript on the server.', 1 FROM fs_phase_3
UNION ALL
SELECT id, 'Databases', 'SQL vs NoSQL', '# Databases\n\nStoring application data.', 2 FROM fs_phase_3;

-- 3. Soft Skills & HR
WITH ss_course AS (
    INSERT INTO courses (title, slug, description, difficulty, estimated_hours, category, color, is_published, is_featured)
    VALUES (
        'Soft Skills & HR', 
        'soft-skills-hr', 
        'Master the art of communication, leadership, and acing the behavioral round.', 
        'Beginner', 
        40, 
        'Career Growth', 
        'pink', 
        true, 
        false
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        color = EXCLUDED.color
    RETURNING id
),
ss_phase_1 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Communication Mastery', 'Verbal & Non-Verbal', 1 FROM ss_course
    RETURNING id
),
ss_phase_2 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Behavioral Interview Prep', 'STAR Method', 2 FROM ss_course
    RETURNING id
)
INSERT INTO course_lessons (module_id, title, description, content_markdown, order_index)
SELECT id, 'Effective Communication', 'Active Listening', '# Communication\n\nKey to team success.', 1 FROM ss_phase_1
UNION ALL
SELECT id, 'STAR Method', 'Answering Behavioral Questions', '# STAR Method\n\nSituation, Task, Action, Result.', 1 FROM ss_phase_2
UNION ALL
SELECT id, 'Mock Interviews', 'Practice Scenarios', '# Mock Interviews\n\nPractice makes perfect.', 2 FROM ss_phase_2;

-- 4. System Design
WITH sd_course AS (
    INSERT INTO courses (title, slug, description, difficulty, estimated_hours, category, color, is_published, is_featured)
    VALUES (
        'System Design', 
        'system-design', 
        'Learn how to architect scalable systems for millions of concurrent users.', 
        'Advanced', 
        100, 
        'Architecture', 
        'orange', 
        true, 
        true
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        color = EXCLUDED.color
    RETURNING id
),
sd_phase_1 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Fundamentals', 'Scaling, Load Balancing', 1 FROM sd_course
    RETURNING id
),
sd_phase_2 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Real-World Systems', 'Design Twitter, Uber', 2 FROM sd_course
    RETURNING id
)
INSERT INTO course_lessons (module_id, title, description, content_markdown, order_index)
SELECT id, 'Scalability Basics', 'Vertical vs Horizontal', '# Scalability\n\nGrowing your system.', 1 FROM sd_phase_1
UNION ALL
SELECT id, 'Load Balancing', 'Algorithms & Strategies', '# Load Balancing\n\nDistributing traffic.', 2 FROM sd_phase_1
UNION ALL
SELECT id, 'Design Twitter', 'Feed & Followers', '# Design Twitter\n\nArchitecting a social network.', 1 FROM sd_phase_2;

-- 5. AI & Machine Learning (Placeholder 1)
WITH ai_course AS (
    INSERT INTO courses (title, slug, description, difficulty, estimated_hours, category, color, is_published, is_featured)
    VALUES (
        'AI & Machine Learning', 
        'ai-ml-fundamentals', 
        'Introduction to AI, Machine Learning, and Deep Learning concepts.', 
        'Advanced', 
        140, 
        'Artificial Intelligence', 
        'purple', 
        true, 
        true
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        color = EXCLUDED.color
    RETURNING id
),
ai_phase_1 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'Introduction to AI', 'What is AI?', 1 FROM ai_course
    RETURNING id
)
INSERT INTO course_lessons (module_id, title, description, content_markdown, order_index)
SELECT id, 'Basics of ML', 'Supervised vs Unsupervised', '# ML Basics\n\nLearning from data.', 1 FROM ai_phase_1;

-- 6. DevOps Engineering (Placeholder 2)
WITH do_course AS (
    INSERT INTO courses (title, slug, description, difficulty, estimated_hours, category, color, is_published, is_featured)
    VALUES (
        'DevOps Engineering', 
        'devops-engineering', 
        'Bridge the gap between development and operations with CI/CD and Cloud.', 
        'Intermediate', 
        90, 
        'DevOps', 
        'blue', 
        true, 
        false
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        color = EXCLUDED.color
    RETURNING id
),
do_phase_1 AS (
    INSERT INTO course_modules (course_id, title, description, order_index)
    SELECT id, 'CI/CD Pipelines', 'Automation', 1 FROM do_course
    RETURNING id
)
INSERT INTO course_lessons (module_id, title, description, content_markdown, order_index)
SELECT id, 'Intro to Docker', 'Containerization', '# Docker\n\nBuild, ship, and run any app.', 1 FROM do_phase_1;
