# PE Platform — Setup Guide
https://silver-engine-4j9wqjqg5q6xh7pqg-3000.app.github.dev/
https://silver-engine-4j9wqjqg5q6xh7pqg-8000.app.github.dev/

Secondary School Physical Education & Olympic Values Education Platform  
**Stack:** Django 4.2 + DRF · PostgreSQL · Next.js 14 · Tailwind CSS

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |

---

## 1 — Database

```sql
-- Run in psql as a superuser
CREATE USER pe_user WITH PASSWORD 'pe_pass';
CREATE DATABASE pe_platform OWNER pe_user;
GRANT ALL PRIVILEGES ON DATABASE pe_platform TO pe_user;
```

---

## 2 — Backend (Django)

```bash
cd pe-platform/backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Seed demo data (subjects, lessons, quizzes, 3 demo users)
python manage.py seed

# Start server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**  
Django Admin: **http://localhost:8000/admin/**

---

## 3 — Frontend (Next.js)

```bash
cd pe-platform/frontend

npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@pe-platform.edu | admin1234 |
| Teacher | teacher@pe-platform.edu | teacher1234 |
| Student | student@pe-platform.edu | student1234 |

---

## Project Structure

```
pe-platform/
├── backend/
│   ├── apps/
│   │   ├── users/          # Auth, RBAC, Schools, Classes
│   │   ├── curriculum/     # Subjects, Topics, Lessons, Activities, OVEP
│   │   ├── assessments/    # Quizzes, Questions, Attempts, Certificates
│   │   └── analytics/      # Teacher & student stats APIs
│   ├── config/             # Django settings, URLs, WSGI
│   └── manage.py
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/     # Login, Register
        │   ├── (student)/  # Dashboard, Curriculum, Quiz, Certificates
        │   ├── (teacher)/  # Dashboard, Classes, Analytics
        │   └── (admin)/    # Admin dashboard
        ├── components/     # UI components, layout
        ├── lib/            # API client, auth context, utils
        └── types/          # TypeScript interfaces
```

---

## API Reference

| Base URL | Purpose |
|----------|---------|
| `POST /api/auth/login/` | JWT login → returns access + refresh tokens |
| `POST /api/auth/register/` | Create new user |
| `GET /api/auth/me/` | Current user profile |
| `GET /api/curriculum/subjects/` | All subjects |
| `GET /api/curriculum/lessons/` | Lessons (filter: `?topic=`, `?is_published=true`) |
| `POST /api/curriculum/lessons/{id}/mark_complete/` | Mark lesson complete |
| `GET /api/assessments/quizzes/` | Published quizzes |
| `POST /api/assessments/quizzes/{id}/start/` | Start an attempt |
| `POST /api/assessments/quizzes/{id}/submit/` | Submit answers → auto-marked |
| `GET /api/assessments/certificates/` | Student's certificates |
| `GET /api/analytics/teacher/dashboard/` | Teacher overview stats |
| `GET /api/analytics/me/stats/` | Student's own stats |

---

## Development Roadmap

### Phase 1 — Prototype (Current)
- [x] Auth & RBAC (Student / Teacher / Admin / Super Admin)
- [x] Curriculum browser (Subject → Topic → Lesson hierarchy)
- [x] Lesson viewer with video, activities, OVEP scenarios
- [x] Progress tracking (started / completed)
- [x] Assessment engine (MCQ + True/False, auto-marking, timed)
- [x] Certificate generation on quiz pass
- [x] Teacher dashboard & class management
- [x] Student progress view per class
- [x] Demo seed data

### Phase 2 — MVP
- [ ] PDF certificate download with QR code
- [ ] Gamification (XP, badges, leaderboards, streaks)
- [ ] Content upload UI (teacher creates lessons without Django Admin)
- [ ] Scenario-based moral learning interactive module
- [ ] Offline caching (PWA / Service Worker)
- [ ] Push notifications for assignments
- [ ] School/user management screens for Admin role
- [ ] Matching question type in quiz engine
- [ ] Report export (PDF/CSV)

### Phase 3 — Production
- [ ] React Native mobile app
- [ ] Cloudflare Stream / S3 video hosting
- [ ] National analytics for Ministry officials
- [ ] Sesotho localization (i18n)
- [ ] AI quiz generation (optional)
- [ ] Deployment to cloud (GCP / AWS)
- [ ] Load testing (10,000+ concurrent users target)

---

## Effort Estimates

| Module | Prototype | MVP | Notes |
|--------|-----------|-----|-------|
| Auth & RBAC | 3 days | +1 day | Social login in Phase 2 |
| Curriculum | 4 days | +3 days | Upload UI in Phase 2 |
| Assessments | 5 days | +3 days | Matching type, PDF certs |
| Gamification | — | 5 days | XP engine, badges |
| Teacher Dashboard | 3 days | +2 days | Report export |
| Admin Panel | 1 day | 4 days | Full UI (currently via Django Admin) |
| Offline / PWA | — | 5 days | Service Worker, sync |
| Mobile App | — | 10 days | React Native (shared API) |
| Localization | — | 3 days | Sesotho strings |
| **Total** | **~3 weeks** | **+6 weeks** | |
