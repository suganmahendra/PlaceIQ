-- Create announcements table
create table if not exists public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  meeting_link text,
  mentor_id uuid references public.mentors(id) on delete cascade,
  is_global boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on announcements
alter table public.announcements enable row level security;

-- Policy for mentors to view and create announcements
create policy "Mentors can manage announcements"
  on public.announcements for all
  using (auth.uid() in (select user_id from public.mentors where id = mentor_id));

-- Policy for students to view announcements
create policy "Students can view announcements"
  on public.announcements for select
  using (true); -- simplify strict RLS for now unless specific student targeting needed

-- Ensure course_modules has order_index
alter table public.course_modules 
add column if not exists order_index integer default 0;

-- Ensure course_lessons has order_index
alter table public.course_lessons 
add column if not exists order_index integer default 0;

-- Ensure course_lessons has enhanced content columns
alter table public.course_lessons
add column if not exists video_url text,
add column if not exists content text, -- Supports Markdown/rich text
add column if not exists code_snippets jsonb; -- For storing code examples
