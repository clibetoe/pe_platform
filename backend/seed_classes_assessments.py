"""
Seed Classes, Assessments, and Questions.
"""
import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.users.models import User, School, Class
from apps.curriculum.models import Subject, Topic, Lesson
from apps.assessments.models import Assessment, Question

print("=" * 60)
print("Seeding Classes...")

maseru = School.objects.get(name="Maseru High School")
leribe = School.objects.get(name="Leribe Secondary School")

teacher = User.objects.get(email="teacher@demo.edu")
coach_maseru = User.objects.get(email="coach@demo.edu")
coach_leribe = User.objects.get(email="kat@school.edu")

students_maseru = list(User.objects.filter(school=maseru, role="student"))
students_leribe = list(User.objects.filter(school=leribe, role="student"))

print(f"  Maseru students: {[u.email for u in students_maseru]}")
print(f"  Leribe students: {[u.email for u in students_leribe]}")

CLASSES = [
    {
        "name": "Grade 10A - Athletics & Track",
        "teacher": teacher,
        "school": maseru,
        "students": students_maseru,
    },
    {
        "name": "Grade 11B - Team Sports",
        "teacher": coach_maseru,
        "school": maseru,
        "students": students_maseru,
    },
    {
        "name": "Leribe Sports Academy",
        "teacher": coach_leribe,
        "school": leribe,
        "students": students_leribe,
    },
]

classes_created = 0
for cd in CLASSES:
    klass, created = Class.objects.get_or_create(
        name=cd["name"],
        school=cd["school"],
        defaults={"teacher": cd["teacher"]},
    )
    if created:
        classes_created += 1
        for student in cd["students"]:
            klass.students.add(student)
        print(f"  Created class: {klass.name} ({len(cd['students'])} students)")
    else:
        print(f"  Exists:  class: {klass.name}")

print(f"\n  Total classes created: {classes_created}")

print("\nSeeding Assessments and Questions...")

subjects = {s.name: s for s in Subject.objects.all()}
lessons_by_subject = {}
for subject_name in subjects:
    lessons_by_subject[subject_name] = list(
        Lesson.objects.filter(topic__subject__name=subject_name, is_published=True)
    )

ASSESSMENTS = [
    {
        "subject": "Athletics",
        "title": "Athletics Fundamentals Quiz",
        "description": "Test your knowledge of sprinting technique, jumping, throwing, and race tactics.",
        "pass_score": 70,
        "time_limit_minutes": 20,
        "max_attempts": 3,
        "is_published": True,
        "questions": [
            {
                "question_text": "What is the correct arm angle during the drive phase of a sprint?",
                "question_type": "mcq",
                "options": ["45 degrees", "90 degrees", "120 degrees", "180 degrees (straight)"],
                "correct_answer": "90 degrees",
                "explanation": "Maintaining a 90-degree bend at the elbow maximises arm drive efficiency without wasting energy.",
                "points": 1,
                "order": 1,
            },
            {
                "question_text": "In the long jump, athletes convert horizontal speed into upward trajectory at the take-off board.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "True",
                "explanation": "The take-off phase converts the horizontal momentum of the approach run into both vertical and horizontal components.",
                "points": 1,
                "order": 2,
            },
            {
                "question_text": "Which starting position is most common for sprinters in the starting blocks?",
                "question_type": "mcq",
                "options": ["Bunch start", "Medium start", "Elongated start", "Track start"],
                "correct_answer": "Medium start",
                "explanation": "The medium start (back block at 3-foot lengths behind the line) is the most common and provides a good balance of power and extension.",
                "points": 1,
                "order": 3,
            },
            {
                "question_text": "What does 'negative splitting' mean in distance running?",
                "question_type": "mcq",
                "options": [
                    "Running the second half of the race faster than the first",
                    "Running the first half of the race faster than the second",
                    "Maintaining equal pace throughout",
                    "Starting fast then slowing down",
                ],
                "correct_answer": "Running the second half of the race faster than the first",
                "explanation": "Negative splitting means the second half is completed in less time than the first half — a sign of excellent pacing and fitness.",
                "points": 2,
                "order": 4,
            },
            {
                "question_text": "At what angle should the shot put be released for maximum distance?",
                "question_type": "mcq",
                "options": ["30-35 degrees", "38-42 degrees", "45 degrees", "50-55 degrees"],
                "correct_answer": "38-42 degrees",
                "explanation": "Due to the height of release and the weight of the shot, the optimal angle is slightly below 45 degrees, typically 38-42 degrees.",
                "points": 2,
                "order": 5,
            },
        ],
    },
    {
        "subject": "Swimming",
        "title": "Swimming Techniques and Safety Quiz",
        "description": "Test your knowledge of swimming strokes, water safety, and competitive swimming.",
        "pass_score": 70,
        "time_limit_minutes": 20,
        "max_attempts": 3,
        "is_published": True,
        "questions": [
            {
                "question_text": "What does SLAP stand for in pool safety?",
                "question_type": "mcq",
                "options": [
                    "Stop, Look, Act, Plan",
                    "Swim, Look, Alert, Prevent",
                    "Stop, Listen, Assess, Protect",
                    "Signal, Locate, Assist, Phone",
                ],
                "correct_answer": "Stop, Look, Act, Plan",
                "explanation": "SLAP is a water safety framework: Stop (don't rush in), Look (assess the situation), Act (get help or assist), Plan (follow rescue protocol).",
                "points": 1,
                "order": 1,
            },
            {
                "question_text": "In freestyle swimming, the correct technique is to lift your head completely out of the water to breathe.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "False",
                "explanation": "In freestyle, you rotate your head to the side — keeping one goggle in the water — to breathe. Lifting your head causes your hips to sink, increasing drag.",
                "points": 1,
                "order": 2,
            },
            {
                "question_text": "What is the correct number of dolphin kicks per arm cycle in butterfly?",
                "question_type": "mcq",
                "options": ["One kick per cycle", "Two kicks per cycle", "Three kicks per cycle", "Four kicks per cycle"],
                "correct_answer": "Two kicks per cycle",
                "explanation": "In butterfly, there are two dolphin kicks per arm cycle — one as the hands enter the water and one as they exit.",
                "points": 2,
                "order": 3,
            },
            {
                "question_text": "What is HELP in survival swimming?",
                "question_type": "mcq",
                "options": [
                    "Heat Escape Lessening Position",
                    "High Elevation Leg Position",
                    "Horizontal Emergency Leg Paddle",
                    "Head Elevation and Lung Protection",
                ],
                "correct_answer": "Heat Escape Lessening Position",
                "explanation": "The HELP position reduces heat loss by protecting the body's heat loss areas (armpits, groin, neck) while floating.",
                "points": 1,
                "order": 4,
            },
        ],
    },
    {
        "subject": "Team Sports",
        "title": "Team Sports Fundamentals Quiz",
        "description": "Test your understanding of teamwork, football, and basketball fundamentals.",
        "pass_score": 65,
        "time_limit_minutes": 25,
        "max_attempts": 3,
        "is_published": True,
        "questions": [
            {
                "question_text": "What does BEEF stand for in basketball shooting?",
                "question_type": "mcq",
                "options": [
                    "Balance, Eyes, Elbow, Follow-through",
                    "Body, Extend, Elbow, Feet",
                    "Bend, Eyes, Extend, Finish",
                    "Balance, Effort, Extension, Follow",
                ],
                "correct_answer": "Balance, Eyes, Elbow, Follow-through",
                "explanation": "BEEF is the fundamental shooting framework: Balance (stance), Eyes (on the target), Elbow (aligned under the ball), Follow-through (snap the wrist).",
                "points": 1,
                "order": 1,
            },
            {
                "question_text": "In football, the inside-foot push pass is used primarily for accuracy at short to medium range.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "True",
                "explanation": "The inside-foot pass uses the flat, large surface of the foot for precise, low passes — ideal for accurate short and medium range distribution.",
                "points": 1,
                "order": 2,
            },
            {
                "question_text": "Why is 'calling for the ball' important in team sports?",
                "question_type": "mcq",
                "options": [
                    "It is required by the rules",
                    "It helps the ball carrier know where to pass and reduces confusion",
                    "It distracts the opposing team",
                    "It helps the referee track possession",
                ],
                "correct_answer": "It helps the ball carrier know where to pass and reduces confusion",
                "explanation": "Verbal communication reduces uncertainty — the player with the ball can focus on execution rather than looking for teammates.",
                "points": 1,
                "order": 3,
            },
            {
                "question_text": "At what angle does the crossover dribble in basketball move the ball?",
                "question_type": "mcq",
                "options": [
                    "Behind the back from one hand to the other",
                    "In front of the body from one hand to the other",
                    "Between the legs alternating hands",
                    "Straight down and back up with one hand",
                ],
                "correct_answer": "In front of the body from one hand to the other",
                "explanation": "The crossover is a low, quick dribble in front of the body that switches the ball from one hand to the other to change direction.",
                "points": 1,
                "order": 4,
            },
            {
                "question_text": "What is the optimal release angle for a football shot when prioritising power over placement?",
                "question_type": "mcq",
                "options": ["The instep drive (laces)", "The inside of the foot", "The toe poke", "The outside of the foot"],
                "correct_answer": "The instep drive (laces)",
                "explanation": "The instep drive uses the laces — the hardest part of the boot — to generate maximum pace on goal.",
                "points": 2,
                "order": 5,
            },
        ],
    },
    {
        "subject": "Gymnastics",
        "title": "Gymnastics Fundamentals Quiz",
        "description": "Test your knowledge of gymnastics movements, safety, and flexibility.",
        "pass_score": 70,
        "time_limit_minutes": 20,
        "max_attempts": 3,
        "is_published": True,
        "questions": [
            {
                "question_text": "In a forward roll, where should the weight be distributed during the roll?",
                "question_type": "mcq",
                "options": [
                    "On the head and neck",
                    "On the upper back and shoulders",
                    "On the lower back",
                    "On the hands only",
                ],
                "correct_answer": "On the upper back and shoulders",
                "explanation": "The chin stays tucked and weight travels over the rounded upper back — never on the head or neck to prevent injury.",
                "points": 1,
                "order": 1,
            },
            {
                "question_text": "In a handstand, the correct body alignment is ankles, hips, and shoulders in a straight line.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "True",
                "explanation": "A perfect handstand has all segments stacked: wrists under shoulders, hips over shoulders, and ankles over hips in one straight line.",
                "points": 1,
                "order": 2,
            },
            {
                "question_text": "What type of stretching is most beneficial BEFORE gymnastics training?",
                "question_type": "mcq",
                "options": ["Static stretching", "PNF stretching", "Dynamic stretching", "Passive stretching"],
                "correct_answer": "Dynamic stretching",
                "explanation": "Dynamic stretches (leg swings, arm circles) increase core temperature and range of motion without reducing muscle activation — ideal before training.",
                "points": 2,
                "order": 3,
            },
            {
                "question_text": "The roundoff adds a blocking phase that converts forward momentum into what type of momentum?",
                "question_type": "mcq",
                "options": ["Horizontal", "Rotational", "Vertical", "Diagonal"],
                "correct_answer": "Vertical",
                "explanation": "The roundoff's blocking phase converts forward (horizontal) momentum into upward (vertical) momentum, which is what makes back handsprings possible.",
                "points": 2,
                "order": 4,
            },
        ],
    },
    {
        "subject": "Sports Science",
        "title": "Sports Science Fundamentals Quiz",
        "description": "Test your knowledge of exercise physiology, nutrition, and recovery.",
        "pass_score": 70,
        "time_limit_minutes": 30,
        "max_attempts": 3,
        "is_published": True,
        "questions": [
            {
                "question_text": "Which muscle fibre type is best suited for explosive power and sprinting?",
                "question_type": "mcq",
                "options": ["Type I (slow-twitch)", "Type IIa (fast-twitch oxidative)", "Type IIb/IIx (fast-twitch glycolytic)", "All fibre types equally"],
                "correct_answer": "Type IIb/IIx (fast-twitch glycolytic)",
                "explanation": "Type IIb/IIx fibres contract very quickly and powerfully but fatigue fast — ideal for sprinting and explosive efforts.",
                "points": 2,
                "order": 1,
            },
            {
                "question_text": "Losing 2% of body weight through sweat reduces athletic performance by approximately 10-20%.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "True",
                "explanation": "Even mild dehydration significantly impairs physical and cognitive performance, making hydration a critical performance factor.",
                "points": 1,
                "order": 2,
            },
            {
                "question_text": "What does RICE stand for in sports injury first aid?",
                "question_type": "mcq",
                "options": [
                    "Rest, Ice, Compression, Elevation",
                    "Run, Ice, Cool, Elevate",
                    "Rest, Inflammation, Control, Exercise",
                    "Recover, Ice, Circulation, Exercise",
                ],
                "correct_answer": "Rest, Ice, Compression, Elevation",
                "explanation": "RICE is the standard first-aid protocol for soft-tissue injuries: Rest the injury, apply Ice, use Compression bandage, and Elevate the limb.",
                "points": 1,
                "order": 3,
            },
            {
                "question_text": "Which macronutrient is the PRIMARY fuel source for high-intensity sport?",
                "question_type": "mcq",
                "options": ["Protein", "Fat", "Carbohydrates", "Vitamins"],
                "correct_answer": "Carbohydrates",
                "explanation": "Carbohydrates are converted to glycogen and stored in muscles and the liver — the primary and fastest fuel source during high-intensity exercise.",
                "points": 1,
                "order": 4,
            },
            {
                "question_text": "Dynamic stretching should be performed AFTER training, while static stretching is best BEFORE training.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "False",
                "explanation": "Dynamic stretching is best before training (warms up muscles). Static stretching is best after training (improves flexibility when muscles are warm).",
                "points": 2,
                "order": 5,
            },
        ],
    },
    {
        "subject": "Olympic Values",
        "title": "Olympic Values and History Quiz",
        "description": "Test your knowledge of Olympic history, OVEP values, and the legacy of the Games.",
        "pass_score": 65,
        "time_limit_minutes": 25,
        "max_attempts": 3,
        "is_published": True,
        "questions": [
            {
                "question_text": "In what year were the first modern Olympic Games held, and in which city?",
                "question_type": "mcq",
                "options": ["1892 in Paris", "1896 in Athens", "1900 in London", "1904 in St. Louis"],
                "correct_answer": "1896 in Athens",
                "explanation": "The first modern Olympic Games were held in Athens, Greece in 1896, revived by Baron Pierre de Coubertin.",
                "points": 1,
                "order": 1,
            },
            {
                "question_text": "Olympic Excellence means only winning gold medals and breaking world records.",
                "question_type": "true_false",
                "options": ["True", "False"],
                "correct_answer": "False",
                "explanation": "Olympic Excellence is about giving your personal best — in sport and in life — regardless of the outcome or ranking.",
                "points": 1,
                "order": 2,
            },
            {
                "question_text": "Who won the marathon barefoot at the 1960 Rome Olympics?",
                "question_type": "mcq",
                "options": ["Kipchoge Keino", "Abebe Bikila", "Haile Gebrselassie", "Noureddine Morceli"],
                "correct_answer": "Abebe Bikila",
                "explanation": "Ethiopian Abebe Bikila won the 1960 Rome Olympic marathon barefoot, becoming the first Black African Olympic gold medallist.",
                "points": 1,
                "order": 3,
            },
            {
                "question_text": "What was the Olympic Truce (Ekecheiria) in the ancient Games?",
                "question_type": "mcq",
                "options": [
                    "A rule that athletes must train for one year before competing",
                    "A sacred agreement that halted wars so athletes could travel safely to Olympia",
                    "A contract that all athletes had to sign before competing",
                    "A ceremony to honour the god Zeus before each event",
                ],
                "correct_answer": "A sacred agreement that halted wars so athletes could travel safely to Olympia",
                "explanation": "The Ekecheiria was a sacred truce that suspended all hostilities during the Olympic festival, allowing safe passage for athletes and spectators.",
                "points": 2,
                "order": 4,
            },
            {
                "question_text": "Which UN framework recognises sport as a tool for achieving Sustainable Development Goals?",
                "question_type": "mcq",
                "options": [
                    "The Olympic Charter",
                    "UN Resolution 70/1 — Agenda 2030",
                    "UNESCO Convention on Sport",
                    "IOC Agenda 2020",
                ],
                "correct_answer": "UN Resolution 70/1 — Agenda 2030",
                "explanation": "The UN Sustainable Development Goals (Agenda 2030) explicitly recognise sport's contribution to development, peace, health, and education.",
                "points": 2,
                "order": 5,
            },
        ],
    },
]

assessments_created = 0
questions_created = 0

for ad in ASSESSMENTS:
    lessons = lessons_by_subject.get(ad["subject"], [])
    lesson = lessons[0] if lessons else None

    assessment, a_created = Assessment.objects.get_or_create(
        title=ad["title"],
        defaults={
            "lesson": lesson,
            "description": ad["description"],
            "pass_score": ad["pass_score"],
            "time_limit_minutes": ad["time_limit_minutes"],
            "max_attempts": ad["max_attempts"],
            "is_published": ad["is_published"],
        },
    )
    if a_created:
        assessments_created += 1
        for qd in ad["questions"]:
            Question.objects.create(
                assessment=assessment,
                question_text=qd["question_text"],
                question_type=qd["question_type"],
                options=qd["options"],
                correct_answer=qd["correct_answer"],
                explanation=qd["explanation"],
                points=qd["points"],
                order=qd["order"],
            )
            questions_created += 1
        print(f"  Created assessment: {assessment.title} ({len(ad['questions'])} questions)")
    else:
        print(f"  Exists:  assessment: {assessment.title}")

print(f"\n  Assessments created: {assessments_created}, Questions created: {questions_created}")

print("\nFinal counts:")
from apps.assessments.models import Assessment, Question
print(f"  Classes:     {Class.objects.count()}")
print(f"  Assessments: {Assessment.objects.count()}")
print(f"  Questions:   {Question.objects.count()}")
print("\nDone! Classes and Assessments seeded successfully.")
