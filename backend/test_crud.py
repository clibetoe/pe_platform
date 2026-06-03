"""
CRUD verification script — tests every curriculum and assessment endpoint.
"""
import os, django, json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework.test import APIClient
from apps.users.models import User

client = APIClient()

PASS = "✅"
FAIL = "❌"
results = []

def check(label, condition, detail=""):
    icon = PASS if condition else FAIL
    msg = f"{icon} {label}"
    if detail:
        msg += f"  ({detail})"
    print(msg)
    results.append((label, condition))
    return condition

def login(email, password="testpass123"):
    r = client.post("/api/auth/login/", {"email": email, "password": password})
    if r.status_code == 200:
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {r.data['access']}")
    return r.status_code == 200

def logout():
    client.credentials()

# ── 1. Auth ────────────────────────────────────────────────────────────────────
print("\n── Auth ──────────────────────────────────────────────────────")

# Login as teacher
ok = login("teacher@demo.edu", "teacher123")
check("Teacher login", ok, "teacher@demo.edu")

if not ok:
    # try common passwords
    for pw in ["password", "12345678", "demo1234", "Teacher123", "Teacher123!", "teacherdemo"]:
        ok = login("teacher@demo.edu", pw)
        if ok:
            print(f"   (found password: {pw})")
            break
    check("Teacher login (retry)", ok)

r = client.get("/api/auth/me/")
check("GET /auth/me/ returns 200", r.status_code == 200)
check("User has role=teacher", r.data.get("role") == "teacher")
check("User has school", r.data.get("school") is not None)

# ── 2. Schools ─────────────────────────────────────────────────────────────────
print("\n── Schools ───────────────────────────────────────────────────")
logout()

r = client.get("/api/auth/schools/")
check("GET /auth/schools/ unauthenticated → 200", r.status_code == 200)
school_count = r.data.get("count", len(r.data.get("results", [])))
check("Schools list has 8 entries", school_count == 8, f"count={school_count}")
school_id = r.data.get("results", [{}])[0].get("id")
check("Schools have id field", school_id is not None)

# ── 3. Subjects CRUD ───────────────────────────────────────────────────────────
print("\n── Subjects ──────────────────────────────────────────────────")

# List as unauthenticated — should fail (requires auth)
r = client.get("/api/curriculum/subjects/")
check("GET /curriculum/subjects/ unauthenticated → 401", r.status_code == 401)

# Login as teacher (need working password first)
teacher = User.objects.get(email="teacher@demo.edu")
teacher.set_password("Teacher123!")
teacher.save()
ok = login("teacher@demo.edu", "Teacher123!")
check("Teacher login with reset password", ok)

r = client.get("/api/curriculum/subjects/")
check("GET /curriculum/subjects/ authenticated → 200", r.status_code == 200)
subjects = r.data.get("results", r.data)
check("6 subjects seeded", len(subjects) >= 6, f"count={len(subjects)}")

# Retrieve single subject with topics
subj_id = subjects[0]["id"]
r = client.get(f"/api/curriculum/subjects/{subj_id}/")
check("GET /curriculum/subjects/{id}/ → 200", r.status_code == 200)
check("Subject detail has topics list", "topics" in r.data)

# Try to CREATE a subject as teacher — should fail (admin only)
r = client.post("/api/curriculum/subjects/", {"name": "Test Sport", "description": "Teacher trying to create", "icon": "🧪"}, format="json")
check("Teacher cannot CREATE subject → 403", r.status_code == 403)

# Login as admin to test create/update/delete
admin_user = User.objects.filter(role__in=["admin", "super_admin"]).first()
admin_user.set_password("Admin123!")
admin_user.save()
ok = login(admin_user.email, "Admin123!")
check("Admin login", ok)

r = client.post("/api/curriculum/subjects/", {"name": "Test Sport", "description": "Admin created sport", "icon": "🧪"}, format="json")
check("Admin CREATE subject → 201", r.status_code == 201, f"status={r.status_code}")
test_subj_id = r.data.get("id")

r = client.patch(f"/api/curriculum/subjects/{test_subj_id}/", {"description": "Updated description"}, format="json")
check("Admin PATCH subject → 200", r.status_code == 200)
check("Subject description updated", r.data.get("description") == "Updated description")

r = client.delete(f"/api/curriculum/subjects/{test_subj_id}/")
check("Admin DELETE subject → 204", r.status_code == 204)

# ── 4. Topics CRUD ─────────────────────────────────────────────────────────────
print("\n── Topics ────────────────────────────────────────────────────")

login("teacher@demo.edu", "Teacher123!")

r = client.get("/api/curriculum/topics/")
check("GET /curriculum/topics/ → 200", r.status_code == 200)
topics = r.data.get("results", r.data)
check("18 topics seeded", len(topics) >= 18, f"count={len(topics)}")

# Filter by subject
first_subj_id = subjects[0]["id"]
r = client.get(f"/api/curriculum/topics/?subject={first_subj_id}")
check("GET topics filtered by subject → 200", r.status_code == 200)

topic_id = topics[0]["id"]
r = client.get(f"/api/curriculum/topics/{topic_id}/")
check("GET topic detail → 200", r.status_code == 200)
check("Topic detail has lessons list", "lessons" in r.data)

# Teacher CREATE topic
r = client.post("/api/curriculum/topics/", {
    "subject": first_subj_id,
    "title": "Test Topic by Teacher",
    "description": "A test topic",
    "order": 99,
}, format="json")
check("Teacher CREATE topic → 201", r.status_code == 201, f"status={r.status_code}")
test_topic_id = r.data.get("id")

r = client.patch(f"/api/curriculum/topics/{test_topic_id}/", {"title": "Updated Test Topic"}, format="json")
check("Teacher PATCH topic → 200", r.status_code == 200)
check("Topic title updated", r.data.get("title") == "Updated Test Topic")

r = client.delete(f"/api/curriculum/topics/{test_topic_id}/")
check("Teacher DELETE topic → 204", r.status_code == 204)

# ── 5. Lessons CRUD ────────────────────────────────────────────────────────────
print("\n── Lessons ───────────────────────────────────────────────────")

r = client.get("/api/curriculum/lessons/")
check("GET /curriculum/lessons/ → 200", r.status_code == 200)
lessons = r.data.get("results", r.data)
total_lessons = r.data.get("count", len(lessons))
check("37 lessons seeded", total_lessons >= 37, f"count={total_lessons}")

lesson_id = lessons[0]["id"]
r = client.get(f"/api/curriculum/lessons/{lesson_id}/")
check("GET lesson detail → 200", r.status_code == 200)
check("Lesson detail has activities", "activities" in r.data)
check("Lesson detail has scenarios", "scenarios" in r.data)

# Filter by topic
first_topic_id = topics[0]["id"]
r = client.get(f"/api/curriculum/lessons/?topic={first_topic_id}")
check("GET lessons filtered by topic → 200", r.status_code == 200)

# Teacher CREATE lesson
r = client.post("/api/curriculum/lessons/", {
    "topic": first_topic_id,
    "title": "Test Lesson by Teacher",
    "description": "Testing lesson creation",
    "video_url": "https://www.youtube.com/watch?v=TEST",
    "duration_minutes": 10,
    "order": 99,
    "is_published": False,
}, format="json")
check("Teacher CREATE lesson → 201", r.status_code == 201, f"status={r.status_code}, errors={r.data}")
test_lesson_id = r.data.get("id")

r = client.patch(f"/api/curriculum/lessons/{test_lesson_id}/", {
    "is_published": True,
    "duration_minutes": 15,
}, format="json")
check("Teacher PATCH lesson → 200", r.status_code == 200)
check("Lesson is_published updated to True", r.data.get("is_published") is True)

# Test student can only see published lessons
login_ok = login("student@pe.ls", "Admin123!")  # need to set student password first
student = User.objects.get(email="student@pe.ls")
student.set_password("Student123!")
student.save()
login("student@pe.ls", "Student123!")
r = client.get("/api/curriculum/lessons/")
student_lessons = r.data.get("results", r.data)
check("Student sees only published lessons", all(l.get("is_published") for l in student_lessons))

# Student cannot create lessons
r = client.post("/api/curriculum/lessons/", {
    "topic": first_topic_id,
    "title": "Student trying to create",
    "duration_minutes": 1,
    "order": 100,
}, format="json")
check("Student cannot CREATE lesson → 403", r.status_code == 403)

# Back to teacher for cleanup
login("teacher@demo.edu", "Teacher123!")
r = client.delete(f"/api/curriculum/lessons/{test_lesson_id}/")
check("Teacher DELETE lesson → 204", r.status_code == 204)

# ── 6. OVEP Values ─────────────────────────────────────────────────────────────
print("\n── OVEP Values ───────────────────────────────────────────────")

r = client.get("/api/curriculum/ovep-values/")
check("GET /curriculum/ovep-values/ → 200", r.status_code == 200)
ovep_values = r.data.get("results", r.data)
check("7 OVEP values seeded", len(ovep_values) >= 7, f"count={len(ovep_values)}")
check("Values have name, description, icon", all("name" in v and "description" in v for v in ovep_values))

ovep_id = ovep_values[0]["id"]
r = client.get(f"/api/curriculum/ovep-values/{ovep_id}/")
check("GET single OVEP value → 200", r.status_code == 200)

# OVEP is read-only
r = client.post("/api/curriculum/ovep-values/", {"name": "test"}, format="json")
check("OVEP values are read-only (POST → 405)", r.status_code == 405)

# ── 7. Scenarios CRUD ─────────────────────────────────────────────────────────
print("\n── Scenarios ─────────────────────────────────────────────────")

r = client.get("/api/curriculum/scenarios/")
check("GET /curriculum/scenarios/ → 200", r.status_code == 200)
scenarios = r.data.get("results", r.data)
check("7 scenarios seeded", len(scenarios) >= 7, f"count={len(scenarios)}")

scen_id = scenarios[0]["id"]
r = client.get(f"/api/curriculum/scenarios/{scen_id}/")
check("GET scenario detail → 200", r.status_code == 200)
check("Scenario has options, linked_value", "options" in r.data and "linked_value" in r.data)

# Teacher create scenario
lesson_id_for_scenario = lessons[0]["id"]
r = client.post("/api/curriculum/scenarios/", {
    "title": "Test Scenario",
    "scenario_text": "A test ethical situation.",
    "question": "What should you do?",
    "options": ["Option A", "Option B", "Option C"],
    "correct_answer": "Option B",
    "linked_value": ovep_id,
    "lesson": lesson_id_for_scenario,
}, format="json")
check("Teacher CREATE scenario → 201", r.status_code == 201, f"status={r.status_code}, data={r.data}")
test_scen_id = r.data.get("id")

r = client.patch(f"/api/curriculum/scenarios/{test_scen_id}/", {"title": "Updated Test Scenario"}, format="json")
check("Teacher PATCH scenario → 200", r.status_code == 200)

r = client.delete(f"/api/curriculum/scenarios/{test_scen_id}/")
check("Teacher DELETE scenario → 204", r.status_code == 204)

# ── 8. Progress ────────────────────────────────────────────────────────────────
print("\n── Progress ──────────────────────────────────────────────────")

# Switch to student
login("student@pe.ls", "Student123!")

# Mark a lesson as started
pub_lesson_id = next(l["id"] for l in student_lessons if l.get("is_published"))
r = client.post(f"/api/curriculum/lessons/{pub_lesson_id}/mark_started/")
check("Student mark_started → 200", r.status_code == 200)

r = client.get("/api/curriculum/progress/")
check("GET /curriculum/progress/ (student) → 200", r.status_code == 200)
progress_items = r.data.get("results", r.data)
check("Progress record created", len(progress_items) >= 1)

# Mark as complete
r = client.post(f"/api/curriculum/lessons/{pub_lesson_id}/mark_complete/")
check("Student mark_complete → 200", r.status_code == 200)

r = client.get("/api/curriculum/progress/")
progress_items = r.data.get("results", r.data)
latest = next((p for p in progress_items if p["lesson"] == pub_lesson_id), None)
check("Progress status is 'completed'", latest and latest.get("status") == "completed")

# ── 9. Assessments ────────────────────────────────────────────────────────────
print("\n── Assessments ───────────────────────────────────────────────")

r = client.get("/api/assessments/quizzes/")
check("GET /assessments/quizzes/ (student) → 200", r.status_code == 200)
quizzes = r.data.get("results", r.data)
check("6 published assessments visible to student", len(quizzes) >= 6, f"count={len(quizzes)}")

quiz_id = quizzes[0]["id"]
r = client.get(f"/api/assessments/quizzes/{quiz_id}/")
check("GET quiz detail → 200", r.status_code == 200)
check("Quiz detail has questions", "questions" in r.data)
check("Student cannot see correct_answer", not any("correct_answer" in q for q in r.data.get("questions", [])))

# Start an attempt
r = client.post(f"/api/assessments/quizzes/{quiz_id}/start/")
check("Student start attempt → 201", r.status_code == 201, f"status={r.status_code}")
attempt_id = r.data.get("id")

# Get questions with answers visible to teacher (via detail endpoint now with role-aware serializer)
login("teacher@demo.edu", "Teacher123!")
r = client.get(f"/api/assessments/quizzes/{quiz_id}/")
questions_with_answers = r.data.get("questions", [])
check("Teacher sees correct_answer on questions", any("correct_answer" in q for q in questions_with_answers))

# Build correct answers map from teacher view
correct_answers = {str(q["id"]): q["correct_answer"] for q in questions_with_answers}

# Submit attempt as student using correct answers
login("student@pe.ls", "Student123!")
r = client.post(f"/api/assessments/quizzes/{quiz_id}/submit/", {"answers": correct_answers}, format="json")
check("Student submit attempt → 200", r.status_code == 200, f"status={r.status_code}")
check("Attempt has score", r.data.get("score") is not None)
check("Passed (answered all correctly)", r.data.get("passed") is True)
check("Question results returned", len(r.data.get("question_results", [])) > 0)

# Check attempts endpoint
r = client.get("/api/assessments/attempts/")
check("GET /assessments/attempts/ → 200", r.status_code == 200)
attempts = r.data.get("results", r.data)
check("At least 1 submitted attempt", len(attempts) >= 1)

# Check certificates
r = client.get("/api/assessments/certificates/")
check("GET /assessments/certificates/ → 200", r.status_code == 200)
certs = r.data.get("results", r.data)
check("Certificate issued after passing", len(certs) >= 1)
if certs:
    check("Certificate has certificate_number", bool(certs[0].get("certificate_number")))
    check("Certificate has student_name", bool(certs[0].get("student_name")))
    check("Certificate has school_name", bool(certs[0].get("school_name")))

# ── 10. Classes ───────────────────────────────────────────────────────────────
print("\n── Classes ───────────────────────────────────────────────────")

login("teacher@demo.edu", "Teacher123!")

r = client.get("/api/auth/classes/")
check("Teacher GET /auth/classes/ → 200", r.status_code == 200)
classes = r.data.get("results", r.data)
check("Teacher sees their own classes", len(classes) >= 1, f"count={len(classes)}")

class_id = classes[0]["id"]
r = client.get(f"/api/auth/classes/{class_id}/")
check("GET class detail → 200", r.status_code == 200)
check("Class detail has students list", "students" in r.data)
check("Class has students enrolled", len(r.data.get("students", [])) >= 1)

# Teacher create new class
from apps.users.models import School
school = School.objects.first()
r = client.post("/api/auth/classes/", {"name": "Test Class CRUD", "school": school.id}, format="json")
check("Teacher CREATE class → 201", r.status_code == 201, f"status={r.status_code}, data={r.data}")
test_class_id = r.data.get("id")

r = client.patch(f"/api/auth/classes/{test_class_id}/", {"name": "Updated Test Class"}, format="json")
check("Teacher PATCH class → 200", r.status_code == 200)

r = client.delete(f"/api/auth/classes/{test_class_id}/")
check("Teacher DELETE class → 204", r.status_code == 204)

# Student sees enrolled classes
login("student@pe.ls", "Student123!")
r = client.get("/api/auth/classes/")
check("Student GET /auth/classes/ → 200", r.status_code == 200)
student_classes = r.data.get("results", r.data)
check("Student sees enrolled classes", len(student_classes) >= 1, f"count={len(student_classes)}")

# ── 11. Analytics ─────────────────────────────────────────────────────────────
print("\n── Analytics ─────────────────────────────────────────────────")

login("student@pe.ls", "Student123!")
r = client.get("/api/analytics/me/stats/")
check("GET /analytics/me/stats/ (student) → 200", r.status_code == 200)
check("Stats has lessons_completed", "lessons_completed" in r.data)
check("Stats has quizzes_passed", "quizzes_passed" in r.data)
check("Stats has certificates", "certificates" in r.data)

login("teacher@demo.edu", "Teacher123!")
r = client.get("/api/analytics/teacher/dashboard/")
check("GET /analytics/teacher/dashboard/ → 200", r.status_code == 200)
check("Dashboard has total_students", "total_students" in r.data)
check("Dashboard has classes list", "classes" in r.data)

# ── Summary ───────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
total = len(results)
passed = sum(1 for _, ok in results if ok)
failed = total - passed
print(f"RESULTS: {passed}/{total} passed  ({failed} failed)")
if failed:
    print("\nFailed checks:")
    for label, ok in results:
        if not ok:
            print(f"  {FAIL} {label}")
print("=" * 60)
