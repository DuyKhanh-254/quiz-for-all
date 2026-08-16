# English Practice Quiz

A production-oriented Grade 2 English quiz built with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL/Storage, Zod, and Lucide icons.

The included questions are original starter content. The referenced exam was used only for its four-part structure. No text, picture, or audio was copied from it. Add only assets that you own or are authorized to use.

## What the application includes

- Silent Supabase anonymous sign-in for students; email/password sign-in for administrators.
- Single-choice, image-choice, one-to-one matching, and fill-in-the-blank interfaces.
- Large accessible audio controls for section-level and question-level MP3s.
- Debounced server autosave, refresh recovery, and a local device fallback.
- Server-only grading with private answer keys, immediate results, and owner-only review.
- Protected admin registration, result metrics, search, class filter, sorting, pagination, full submission review, and quiz inspection.
- PostgreSQL RLS on every exposed table plus column grants that prevent browser clients from setting roles, scores, correctness, or awarded points.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Student details, test start/resume, and previous attempts |
| `/quiz/[id]` | Complete quiz experience |
| `/attempts/[id]` | Owner-only submitted-answer review |
| `/admin/login` | Teacher sign-in |
| `/admin/register` | Setup-code-protected administrator creation |
| `/admin` | Results dashboard |
| `/admin/attempts/[id]` | Full answer and protected-key review |
| `/admin/quiz` | Imported quiz inspection |

## Supabase setup

### Step 1 — Create the project

Create a project at [Supabase](https://supabase.com/dashboard). Save the database password somewhere private.

### Step 2 — Copy API values

Open **Project Settings → API** (in some dashboard versions this is **Settings → API Keys**).

Create `.env.local` from `.env.example` and set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_OR_SERVER_SECRET
ADMIN_SETUP_CODE=replace-with-a-long-random-private-value
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- **Project URL** goes into `NEXT_PUBLIC_SUPABASE_URL`.
- **Publishable key** goes into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A legacy `anon` key works if that is what your project exposes.
- **Service role/server secret** goes into `SUPABASE_SERVICE_ROLE_KEY`.
- The first two values are public by design. The service key and setup code are server-only: never use a `NEXT_PUBLIC_` prefix, paste them into browser code, or commit `.env.local`.

### Step 3 — Enable administrator email/password auth

Open **Authentication → Providers → Email** and enable Email/Password. The protected registration endpoint creates the administrator with a confirmed email, so initial setup does not depend on a confirmation email. If you later allow other sign-up flows, decide whether those users must confirm their email; they will still be students and cannot grant themselves the admin role.

### Step 4 — Enable student anonymous sign-ins

Open **Authentication → Providers → Anonymous Sign-Ins** and enable it. Students then see only the friendly name/class screen; the browser reuses the same secure Supabase session on later visits.

### Step 5 — Run the SQL migration

Choose either method:

**SQL Editor:** Open **SQL Editor → New query**, paste all of `supabase/migrations/202608160001_initial_quiz.sql`, and click **Run** once.

**Supabase CLI:** Install and authenticate the CLI, link the project, then run:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migration creates the schema, constraints, indexes, helper functions, RLS policies, column privileges, Storage bucket, and original starter quiz. It is transactional.

### Step 6 — Prepare authorized assets

The migration creates a public-delivery bucket named `quiz-assets`. Public delivery lets native `<audio>` and optimized images load without putting session tokens in media URLs; upload and deletion are still restricted to administrators by Storage policies.

In **Storage → quiz-assets**, create this structure:

```text
english-grade-2-test-1/
  audio/
    section-1.mp3
    section-2.mp3
  images/
    section-2/
    section-3/
    section-4/
```

Upload authorized MP3, PNG, JPG, WEBP, or SVG files (20 MB maximum each). Then enter their relative paths in `content/quiz-content.public.json`, for example `"audio": "audio/section-1.mp3"` or a third option tuple such as `["a", "Kite", "images/section-2/kite.webp"]`. Run the importer described below. Do not upload assets copied from the reference site unless you have permission.

### Step 7 — Protect the administrator setup code

Use a long random value, for example:

```dotenv
ADMIN_SETUP_CODE=use-a-unique-40-plus-character-random-string
```

Do not commit or show it to students. It is compared only in the server route. After creating the initial administrator, you may rotate it, or remove it from the deployed environment to disable new admin registration temporarily.

### Step 8 — Install and run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Step 9 — Create the first administrator

Open <http://localhost:3000/admin/register>, fill in the form using the exact `ADMIN_SETUP_CODE`, and create the account. Registration assigns the admin role with the server-only service key. A public, anonymous, or ordinary authenticated user cannot change their own role.

### Step 10 — Test student mode

Open a separate private/incognito browser at <http://localhost:3000>. Enter a name and class, complete the test, refresh during the attempt to confirm restoration, submit, and open the review. Keep the administrator session in the original browser so the identities do not replace each other.

## Deterministic content import

`content/quiz-content.public.json` contains browser-safe quiz text, asset mappings, and options. `content/quiz-content.private.json` contains only the server-imported grading payload. Neither file is imported by the Next.js client application.

After editing paths or authorized content, load `.env.local` into your shell and run:

```bash
npm run import:quiz
```

Node does not automatically load `.env.local` for standalone scripts. On PowerShell, one safe way is to set each variable for the current terminal before running the command. The importer uses deterministic UUIDs and upserts the quiz, sections, questions, and answer keys; options are replaced for a repeatable result. Application logic never needs editing when content changes.

## Vercel deployment

1. Push the repository to a private or controlled Git host and import it into Vercel.
2. In **Vercel → Project → Settings → Environment Variables**, add all five variables from `.env.example`. Use the production URL for `NEXT_PUBLIC_SITE_URL`, such as `https://english.example.com`.
3. In **Supabase → Authentication → URL Configuration**, set **Site URL** to the production URL. Add both the production URL and `http://localhost:3000/**` to allowed redirect URLs if your project requires them. The current password and anonymous flows do not rely on an OAuth callback, but correct URL configuration keeps later auth features safe.
4. Redeploy after environment changes.
5. Repeat the student test in an incognito browser and check the teacher dashboard in a separate authenticated browser.

## Verification commands

```bash
npm run typecheck
npm run lint
npm test
npm run audit:answers
npm run build
```

The automated security test checks RLS coverage and grants. The answer audit scans student-facing source for private answer payloads and server secrets. Live cross-user RLS checks require a configured Supabase project: create two incognito student sessions, confirm each can select only its own attempt, and run `select * from answer_keys` from a student client—the query must return a permission/RLS error or no rows. Try updating `profiles.role`, `attempts.score`, and `attempt_answers.is_correct`; PostgreSQL column privileges must reject each operation.

## Database tables

- `profiles` — student/administrator profile, with server-controlled role.
- `quizzes`, `quiz_sections`, `questions`, `question_options` — public content for published quizzes.
- `answer_keys` — private, with no student policy or privilege.
- `attempts`, `attempt_answers` — identity-owned work and server-calculated grades.

## Security notes

- API routes verify the Supabase user using `getUser()` before using service credentials.
- Attempt reads require the current `user_id`; review and autosave reject foreign IDs.
- The grading route verifies ownership and in-progress status, loads keys using a server-only client, grades all question types, and returns aggregate result fields only.
- RLS is defense in depth. Column-level grants additionally block role and grading mutations even on an owned row.
- `/admin/*` dashboard routes are guarded by a server layout that checks both authentication and `profiles.role = 'admin'`.
- Administrator registration validates `ADMIN_SETUP_CODE` with a timing-safe server comparison. No setup code or service key enters the client bundle.
