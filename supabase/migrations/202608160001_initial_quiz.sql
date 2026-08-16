begin;

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  class_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  grade text not null,
  subject text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_sections (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  title text not null,
  instruction text not null default '',
  section_type text not null check (section_type in ('listening_choice','listening_image_choice','matching','fill_blank')),
  position integer not null check (position > 0),
  audio_url text,
  image_url text,
  unique (quiz_id, position)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  section_id uuid not null references public.quiz_sections(id) on delete cascade,
  position integer not null check (position > 0),
  question_type text not null check (question_type in ('single_choice','image_choice','matching','fill_blank')),
  prompt text not null,
  image_url text,
  audio_url text,
  metadata jsonb not null default '{}'::jsonb,
  points numeric(8,2) not null default 1 check (points >= 0),
  created_at timestamptz not null default now(),
  unique (section_id, position)
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_key text not null,
  option_text text,
  image_url text,
  position integer not null check (position > 0),
  unique (question_id, option_key),
  unique (question_id, position)
);

create table public.answer_keys (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references public.questions(id) on delete cascade,
  answer jsonb not null,
  explanation text
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  student_name text not null check (char_length(student_name) between 2 and 100),
  class_name text not null check (char_length(class_name) between 1 and 40),
  status text not null default 'in_progress' check (status in ('in_progress','submitted')),
  score numeric(8,2),
  max_score numeric(8,2),
  percentage numeric(5,2),
  correct_count integer,
  total_questions integer,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  created_at timestamptz not null default now()
);

create unique index one_open_attempt_per_quiz on public.attempts(user_id, quiz_id) where status = 'in_progress';
create index attempts_user_created_idx on public.attempts(user_id, created_at desc);
create index attempts_submitted_idx on public.attempts(submitted_at desc) where status = 'submitted';

create table public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  response jsonb not null,
  is_correct boolean,
  awarded_points numeric(8,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create index attempt_answers_attempt_idx on public.attempt_answers(attempt_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger quizzes_updated_at before update on public.quizzes for each row execute function public.set_updated_at();
create trigger attempt_answers_updated_at before update on public.attempt_answers for each row execute function public.set_updated_at();

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.role is distinct from new.role and coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role' then
    raise exception 'Profile roles can only be assigned by the trusted server';
  end if;
  return new;
end;
$$;
create trigger protect_profile_role before update on public.profiles for each row execute function public.protect_profile_role();

alter table public.profiles enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_sections enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.answer_keys enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_insert_student_self" on public.profiles for insert to authenticated with check (id = auth.uid() and role = 'student');
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "published_quizzes_read" on public.quizzes for select to authenticated using (is_published or public.is_admin());
create policy "published_sections_read" on public.quiz_sections for select to authenticated using (public.is_admin() or exists (select 1 from public.quizzes q where q.id = quiz_id and q.is_published));
create policy "published_questions_read" on public.questions for select to authenticated using (public.is_admin() or exists (select 1 from public.quizzes q where q.id = quiz_id and q.is_published));
create policy "published_options_read" on public.question_options for select to authenticated using (public.is_admin() or exists (select 1 from public.questions qu join public.quizzes q on q.id = qu.quiz_id where qu.id = question_id and q.is_published));

create policy "answer_keys_admin_only" on public.answer_keys for select to authenticated using (public.is_admin());

create policy "attempts_select_owner_or_admin" on public.attempts for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "attempts_insert_owner" on public.attempts for insert to authenticated with check (user_id = auth.uid() and status = 'in_progress' and score is null and max_score is null and percentage is null and correct_count is null and total_questions is null and submitted_at is null and duration_seconds is null);
create policy "attempts_update_active_owner" on public.attempts for update to authenticated using ((user_id = auth.uid() and status = 'in_progress') or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

create policy "attempt_answers_select_owner_or_admin" on public.attempt_answers for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "attempt_answers_insert_active_owner" on public.attempt_answers for insert to authenticated with check (user_id = auth.uid() and is_correct is null and awarded_points is null and exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid() and a.status = 'in_progress'));
create policy "attempt_answers_update_active_owner" on public.attempt_answers for update to authenticated using (user_id = auth.uid() and exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid() and a.status = 'in_progress')) with check (user_id = auth.uid() or public.is_admin());

revoke all on public.answer_keys from anon, authenticated;
grant select on public.answer_keys to authenticated;
grant select on public.quizzes, public.quiz_sections, public.questions, public.question_options to authenticated;
grant select on public.profiles to authenticated;
grant insert (id, full_name, class_name, role) on public.profiles to authenticated;
grant update (full_name, class_name, updated_at) on public.profiles to authenticated;
grant select on public.attempts to authenticated;
grant insert (quiz_id, user_id, student_name, class_name, status, started_at) on public.attempts to authenticated;
grant update (student_name, class_name) on public.attempts to authenticated;
grant select on public.attempt_answers to authenticated;
grant insert (attempt_id, question_id, user_id, response) on public.attempt_answers to authenticated;
grant update (response, updated_at) on public.attempt_answers to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quiz-assets', 'quiz-assets', true, 20971520, array['audio/mpeg','audio/mp4','image/png','image/jpeg','image/webp','image/svg+xml'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "admins_upload_quiz_assets" on storage.objects for insert to authenticated with check (bucket_id = 'quiz-assets' and public.is_admin());
create policy "admins_update_quiz_assets" on storage.objects for update to authenticated using (bucket_id = 'quiz-assets' and public.is_admin()) with check (bucket_id = 'quiz-assets' and public.is_admin());
create policy "admins_delete_quiz_assets" on storage.objects for delete to authenticated using (bucket_id = 'quiz-assets' and public.is_admin());

-- Original starter content: structurally inspired by common Grade 2 skills, not copied from the reference exam.
insert into public.quizzes (id, slug, title, description, grade, subject, is_published) values
('10000000-0000-4000-8000-000000000001', 'english-grade-2-semester-2', 'English Grade 2', 'Semester 2 Practice Test', 'Grade 2', 'English', true);

insert into public.quiz_sections (id, quiz_id, title, instruction, section_type, position) values
('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Listen and circle','Listen to your teacher or the uploaded audio. Circle the word you hear.','listening_choice',1),
('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','Listen and tick','Listen, then choose the matching picture.','listening_image_choice',2),
('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','Read and match','Match each sentence with the best ending. Use each choice once.','matching',3),
('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000001','Look and write','Look at each picture, then write the missing word.','fill_blank',4);

insert into public.questions (id,quiz_id,section_id,position,question_type,prompt,metadata,points) values
('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',1,'single_choice','Which word do you hear?','{}',1),
('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',2,'single_choice','Choose the classroom word you hear.','{}',1),
('30000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',3,'single_choice','Choose the animal word you hear.','{}',1),
('30000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',4,'single_choice','Choose the colour word you hear.','{}',1),
('30000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',1,'image_choice','Which picture shows a kite?','{}',1),
('30000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',2,'image_choice','Which picture shows two cats?','{}',1),
('30000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',3,'image_choice','Which picture shows a yellow hat?','{}',1),
('30000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',4,'image_choice','Which picture shows a book on a table?','{}',1),
('30000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003',1,'matching','Make four complete sentences.','{"left_items":[{"key":"hello","text":"Hello!"},{"key":"name","text":"What is your name?"},{"key":"weather","text":"How is the weather?"},{"key":"thanks","text":"Thank you."}]}',4),
('30000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000004',1,'fill_blank','I fly my ____ in the park.','{}',1),
('30000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000004',2,'fill_blank','This is my red ____.','{}',1),
('30000000-0000-4000-8000-000000000012','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000004',3,'fill_blank','The ____ says meow.','{}',1),
('30000000-0000-4000-8000-000000000013','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000004',4,'fill_blank','Open your English ____.','{}',1);

insert into public.question_options (question_id,option_key,option_text,position) values
('30000000-0000-4000-8000-000000000001','a','ship',1),('30000000-0000-4000-8000-000000000001','b','shop',2),('30000000-0000-4000-8000-000000000001','c','sheep',3),
('30000000-0000-4000-8000-000000000002','a','pen',1),('30000000-0000-4000-8000-000000000002','b','pencil',2),('30000000-0000-4000-8000-000000000002','c','ruler',3),
('30000000-0000-4000-8000-000000000003','a','dog',1),('30000000-0000-4000-8000-000000000003','b','duck',2),('30000000-0000-4000-8000-000000000003','c','cat',3),
('30000000-0000-4000-8000-000000000004','a','green',1),('30000000-0000-4000-8000-000000000004','b','blue',2),('30000000-0000-4000-8000-000000000004','c','brown',3),
('30000000-0000-4000-8000-000000000005','a','Kite',1),('30000000-0000-4000-8000-000000000005','b','Ball',2),('30000000-0000-4000-8000-000000000005','c','Bike',3),
('30000000-0000-4000-8000-000000000006','a','One dog',1),('30000000-0000-4000-8000-000000000006','b','Two cats',2),('30000000-0000-4000-8000-000000000006','c','Three birds',3),
('30000000-0000-4000-8000-000000000007','a','Red cap',1),('30000000-0000-4000-8000-000000000007','b','Blue bag',2),('30000000-0000-4000-8000-000000000007','c','Yellow hat',3),
('30000000-0000-4000-8000-000000000008','a','Book on a table',1),('30000000-0000-4000-8000-000000000008','b','Book under a chair',2),('30000000-0000-4000-8000-000000000008','c','Book in a bag',3),
('30000000-0000-4000-8000-000000000009','a','You are welcome.',1),('30000000-0000-4000-8000-000000000009','b','It is sunny.',2),('30000000-0000-4000-8000-000000000009','c','Hi!',3),('30000000-0000-4000-8000-000000000009','d','My name is Mai.',4);

insert into public.answer_keys (question_id,answer,explanation) values
('30000000-0000-4000-8000-000000000001','{"option":"c"}','The target listening word is “sheep”.'),
('30000000-0000-4000-8000-000000000002','{"option":"b"}','The target listening word is “pencil”.'),
('30000000-0000-4000-8000-000000000003','{"option":"a"}','The target listening word is “dog”.'),
('30000000-0000-4000-8000-000000000004','{"option":"b"}','The target listening word is “blue”.'),
('30000000-0000-4000-8000-000000000005','{"option":"a"}',null),
('30000000-0000-4000-8000-000000000006','{"option":"b"}',null),
('30000000-0000-4000-8000-000000000007','{"option":"c"}',null),
('30000000-0000-4000-8000-000000000008','{"option":"a"}',null),
('30000000-0000-4000-8000-000000000009','{"pairs":{"hello":"c","name":"d","weather":"b","thanks":"a"}}',null),
('30000000-0000-4000-8000-000000000010','{"accepted":["kite"]}',null),
('30000000-0000-4000-8000-000000000011','{"accepted":["ball"]}',null),
('30000000-0000-4000-8000-000000000012','{"accepted":["cat"]}',null),
('30000000-0000-4000-8000-000000000013','{"accepted":["book"]}',null);

commit;
