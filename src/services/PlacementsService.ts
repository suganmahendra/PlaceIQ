import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type JobListing = Database['public']['Tables']['job_listings']['Row'];

// ─── Types ─────────────────────────────────────────────────────────────────

export interface JobSkill {
    skill: string;
    acquired: boolean;
    progress: number;     // 0-100 from course enrollment
    courseSlug?: string;  // link to "start this course"
    courseId?: string;
}

export type EligibilityStatus = 'Eligible' | 'Almost Ready' | 'Not Ready';

export interface PlacementRole {
    id: string;
    companyName: string;
    title: string;
    description: string | null;
    location: string | null;
    jobType: string | null;
    salaryRange: string | null;
    requiredSkills: JobSkill[];
    matchPercentage: number;
    eligibilityStatus: EligibilityStatus;
    minReadinessScore: number;
    deadline: string | null;
    isActive: boolean;
    hasApplied: boolean;
    applicationId?: string;
}

// Map from required_skill tag → course categories in the DB
// This normalises e.g. "Machine Learning" → looks for courses with category containing "machine" or "ml"
const SKILL_CATEGORY_MAP: Record<string, string[]> = {
    'python': ['python', 'programming', 'coding'],
    'machine learning': ['machine learning', 'ml', 'ai'],
    'deep learning': ['deep learning', 'neural', 'ai'],
    'data science': ['data science', 'data', 'analytics'],
    'data analysis': ['data analysis', 'data', 'analytics'],
    'dsa': ['dsa', 'algorithms', 'data structures'],
    'algorithms': ['dsa', 'algorithms', 'data structures'],
    'sql': ['sql', 'database', 'db'],
    'java': ['java', 'programming'],
    'javascript': ['javascript', 'js', 'web', 'frontend'],
    'react': ['react', 'frontend', 'web'],
    'node': ['node', 'backend', 'server'],
    'system design': ['system design', 'architecture'],
    'statistics': ['statistics', 'maths', 'probability'],
    'mathematics': ['mathematics', 'maths', 'statistics'],
    'git': ['git', 'devops', 'tools'],
    'devops': ['devops', 'docker', 'cloud'],
    'cloud': ['cloud', 'aws', 'gcp', 'azure'],
    'web development': ['web', 'frontend', 'html', 'css'],
    'frontend': ['frontend', 'web', 'react', 'html'],
    'backend': ['backend', 'node', 'server', 'api'],
    'full stack': ['frontend', 'backend', 'web'],
    'nlp': ['nlp', 'natural language', 'ai'],
    'computer vision': ['computer vision', 'cv', 'image', 'ai'],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Given a skill name and the student's map of {courseCategory → progress},
 * find the best matching course progress (0-100).
 */
function findSkillProgress(
    skillName: string,
    proficiencyMap: Map<string, { progress: number; slug: string; id: string }>,
): { progress: number; slug?: string; id?: string } {
    const lc = skillName.toLowerCase().trim();

    // 1. Exact match on category
    if (proficiencyMap.has(lc)) {
        const entry = proficiencyMap.get(lc)!;
        return { progress: entry.progress, slug: entry.slug, id: entry.id };
    }

    // 2. Keyword match via SKILL_CATEGORY_MAP
    const keywords = SKILL_CATEGORY_MAP[lc] ?? [lc];
    let best = { progress: 0, slug: undefined as string | undefined, id: undefined as string | undefined };

    for (const [cat, entry] of proficiencyMap.entries()) {
        for (const kw of keywords) {
            if (cat.includes(kw) || kw.includes(cat)) {
                if (entry.progress > best.progress) {
                    best = { progress: entry.progress, slug: entry.slug, id: entry.id };
                }
            }
        }
    }

    return best;
}

function computeStatus(matchPct: number, allAcquired: boolean): EligibilityStatus {
    if (allAcquired) return 'Eligible';
    if (matchPct >= 60) return 'Almost Ready';
    return 'Not Ready';
}

// ─── Service ────────────────────────────────────────────────────────────────

export const placementsService = {
    /**
     * Fetch all active job listings
     */
    async fetchJobListings() {
        const { data, error } = await supabase
            .from('job_listings')
            .select('*')
            .eq('is_active', true)
            .order('posted_at', { ascending: false });

        if (error) throw error;
        return data ?? [];
    },

    /**
     * Build a map of { lowerCaseCategory → { progress, slug, id } }
     * from all the student's active enrollments + their course metadata.
     */
    async fetchStudentCourseProficiency(studentId: string): Promise<Map<string, { progress: number; slug: string; id: string }>> {
        const { data } = await supabase
            .from('enrollments')
            .select(`
                progress_percent,
                status,
                courses (
                    id,
                    slug,
                    title,
                    category
                )
            `)
            .eq('student_id', studentId)
            .neq('status', 'dropped');

        const map = new Map<string, { progress: number; slug: string; id: string }>();

        for (const enr of data ?? []) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const course = enr.courses as any;
            if (!course) continue;

            const progress = enr.progress_percent ?? 0;
            const slug = course.slug ?? '';
            const id = course.id ?? '';

            // Index by category (lower)
            if (course.category) {
                const cat = (course.category as string).toLowerCase().trim();
                const existing = map.get(cat);
                if (!existing || progress > existing.progress) {
                    map.set(cat, { progress, slug, id });
                }
            }

            // Also index by title words for broader matching
            if (course.title) {
                const titleWords = (course.title as string).toLowerCase().split(/\s+/);
                for (const word of titleWords) {
                    if (word.length < 3) continue;
                    const existing = map.get(word);
                    if (!existing || progress > existing.progress) {
                        map.set(word, { progress, slug, id });
                    }
                }
            }
        }

        return map;
    },

    /**
     * Fetch the student's existing job applications
     */
    async fetchStudentApplications(studentId: string): Promise<Set<string>> {
        const { data } = await supabase
            .from('job_applications')
            .select('job_id')
            .eq('student_id', studentId);

        return new Set((data ?? []).map((a) => a.job_id));
    },

    /**
     * Apply to a job. Returns the new application row.
     */
    async applyToJob(studentId: string, jobId: string) {
        const { data, error } = await supabase
            .from('job_applications')
            .insert({
                student_id: studentId,
                job_id: jobId,
                status: 'applied',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Compute enriched placement roles with real eligibility data.
     */
    computeEligibility(
        jobs: JobListing[],
        proficiencyMap: Map<string, { progress: number; slug: string; id: string }>,
        appliedJobIds: Set<string>,
        studentReadinessScore: number,
    ): PlacementRole[] {
        return jobs.map((job) => {
            const rawSkills: string[] = (job.required_skills as string[]) ?? [];

            const jobSkills: JobSkill[] = rawSkills.map((skillName) => {
                const match = findSkillProgress(skillName, proficiencyMap);
                const THRESHOLD = 80;
                return {
                    skill: skillName,
                    acquired: match.progress >= THRESHOLD,
                    progress: match.progress,
                    courseSlug: match.slug,
                    courseId: match.id,
                };
            });

            const acquiredCount = jobSkills.filter((s) => s.acquired).length;
            const total = jobSkills.length;
            const matchPct = total > 0 ? Math.round((acquiredCount / total) * 100) : 0;
            const allAcquired = acquiredCount === total && total > 0;

            // Also factor in readiness score if the job has a minimum
            const meetsReadiness = studentReadinessScore >= (job.min_readiness_score ?? 0);
            const effectiveEligible = allAcquired && meetsReadiness;

            return {
                id: job.id,
                companyName: job.company_name,
                title: job.title,
                description: job.description ?? null,
                location: job.location ?? null,
                jobType: job.type ?? null,
                salaryRange: job.salary_range ?? null,
                requiredSkills: jobSkills,
                matchPercentage: matchPct,
                eligibilityStatus: computeStatus(matchPct, effectiveEligible),
                minReadinessScore: job.min_readiness_score ?? 0,
                deadline: job.deadline ?? null,
                isActive: job.is_active,
                hasApplied: appliedJobIds.has(job.id),
            };
        }).sort((a, b) => b.matchPercentage - a.matchPercentage);
    },

    /**
     * Single entry point: fetch everything and return computed roles.
     */
    async fetchAll(studentId: string, studentReadinessScore: number): Promise<PlacementRole[]> {
        const [jobs, proficiencyMap, appliedIds] = await Promise.all([
            this.fetchJobListings(),
            this.fetchStudentCourseProficiency(studentId),
            this.fetchStudentApplications(studentId),
        ]);

        return this.computeEligibility(jobs, proficiencyMap, appliedIds, studentReadinessScore);
    },
};
