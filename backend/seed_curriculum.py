"""
Comprehensive curriculum seed script.
Run: python manage.py shell < seed_curriculum.py
"""
import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.curriculum.models import Subject, Topic, Lesson, Activity, OVEPValue, Scenario
from apps.assessments.models import Assessment, Question

print("=" * 60)
print("Seeding OVEP Values...")

OVEP_DATA = [
    ("excellence",  "Excellence",  "Striving to be the best you can be — in sport and in life.", "⭐"),
    ("respect",     "Respect",     "Showing regard for yourself, others, and the rules of sport.", "🤝"),
    ("friendship",  "Friendship",  "Building positive relationships through sport.", "💛"),
    ("inclusion",   "Inclusion",   "Welcoming everyone regardless of background or ability.", "🌍"),
    ("fair_play",   "Fair Play",   "Playing by the rules, being honest and respecting decisions.", "⚖️"),
    ("leadership",  "Leadership",  "Inspiring and guiding others toward shared goals.", "🏆"),
    ("diversity",   "Diversity",   "Celebrating differences and the richness they bring to sport.", "🎨"),
]

values_map = {}
for name, display, desc, icon in OVEP_DATA:
    v, created = OVEPValue.objects.get_or_create(name=name, defaults={"description": desc, "icon": icon})
    values_map[name] = v
    print(f"  {'Created' if created else 'Exists':8} OVEPValue: {display}")

print("\nSeeding Subjects...")

SUBJECTS = [
    ("Athletics",      "Track and field disciplines including sprinting, distance running, jumping, and throwing.", "🏃"),
    ("Swimming",       "Aquatic sports covering competitive swimming strokes, water safety, and pool events.", "🏊"),
    ("Team Sports",    "Collaborative sports such as football, basketball, volleyball, and netball.", "⚽"),
    ("Gymnastics",     "Artistic and rhythmic gymnastics focusing on strength, balance, and flexibility.", "🤸"),
    ("Sports Science", "The science behind athletic performance — anatomy, nutrition, and recovery.", "🔬"),
    ("Olympic Values", "History and values of the Olympic movement — Excellence, Respect, and Friendship.", "🏅"),
]

subjects_map = {}
for name, desc, icon in SUBJECTS:
    s, created = Subject.objects.get_or_create(name=name, defaults={"description": desc, "icon": icon})
    subjects_map[name] = s
    print(f"  {'Created' if created else 'Exists':8} Subject: {name}")

print("\nSeeding Topics, Lessons, and Activities...")

CURRICULUM = {
    "Athletics": [
        {
            "title": "Running Fundamentals",
            "description": "The biomechanics of sprinting, stride technique, and starting blocks.",
            "order": 1,
            "lessons": [
                {
                    "title": "Sprinting Technique and Form",
                    "description": "Master correct body position, arm drive, and foot strike for sprinting.",
                    "content": "Sprinting is not just about speed — it's about efficiency. A good sprinter maintains an upright torso, drives their arms in a 90-degree bend, and strikes the ground with the ball of the foot beneath their centre of mass. This lesson covers the science of stride mechanics and how small adjustments dramatically improve performance.",
                    "video_url": "https://www.youtube.com/watch?v=SPRINTING_001",
                    "duration_minutes": 12,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Starting Blocks and Race Starts",
                    "description": "Proper block setup, the set position, and explosive drive phase.",
                    "content": "The first 30 metres of a 100m race are won or lost in the start. Learn how to set block spacing for your body, achieve the optimal hip angle in the 'set' position, and generate maximum force in the drive phase.",
                    "video_url": "https://www.youtube.com/watch?v=SPRINTING_002",
                    "duration_minutes": 10,
                    "order": 2,
                    "is_published": True,
                },
                {
                    "title": "Endurance Running and Pacing",
                    "description": "Strategies for 800m, 1500m, and cross-country events.",
                    "content": "Distance running requires disciplined pacing, aerobic efficiency, and mental resilience. This lesson introduces lactate threshold training, negative splits strategy, and how to conserve energy for a strong finishing kick.",
                    "video_url": "https://www.youtube.com/watch?v=RUNNING_003",
                    "duration_minutes": 15,
                    "order": 3,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Jumping and Throwing",
            "description": "Technical fundamentals of long jump, high jump, shot put, and javelin.",
            "order": 2,
            "lessons": [
                {
                    "title": "Long Jump Approach and Take-Off",
                    "description": "Building approach run speed and converting it into vertical lift.",
                    "content": "The long jump combines a sprint with a precise take-off. Athletes must hit the take-off board at near-maximum velocity, then convert horizontal momentum into an upward trajectory. Learn the Hitchkick and hang techniques for maximising distance.",
                    "video_url": "https://www.youtube.com/watch?v=LONGJUMP_001",
                    "duration_minutes": 14,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Shot Put Technique",
                    "description": "Glide and rotational throwing techniques for maximum distance.",
                    "content": "Shot put power comes from the legs, hips, and core — not just the arm. This lesson teaches the O'Brien glide technique: starting with your back to the sector, generating rotational power through a low squat position, and releasing at the optimal 38-42 degree angle.",
                    "video_url": "https://www.youtube.com/watch?v=SHOTPUT_001",
                    "duration_minutes": 11,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Race Strategy and Mental Performance",
            "description": "Tactics, competition psychology, and performance mindset.",
            "order": 3,
            "lessons": [
                {
                    "title": "Race Tactics for Track Events",
                    "description": "When to lead, when to sit-and-kick, and how to read your competitors.",
                    "content": "Elite track athletes don't just run — they race. This lesson covers front-running vs sit-and-kick strategies, how to respond to surges, lane assignment advantages, and using relay baton zones effectively.",
                    "video_url": "https://www.youtube.com/watch?v=STRATEGY_001",
                    "duration_minutes": 13,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Mental Preparation and Visualisation",
                    "description": "Building confidence, managing competition anxiety, and using visualisation.",
                    "content": "Pre-race nerves are normal — elite athletes use them as fuel. Learn the 3-2-1 breathing technique, progressive muscle relaxation, and guided visualisation exercises that Olympic athletes use to prime their performance.",
                    "video_url": "https://www.youtube.com/watch?v=MENTAL_001",
                    "duration_minutes": 16,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
    ],
    "Swimming": [
        {
            "title": "Water Safety",
            "description": "Essential safety rules, drowning prevention, and emergency response.",
            "order": 1,
            "lessons": [
                {
                    "title": "Pool Safety Rules and Awareness",
                    "description": "Rules every swimmer must know before entering the water.",
                    "content": "Drowning is preventable. Every swimmer needs to understand pool rules, recognise dangerous situations, and know how to call for help. This lesson covers SLAP (Stop, Look, Act, Plan) principles and the roles of lifeguards.",
                    "video_url": "https://www.youtube.com/watch?v=SAFETY_001",
                    "duration_minutes": 10,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Basic Survival Swimming",
                    "description": "Floating, treading water, and self-rescue techniques.",
                    "content": "Survival swimming is the foundation of all aquatic activity. Learn the HELP (Heat Escape Lessening Position) technique, survival backstroke for long distances, and how to assist a swimmer in distress from the side of the pool.",
                    "video_url": "https://www.youtube.com/watch?v=SAFETY_002",
                    "duration_minutes": 14,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Stroke Techniques",
            "description": "Biomechanics and drill progressions for all four competitive strokes.",
            "order": 2,
            "lessons": [
                {
                    "title": "Freestyle (Front Crawl) Technique",
                    "description": "Body position, catch, pull, kick, and bilateral breathing.",
                    "content": "Freestyle is the fastest stroke. Key technical points: high elbow catch, early vertical forearm, continuous flutter kick, and rotating to breathe without lifting your head. This lesson breaks down each phase with drill progressions.",
                    "video_url": "https://www.youtube.com/watch?v=SWIM_001",
                    "duration_minutes": 18,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Breaststroke Technique",
                    "description": "The whip kick, simultaneous pull, and glide phase.",
                    "content": "Breaststroke is the slowest but most energy-efficient stroke. The secret is the glide — many beginners rush the cycle and lose momentum. Learn the correct pull-out, the frog/whip kick sequence, and how to streamline during the glide.",
                    "video_url": "https://www.youtube.com/watch?v=SWIM_002",
                    "duration_minutes": 16,
                    "order": 2,
                    "is_published": True,
                },
                {
                    "title": "Butterfly Stroke Technique",
                    "description": "Dolphin kick, simultaneous arm pull, and breathing rhythm.",
                    "content": "Butterfly is technically demanding but spectacular. The double-dolphin kick drives the body in an undulating wave motion. Learn the two-kicks-per-arm-cycle rhythm, the keyhole pull pattern, and breathing every second stroke for efficiency.",
                    "video_url": "https://www.youtube.com/watch?v=SWIM_003",
                    "duration_minutes": 20,
                    "order": 3,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Competitive Swimming",
            "description": "Race starts, turns, relay exchanges, and competition preparation.",
            "order": 3,
            "lessons": [
                {
                    "title": "Racing Starts and Turns",
                    "description": "Track start vs grab start, flip turns, and open turns.",
                    "content": "Races can be won on the start and at the wall. Learn the track start position for freestyle, the grab start for breaststroke, the tumble turn technique for freestyle/backstroke, and open turns for butterfly/breaststroke.",
                    "video_url": "https://www.youtube.com/watch?v=SWIM_RACE_001",
                    "duration_minutes": 15,
                    "order": 1,
                    "is_published": True,
                },
            ],
        },
    ],
    "Team Sports": [
        {
            "title": "Team Building and Communication",
            "description": "Leadership, communication on the field, and cohesion under pressure.",
            "order": 1,
            "lessons": [
                {
                    "title": "Communication on the Field",
                    "description": "Verbal cues, hand signals, and building team vocabulary.",
                    "content": "Teams that communicate win more. This lesson covers the power of simple verbal cues (calling for the ball, defensive warnings), reading non-verbal signals, and how to build a shared team vocabulary during training so it becomes instinct in matches.",
                    "video_url": "https://www.youtube.com/watch?v=TEAM_001",
                    "duration_minutes": 12,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Roles and Responsibilities in Team Sports",
                    "description": "Understanding positional roles and how individual accountability builds team strength.",
                    "content": "Every position on a team has specific responsibilities. Understanding your role — and trusting your teammates in theirs — is the foundation of team success. We explore how role clarity reduces conflict and increases collective performance.",
                    "video_url": "https://www.youtube.com/watch?v=TEAM_002",
                    "duration_minutes": 10,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Football Fundamentals",
            "description": "Passing, dribbling, shooting, and tactical positioning in football.",
            "order": 2,
            "lessons": [
                {
                    "title": "Passing and First Touch",
                    "description": "Inside-foot pass, chest trap, and controlling ground passes.",
                    "content": "The most fundamental skills in football are passing and receiving. A clean first touch opens space; a poor one gives possession away. This lesson covers the inside-foot push pass, controlling balls on the ground and in the air, and weight of pass for different situations.",
                    "video_url": "https://www.youtube.com/watch?v=FOOTBALL_001",
                    "duration_minutes": 14,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Shooting Technique and Placement",
                    "description": "Instep drive, placement shot, and reading the goalkeeper.",
                    "content": "Goals win games. Learn the instep power drive for long-range efforts, the placement side-foot shot for accuracy, and how to read a goalkeeper's positioning to choose the correct corner. Includes penalty kick fundamentals.",
                    "video_url": "https://www.youtube.com/watch?v=FOOTBALL_002",
                    "duration_minutes": 13,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Basketball Basics",
            "description": "Dribbling, shooting, defence, and game rules.",
            "order": 3,
            "lessons": [
                {
                    "title": "Dribbling and Ball Handling",
                    "description": "Crossover, between-the-legs, and protective dribbling.",
                    "content": "Ball control is the gateway to everything in basketball. Start with basic stationary dribbling at waist height, progress to the crossover dribble, and develop the behind-the-back dribble for open-court situations. The key: always keep your eyes up.",
                    "video_url": "https://www.youtube.com/watch?v=BASKETBALL_001",
                    "duration_minutes": 11,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Shooting Form and Free Throws",
                    "description": "BEEF technique, catch-and-shoot, and free throw routine.",
                    "content": "BEEF — Balance, Eyes, Elbow, Follow-through. This four-point framework teaches correct shooting mechanics. We cover the triple-threat position, the one-two step footwork for lay-ups, and building a consistent free throw pre-shot routine.",
                    "video_url": "https://www.youtube.com/watch?v=BASKETBALL_002",
                    "duration_minutes": 13,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
    ],
    "Gymnastics": [
        {
            "title": "Basic Gymnastics Movements",
            "description": "Foundation skills: rolls, cartwheels, handstands, and bridges.",
            "order": 1,
            "lessons": [
                {
                    "title": "Forward Roll and Backward Roll",
                    "description": "Safe tucked rolls, correct head placement, and progressions.",
                    "content": "Rolls are the foundation of gymnastics safety and movement. A good forward roll keeps the chin tucked, distributes weight across the upper back, and finishes in a controlled stand. Backward rolls require a push through the hands overhead to protect the neck.",
                    "video_url": "https://www.youtube.com/watch?v=GYM_001",
                    "duration_minutes": 10,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Cartwheel and Roundoff",
                    "description": "Hand placement, kicking sequence, and body alignment for lateral rotations.",
                    "content": "Cartwheels teach lateral inversion — placing your hands and feet on the same line while maintaining a straight body. The roundoff adds a blocking phase that converts forward momentum into vertical, making it the gateway to back handsprings.",
                    "video_url": "https://www.youtube.com/watch?v=GYM_002",
                    "duration_minutes": 12,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Balance and Flexibility",
            "description": "Core stability, static holds, and progressive flexibility training.",
            "order": 2,
            "lessons": [
                {
                    "title": "Handstand Progressions",
                    "description": "Kick-up, wall handstand, and free-standing balance.",
                    "content": "The handstand is the cornerstone of gymnastics strength and body awareness. Start with wall-supported holds focusing on a straight line through ankles, hips, and shoulders. Progress to kick-ups against the wall, then to free-standing holds using fingertip pressure to micro-adjust balance.",
                    "video_url": "https://www.youtube.com/watch?v=GYM_003",
                    "duration_minutes": 15,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Splits and Oversplits",
                    "description": "Front split, middle split, and safe progressive stretching.",
                    "content": "Flexibility gains require consistent, progressive work. This lesson introduces PNF (Proprioceptive Neuromuscular Facilitation) stretching for hamstrings and hip flexors, active vs passive flexibility distinctions, and a 10-minute daily routine to achieve front and middle splits.",
                    "video_url": "https://www.youtube.com/watch?v=GYM_004",
                    "duration_minutes": 14,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Gymnastics Safety",
            "description": "Spotting techniques, equipment checks, and safe training environments.",
            "order": 3,
            "lessons": [
                {
                    "title": "Spotting and Matting Techniques",
                    "description": "How coaches spot safely, mat placement, and self-rescue falls.",
                    "content": "Spotting is a skill that protects gymnasts from injury during skill development. This lesson covers hand placement for cartwheel and back walkover spotting, proper matting configurations for each skill level, and teaching gymnasts how to bail safely when a skill goes wrong.",
                    "video_url": "https://www.youtube.com/watch?v=GYM_SAFE_001",
                    "duration_minutes": 11,
                    "order": 1,
                    "is_published": True,
                },
            ],
        },
    ],
    "Sports Science": [
        {
            "title": "Human Body and Exercise",
            "description": "Anatomy, physiology, and how the body responds to training.",
            "order": 1,
            "lessons": [
                {
                    "title": "Muscles and Movement",
                    "description": "Major muscle groups, agonist/antagonist pairs, and how muscles contract.",
                    "content": "Understanding which muscles power which movements transforms your training. This lesson covers the major muscle groups (quadriceps, hamstrings, glutes, core, upper body) and explains muscle fibre types — Type I slow-twitch for endurance, Type IIa and IIb fast-twitch for power and speed.",
                    "video_url": "https://www.youtube.com/watch?v=SCI_001",
                    "duration_minutes": 17,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "The Cardiovascular System in Sport",
                    "description": "Heart rate, cardiac output, and how aerobic training changes your heart.",
                    "content": "Your heart is the engine of your athletic performance. Learn how stroke volume and heart rate combine to determine cardiac output, how VO2 max is measured, and why trained athletes have resting heart rates of 40-50 bpm. Includes a practical guide to target heart rate training zones.",
                    "video_url": "https://www.youtube.com/watch?v=SCI_002",
                    "duration_minutes": 19,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Nutrition for Athletes",
            "description": "Macronutrients, hydration, and pre/post-competition fuelling.",
            "order": 2,
            "lessons": [
                {
                    "title": "Carbohydrates, Proteins, and Fats",
                    "description": "Energy systems and how each macronutrient fuels different sports.",
                    "content": "Carbohydrates are the primary fuel for high-intensity sport. Proteins rebuild muscle tissue after training. Fats fuel low-intensity prolonged activities. This lesson explains the ATP-PCr, glycolytic, and aerobic energy systems and which fuels they use.",
                    "video_url": "https://www.youtube.com/watch?v=NUTR_001",
                    "duration_minutes": 16,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Hydration and Electrolytes",
                    "description": "Signs of dehydration, sweat rate calculations, and electrolyte balance.",
                    "content": "Losing just 2% of body weight through sweat reduces performance by 10-20%. Learn to calculate your personal sweat rate, understand sodium and potassium's role in muscle contraction, and build a race-day hydration plan.",
                    "video_url": "https://www.youtube.com/watch?v=NUTR_002",
                    "duration_minutes": 12,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Recovery and Injury Prevention",
            "description": "Sleep, active recovery, warm-up/cool-down protocols, and RICE.",
            "order": 3,
            "lessons": [
                {
                    "title": "Warm-Up, Cool-Down, and Stretching",
                    "description": "Dynamic warm-up protocols, static stretching timing, and foam rolling.",
                    "content": "A proper warm-up raises core temperature, increases range of motion, and primes the nervous system. Dynamic stretches (leg swings, arm circles) prepare the body for exercise; static stretches belong after training. Learn a sport-specific 10-minute dynamic warm-up routine.",
                    "video_url": "https://www.youtube.com/watch?v=RECOV_001",
                    "duration_minutes": 13,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "RICE Protocol and Common Sports Injuries",
                    "description": "Rest, Ice, Compression, Elevation — first aid for sprains and strains.",
                    "content": "Sports injuries happen. Knowing how to respond immediately can make the difference between a 2-week and a 6-month recovery. Learn the RICE protocol for soft-tissue injuries, how to distinguish a sprain from a fracture, and when to seek medical attention.",
                    "video_url": "https://www.youtube.com/watch?v=RECOV_002",
                    "duration_minutes": 14,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
    ],
    "Olympic Values": [
        {
            "title": "History of the Olympic Movement",
            "description": "From Ancient Olympia to the modern Games — a 3,000 year story.",
            "order": 1,
            "lessons": [
                {
                    "title": "The Ancient Olympic Games",
                    "description": "Origins in ancient Greece, events, and the sacred truce.",
                    "content": "The ancient Olympic Games began in 776 BCE at Olympia, Greece — a religious festival honouring Zeus. Athletes competed naked in running, wrestling, chariot racing, and the pentathlon. The Olympic Truce (Ekecheiria) halted wars so athletes could travel safely. The Games were abolished by Emperor Theodosius I in 393 CE.",
                    "video_url": "https://www.youtube.com/watch?v=HIST_001",
                    "duration_minutes": 15,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Pierre de Coubertin and the Modern Olympics",
                    "description": "The revival in Athens 1896, the Olympic Charter, and the evolution to today.",
                    "content": "Baron Pierre de Coubertin revived the Olympic Games in 1896, believing sport could promote world peace and education. Learn about the first modern Games in Athens, the founding of the IOC, how the Games grew from 14 nations to 200+, and the addition of the Winter Games and Paralympics.",
                    "video_url": "https://www.youtube.com/watch?v=HIST_002",
                    "duration_minutes": 18,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "OVEP in Practice",
            "description": "Living Olympic values — Excellence, Respect, and Friendship in everyday life.",
            "order": 2,
            "lessons": [
                {
                    "title": "Excellence — Pursuing Your Personal Best",
                    "description": "What excellence really means — beyond medals and records.",
                    "content": "Olympic Excellence is not about being number one — it's about giving your best in whatever you do. We explore growth mindset vs fixed mindset, deliberate practice, and real stories of Olympians who competed for excellence even when they didn't win gold.",
                    "video_url": "https://www.youtube.com/watch?v=OVEP_001",
                    "duration_minutes": 14,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "Respect and Fair Play on and off the Field",
                    "description": "Why respecting opponents, officials, and rules makes you a better athlete.",
                    "content": "Respect in sport means accepting the result gracefully, following the rules even when no one is watching, and treating opponents as partners in your improvement. Case studies include the 1936 Berlin Olympics Jesse Owens story and modern examples of sporting respect.",
                    "video_url": "https://www.youtube.com/watch?v=OVEP_002",
                    "duration_minutes": 13,
                    "order": 2,
                    "is_published": True,
                },
                {
                    "title": "Friendship — Building Bonds Through Sport",
                    "description": "How sport creates lasting cross-cultural friendships.",
                    "content": "Olympic Friendship transcends borders, languages, and cultures. This lesson shares stories of athletes from rival nations forging genuine friendships, explores how the Olympic Village creates a unique community, and gives students tools to apply Olympic Friendship values in their own school and community.",
                    "video_url": "https://www.youtube.com/watch?v=OVEP_003",
                    "duration_minutes": 12,
                    "order": 3,
                    "is_published": True,
                },
            ],
        },
        {
            "title": "Olympic Legacy",
            "description": "Sport for development, inclusion, and the impact of the Olympics on society.",
            "order": 3,
            "lessons": [
                {
                    "title": "Sport for Development and Peace",
                    "description": "How sport is used globally to promote peace, health, and education.",
                    "content": "The United Nations recognises sport as a powerful tool for achieving the Sustainable Development Goals. This lesson covers the IOC's Agenda 2020 initiatives, the Olympic Solidarity programme, and African athletes who have used their platform to promote education and peacebuilding in their communities.",
                    "video_url": "https://www.youtube.com/watch?v=LEGACY_001",
                    "duration_minutes": 16,
                    "order": 1,
                    "is_published": True,
                },
                {
                    "title": "African Athletes at the Olympic Games",
                    "description": "Celebrating African Olympic history from Abebe Bikila to today.",
                    "content": "Africa has a rich Olympic history. Abebe Bikila won marathon gold barefoot in Rome 1960. Haile Gebrselassie broke world records throughout the 1990s. Caster Semenya raised global discussions about inclusion. This lesson celebrates African contributions and inspires the next generation.",
                    "video_url": "https://www.youtube.com/watch?v=LEGACY_002",
                    "duration_minutes": 17,
                    "order": 2,
                    "is_published": True,
                },
            ],
        },
    ],
}

ACTIVITY_TEMPLATES = [
    ("watch",    "Watch the Video",       "Watch the lesson video and take notes on key points."),
    ("read",     "Read and Reflect",      "Read the lesson content carefully, then write a one-paragraph summary in your own words."),
    ("practice", "Practical Exercise",   "Apply what you've learned in a practical drill or activity."),
    ("reflect",  "Reflect on Values",    "Think about how this lesson connects to the Olympic Values. Write 3 bullet points."),
]

topics_created = 0
lessons_created = 0
activities_created = 0

for subject_name, topics_data in CURRICULUM.items():
    subject = subjects_map[subject_name]
    for td in topics_data:
        topic, t_created = Topic.objects.get_or_create(
            subject=subject,
            title=td["title"],
            defaults={"description": td["description"], "order": td["order"]},
        )
        if t_created:
            topics_created += 1

        for i, ld in enumerate(td["lessons"]):
            lesson, l_created = Lesson.objects.get_or_create(
                topic=topic,
                title=ld["title"],
                defaults={
                    "description": ld["description"],
                    "content": ld["content"],
                    "video_url": ld["video_url"],
                    "duration_minutes": ld["duration_minutes"],
                    "order": ld["order"],
                    "is_published": ld["is_published"],
                },
            )
            if l_created:
                lessons_created += 1

            # Create 2 activities per lesson (watch + practice for first, read + reflect for rest)
            act_pairs = [(0, 2), (1, 3)] if i % 2 == 0 else [(0, 1), (2, 3)]
            for order_idx, (at_idx1, at_idx2) in enumerate(act_pairs, start=1):
                for order_sub, at_idx in enumerate([at_idx1, at_idx2], start=1):
                    atype, atitle, adesc = ACTIVITY_TEMPLATES[at_idx]
                    act, a_created = Activity.objects.get_or_create(
                        lesson=lesson,
                        title=f"{atitle}: {lesson.title}",
                        defaults={
                            "description": adesc,
                            "activity_type": atype,
                            "content": f"Complete the {atype} activity for this lesson on {lesson.title}.",
                            "order": (order_idx - 1) * 2 + order_sub,
                        },
                    )
                    if a_created:
                        activities_created += 1

print(f"  Created {topics_created} topics, {lessons_created} lessons, {activities_created} activities")

print("\nSeeding Scenarios (one per OVEP value)...")

# Get representative lessons for each scenario
all_lessons = list(Lesson.objects.select_related("topic__subject").filter(is_published=True))
def lesson_for(subject_name):
    return next((l for l in all_lessons if l.topic.subject.name == subject_name), all_lessons[0])

SCENARIOS = [
    {
        "title": "The Relay Shortcut",
        "scenario_text": "Your relay team is in second place in the regional finals. Your teammate passes you the baton, but you notice the anchor runner for the leading team dropped their baton slightly outside the exchange zone. The officials didn't see it. If you say nothing, your team wins.",
        "question": "What should you do?",
        "options": ["Say nothing and accept the victory", "Report it to the official immediately", "Wait to see if someone else reports it", "Ask your coach to decide"],
        "correct_answer": "Report it to the official immediately",
        "linked_value": "fair_play",
        "lesson_key": "Athletics",
    },
    {
        "title": "The Injured Swimmer",
        "scenario_text": "During a swimming warm-up session, you notice a classmate struggling in the deep end. They are not a strong swimmer and appear to be panicking. Other students are distracted by their own warm-ups.",
        "question": "What is the most important first action?",
        "options": ["Jump in to help them", "Shout for the lifeguard or PE teacher immediately", "Throw them a pool noodle", "Wait to see if they recover"],
        "correct_answer": "Shout for the lifeguard or PE teacher immediately",
        "linked_value": "respect",
        "lesson_key": "Swimming",
    },
    {
        "title": "The New Teammate",
        "scenario_text": "A new student joins your football team. She is from a different country, speaks limited English, and is clearly nervous. Some teammates are frustrated that she makes mistakes in training.",
        "question": "How can you best support her integration into the team?",
        "options": ["Ignore her and focus on your own training", "Pair with her during drills and use simple, encouraging words", "Tell the coach she should be in a different team", "Only interact with her if she speaks first"],
        "correct_answer": "Pair with her during drills and use simple, encouraging words",
        "linked_value": "inclusion",
        "lesson_key": "Team Sports",
    },
    {
        "title": "The Perfect Score Temptation",
        "scenario_text": "You are taking an online Sports Science quiz for marks. You notice that your screen shows the answers briefly when you hover over a specific area. No one else knows about this glitch.",
        "question": "What should a student with good values do?",
        "options": ["Use the glitch — no one will know", "Report the glitch to your teacher and complete the quiz fairly", "Use the glitch but only look at a few answers", "Close the quiz and not submit it"],
        "correct_answer": "Report the glitch to your teacher and complete the quiz fairly",
        "linked_value": "excellence",
        "lesson_key": "Sports Science",
    },
    {
        "title": "The Gymnastics Mockery",
        "scenario_text": "During a gymnastics session, a student attempts a cartwheel and falls. Some classmates start laughing and pointing. The student looks embarrassed and doesn't want to try again.",
        "question": "What is the most supportive response from a fellow student?",
        "options": ["Join in the laughter so you don't seem different", "Stay quiet and pretend you didn't see", "Encourage them to try again and tell others to stop", "Report it to the teacher only after class"],
        "correct_answer": "Encourage them to try again and tell others to stop",
        "linked_value": "friendship",
        "lesson_key": "Gymnastics",
    },
    {
        "title": "The Captain's Call",
        "scenario_text": "You are the team captain for a basketball game. Your best player is having a bad day and playing selfishly, not passing to open teammates. The team is losing because of it.",
        "question": "As captain, what is the right course of action?",
        "options": ["Say nothing to avoid conflict", "Remove them from the game without explanation", "Calmly speak to them privately, acknowledge their effort, and ask them to involve teammates more", "Tell the coach and let them handle it completely"],
        "correct_answer": "Calmly speak to them privately, acknowledge their effort, and ask them to involve teammates more",
        "linked_value": "leadership",
        "lesson_key": "Team Sports",
    },
    {
        "title": "The National Team Tryout",
        "scenario_text": "You are selected for the national athletics squad. At training camp, you meet athletes from very different backgrounds — different religions, body types, and home languages. One coach makes an insensitive comment about a teammate's dietary restrictions.",
        "question": "What action best demonstrates Olympic values?",
        "options": ["Stay silent to avoid trouble", "Agree with the coach to fit in", "Respectfully speak up for your teammate and explain their needs", "Leave the team to protest"],
        "correct_answer": "Respectfully speak up for your teammate and explain their needs",
        "linked_value": "diversity",
        "lesson_key": "Olympic Values",
    },
]

scenarios_created = 0
for sc in SCENARIOS:
    lesson = lesson_for(sc["lesson_key"])
    ovep = values_map[sc["linked_value"]]
    _, created = Scenario.objects.get_or_create(
        title=sc["title"],
        defaults={
            "scenario_text": sc["scenario_text"],
            "question": sc["question"],
            "options": sc["options"],
            "correct_answer": sc["correct_answer"],
            "linked_value": ovep,
            "lesson": lesson,
        },
    )
    if created:
        scenarios_created += 1
        print(f"  Created Scenario: {sc['title']}")

print(f"  Total scenarios created: {scenarios_created}")

print("\nFinal counts:")
print(f"  OVEPValues:  {OVEPValue.objects.count()}")
print(f"  Subjects:    {Subject.objects.count()}")
print(f"  Topics:      {Topic.objects.count()}")
print(f"  Lessons:     {Lesson.objects.count()}")
print(f"  Activities:  {Activity.objects.count()}")
print(f"  Scenarios:   {Scenario.objects.count()}")
print("\nDone! Curriculum seeded successfully.")
