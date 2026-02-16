-- improved trigger function for user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Check for Mentor Role
  if new.raw_user_meta_data->>'role' = 'mentor' then
    -- Verify email domain (backend enforcement)
    if new.email not like '%@mahendra.com' then
      raise exception 'Mentor registration restricted to @mahendra.com emails';
    end if;

    insert into public.mentors (user_id, name, email, expertise)
    values (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'expertise'
    );
    
    -- Assign role in user_roles table if it exists
    insert into public.user_roles (user_id, role)
    values (new.id, 'mentor')
    on conflict (user_id) do nothing;

  -- Check for Student Role
  elsif new.raw_user_meta_data->>'role' = 'student' then
    insert into public.students (user_id, name, email, department)
    values (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'department'
    );

    insert into public.user_roles (user_id, role)
    values (new.id, 'student')
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
