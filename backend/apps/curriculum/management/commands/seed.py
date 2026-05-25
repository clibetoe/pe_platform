from django.core.management.base import BaseCommand
from apps.users.models import User, School, Class
from apps.curriculum.models import Subject, Topic, Lesson, Activity, OVEPValue, Scenario
from apps.assessments.models import Assessment, Question


class Command(BaseCommand):
    help = "Seed the database with demo data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        school, _ = School.objects.get_or_create(
            name="Lesotho High School",
            defaults={"location": "Maseru, Lesotho"},
        )

        superadmin, _ = User.objects.get_or_create(
            email="admin@pe-platform.edu",
            defaults={
                "first_name": "Super", "last_name": "Admin",
                "role": User.SUPER_ADMIN, "is_staff": True, "is_superuser": True,
                "school": school,
            },
        )
        superadmin.set_password("admin1234")
        superadmin.save()

        teacher, _ = User.objects.get_or_create(
            email="teacher@pe-platform.edu",
            defaults={
                "first_name": "Nthabiseng", "last_name": "Molefe",
                "role": User.TEACHER, "school": school,
            },
        )
        teacher.set_password("teacher1234")
        teacher.save()

        student, _ = User.objects.get_or_create(
            email="student@pe-platform.edu",
            defaults={
                "first_name": "Thabo", "last_name": "Mokoena",
                "role": User.STUDENT, "school": school,
            },
        )
        student.set_password("student1234")
        student.save()

        klass, _ = Class.objects.get_or_create(
            name="Grade 10 PE", teacher=teacher, school=school,
        )
        klass.students.add(student)

        for name, desc in [
            ("Excellence", "Striving to be the best you can be in sport and life."),
            ("Respect", "Showing fair play, respect for others and for the rules."),
            ("Friendship", "Building connections through the spirit of sport."),
            ("Fair Play", "Playing by the rules with honesty and integrity."),
            ("Inclusion", "Welcoming everyone regardless of background."),
        ]:
            OVEPValue.objects.get_or_create(name=name.lower().replace(" ", "_"), defaults={"description": desc})

        pe_subject, _ = Subject.objects.get_or_create(
            name="Physical Education",
            defaults={"description": "Core PE curriculum for secondary schools."},
        )

        ovep_subject, _ = Subject.objects.get_or_create(
            name="Olympic Values Education",
            defaults={"description": "Learn the values of the Olympic movement."},
        )

        basketball_topic, _ = Topic.objects.get_or_create(
            subject=pe_subject, title="Basketball",
            defaults={"description": "Fundamental basketball skills and tactics.", "order": 1},
        )

        fitness_topic, _ = Topic.objects.get_or_create(
            subject=pe_subject, title="Health & Fitness",
            defaults={"description": "Physical fitness principles and exercises.", "order": 2},
        )

        ovep_topic, _ = Topic.objects.get_or_create(
            subject=ovep_subject, title="Core Values",
            defaults={"description": "Excellence, Respect, and Friendship.", "order": 1},
        )

        lesson1, _ = Lesson.objects.get_or_create(
            topic=basketball_topic, title="Dribbling Skills",
            defaults={
                "description": "Master the fundamentals of basketball dribbling.",
                "content": "Dribbling is the act of bouncing the ball continuously while moving...\n\nKey techniques:\n• Keep your eyes up\n• Use your fingertips, not your palm\n• Stay low with bent knees\n• Protect the ball with your body",
                "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "duration_minutes": 20,
                "order": 1,
                "is_published": True,
            },
        )

        Activity.objects.get_or_create(
            lesson=lesson1, title="Watch: Dribbling Demonstration",
            defaults={"activity_type": "watch", "order": 1,
                      "description": "Watch the video above and observe proper dribbling form."},
        )
        Activity.objects.get_or_create(
            lesson=lesson1, title="Practice: 5-Minute Dribble Drill",
            defaults={"activity_type": "practice", "order": 2,
                      "content": "Stand in place and dribble for 2 minutes with dominant hand, then 2 minutes with non-dominant hand. Then 1 minute alternating."},
        )

        lesson2, _ = Lesson.objects.get_or_create(
            topic=fitness_topic, title="Warm-Up & Stretching",
            defaults={
                "description": "Proper warm-up routines to prevent injury.",
                "content": "A proper warm-up prepares your body for exercise by increasing heart rate and blood flow to muscles.\n\n5-Minute Warm-Up:\n1. Light jogging in place (1 min)\n2. Arm circles (30 sec each direction)\n3. Leg swings (30 sec each leg)\n4. High knees (1 min)\n5. Jumping jacks (1 min)",
                "duration_minutes": 15,
                "order": 1,
                "is_published": True,
            },
        )

        Activity.objects.get_or_create(
            lesson=lesson2, title="Read: Why Warm-Up Matters",
            defaults={"activity_type": "read", "order": 1,
                      "content": "Warming up increases muscle temperature, improves flexibility, and reduces the risk of injury. Never skip your warm-up!"},
        )
        Activity.objects.get_or_create(
            lesson=lesson2, title="Practice: Full Warm-Up Routine",
            defaults={"activity_type": "practice", "order": 2,
                      "description": "Follow the 5-minute warm-up routine described in the lesson content."},
        )

        lesson3, _ = Lesson.objects.get_or_create(
            topic=ovep_topic, title="What is Excellence?",
            defaults={
                "description": "Understanding the Olympic value of Excellence.",
                "content": "Excellence in the Olympic context means giving your best — not just in sport, but in life. It means:\n\n• Always trying your hardest\n• Learning from mistakes\n• Setting personal goals\n• Celebrating effort as well as results",
                "duration_minutes": 25,
                "order": 1,
                "is_published": True,
            },
        )

        fair_play, _ = OVEPValue.objects.get_or_create(name="fair_play", defaults={"description": "Fair play."})
        Scenario.objects.get_or_create(
            title="Fair Play in Competition",
            defaults={
                "scenario_text": "During a relay race, a student drops the baton but picks it up and keeps running. The opposing team argues the student should be disqualified.",
                "question": "What is the fair and correct response?",
                "options": ["Disqualify the runner immediately", "Check the rules and decide fairly", "Give the win to the opposing team", "Ignore the situation"],
                "correct_answer": "Check the rules and decide fairly",
                "linked_value": fair_play,
                "lesson": lesson3,
            },
        )

        quiz1, _ = Assessment.objects.get_or_create(
            title="Basketball Basics Quiz",
            defaults={
                "lesson": lesson1,
                "description": "Test your knowledge of basketball dribbling skills.",
                "pass_score": 70,
                "time_limit_minutes": 10,
                "is_published": True,
            },
        )

        questions = [
            {
                "question_text": "Which part of the hand should you use when dribbling a basketball?",
                "question_type": "mcq",
                "options": ["The palm", "The fingertips", "The back of the hand", "The wrist"],
                "correct_answer": "The fingertips",
                "explanation": "Using your fingertips gives you better control and feel for the ball.",
                "points": 1, "order": 1,
            },
            {
                "question_text": "When dribbling, you should keep your eyes focused on the ball.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "False",
                "explanation": "Keep your eyes up so you can see the court and your teammates.",
                "points": 1, "order": 2,
            },
            {
                "question_text": "What body position helps you protect the ball while dribbling?",
                "question_type": "mcq",
                "options": ["Standing upright", "Jumping", "Staying low with bent knees", "Leaning backward"],
                "correct_answer": "Staying low with bent knees",
                "explanation": "A low centre of gravity improves balance and ball protection.",
                "points": 1, "order": 3,
            },
            {
                "question_text": "How many steps can a player take without dribbling before committing a violation?",
                "question_type": "mcq",
                "options": ["1", "2", "3", "4"],
                "correct_answer": "2",
                "explanation": "Taking more than 2 steps without dribbling is called travelling.",
                "points": 1, "order": 4,
            },
            {
                "question_text": "Dribbling with your non-dominant hand is important for becoming a complete player.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "True",
                "explanation": "Being able to dribble with both hands makes you unpredictable and harder to defend.",
                "points": 1, "order": 5,
            },
        ]

        for q in questions:
            Question.objects.get_or_create(
                assessment=quiz1,
                order=q["order"],
                defaults={k: v for k, v in q.items() if k != "order"},
            )

        quiz2, _ = Assessment.objects.get_or_create(
            title="Olympic Values Quiz",
            defaults={
                "lesson": lesson3,
                "description": "Demonstrate your understanding of Olympic values.",
                "pass_score": 60,
                "is_published": True,
            },
        )

        values_questions = [
            {
                "question_text": "Which of the following is NOT a core Olympic value?",
                "question_type": "mcq",
                "options": ["Excellence", "Respect", "Friendship", "Competition"],
                "correct_answer": "Competition",
                "explanation": "The three core Olympic values are Excellence, Respect, and Friendship.",
                "points": 1, "order": 1,
            },
            {
                "question_text": "Excellence means only winning gold medals.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "False",
                "explanation": "Excellence means giving your best effort, regardless of the result.",
                "points": 1, "order": 2,
            },
            {
                "question_text": "Which value is best demonstrated when a player helps an injured opponent?",
                "question_type": "mcq",
                "options": ["Competition", "Winning", "Respect", "Isolation"],
                "correct_answer": "Respect",
                "explanation": "Helping an injured opponent shows respect for other athletes.",
                "points": 1, "order": 3,
            },
        ]

        for q in values_questions:
            Question.objects.get_or_create(
                assessment=quiz2,
                order=q["order"],
                defaults={k: v for k, v in q.items() if k != "order"},
            )

        self.stdout.write(self.style.SUCCESS(
            "\nSeed complete!\n\n"
            "Demo accounts:\n"
            "  Super Admin : admin@pe-platform.edu   / admin1234\n"
            "  Teacher     : teacher@pe-platform.edu / teacher1234\n"
            "  Student     : student@pe-platform.edu / student1234\n"
        ))
