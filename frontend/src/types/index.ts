export type Role = "student" | "teacher" | "coach" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  school: string | null;
  school_name: string | null;
  avatar: string | null;
  created_at: string;
}

export interface School {
  id: number;
  name: string;
  location: string;
}

export interface Class {
  id: number;
  name: string;
  teacher: string;
  teacher_name: string;
  school: number;
  student_count: number;
  created_at: string;
  students?: User[];
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  icon: string;
  topic_count: number;
  topics?: Topic[];
}

export interface Topic {
  id: number;
  subject: number;
  subject_name?: string;
  title: string;
  description: string;
  order: number;
  lesson_count: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  topic: number;
  title: string;
  description: string;
  content?: string;
  video_url: string;
  pdf?: string | null;
  thumbnail: string | null;
  duration_minutes: number;
  order: number;
  is_published: boolean;
  topic_title: string;
  subject_name: string;
  activity_count: number;
  activities?: Activity[];
  scenarios?: Scenario[];
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  activity_type: "watch" | "read" | "practice" | "reflect";
  content: string;
  order: number;
}

export interface Scenario {
  id: number;
  title: string;
  scenario_text: string;
  question: string;
  options: string[];
  correct_answer: string;
  linked_value: number;
  linked_value_name: string;
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  pass_score: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  is_published: boolean;
  lesson_title: string;
  question_count: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  question_text: string;
  question_type: "mcq" | "true_false" | "matching" | "scenario";
  options: string[];
  points: number;
  order: number;
}

export interface Attempt {
  id: string;
  assessment: number;
  assessment_title: string;
  student: string;
  student_name: string;
  score: number | null;
  passed: boolean | null;
  started_at: string;
  submitted_at: string | null;
}

export interface QuestionResult {
  question_id: string;
  question_text: string;
  given_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
  points: number;
}

export interface AttemptResult extends Attempt {
  answers: Record<string, string>;
  question_results: QuestionResult[];
}

export interface Certificate {
  id: string;
  certificate_number: string;
  student_name: string;
  school_name: string;
  assessment_title: string;
  issued_at: string;
}

export interface Progress {
  id: number;
  lesson: number;
  lesson_title: string;
  status: "started" | "completed";
  completed_at: string | null;
  created_at: string;
}

export interface MyStats {
  lessons_completed: number;
  lessons_started: number;
  total_lessons: number;
  quizzes_passed: number;
  avg_score: number;
  certificates: number;
  xp_total: number;
}

export interface TeacherDashboard {
  total_students: number;
  total_classes: number;
  completed_lessons: number;
  avg_score: number;
  pass_rate: number;
  classes: {
    id: number;
    name: string;
    student_count: number;
    avg_score: number;
    completed_lessons: number;
  }[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
