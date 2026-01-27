# Data Models - Structured Data for Learning Systems

## Purpose
This document provides data structures for building learning applications that implement the framework. Includes TypeScript interfaces, database schemas, and API specifications.

---

## Core Data Models

### 1. Student Profile

**Purpose**: Store student information, preferences, and learning patterns

```typescript
interface StudentProfile {
  // Identity
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Learning Characteristics
  learningProfile: {
    energyPattern: 'morning_person' | 'night_owl' | 'consistent' | 'custom';
    customEnergyLevels?: Array<{
      timeRange: string; // e.g., "09:00-12:00"
      energyLevel: 'high' | 'medium' | 'low';
    }>;
    preferredStudyDuration: number; // minutes per session
    focusCapacity: number; // minutes before break needed
    learningStyle: {
      visual: number; // 0-10 scale
      auditory: number;
      kinesthetic: number;
      readingWriting: number;
    };
  };

  // Historical Performance
  performanceHistory: {
    courses: Array<{
      courseId: string;
      grade: string | number;
      semester: string;
    }>;
    averageGPA?: number;
    strongSubjects: string[];
    weakSubjects: string[];
  };

  // Study Habits
  studyHabits: {
    currentMethods: string[]; // e.g., ['re-reading', 'highlighting', 'practice problems']
    effectiveMethods: string[]; // methods that have worked well
    ineffectiveMethods: string[]; // methods that haven't worked
    preferredEnvironment: 'quiet' | 'moderate_noise' | 'music' | 'varied';
    typicalStudyLocation: string;
  };

  // Goals and Motivation
  goals: {
    shortTerm: Array<{
      description: string;
      deadline?: Date;
      completed: boolean;
    }>;
    longTerm: Array<{
      description: string;
      targetDate?: Date;
    }>;
    primaryMotivation: string; // e.g., "career preparation", "intellectual curiosity", "grades"
  };

  // Constraints
  constraints: {
    weeklyAvailableHours: number;
    fixedCommitments: Array<{
      day: string;
      startTime: string;
      endTime: string;
      description: string;
      recurring: boolean;
    }>;
    healthConsiderations?: string[]; // e.g., ["ADHD", "dyslexia", "anxiety"]
  };

  // Preferences
  preferences: {
    notifications: {
      studyReminders: boolean;
      reviewReminders: boolean;
      progressUpdates: boolean;
      preferredTime: string; // e.g., "09:00"
    };
    dataTracking: {
      detailedMetrics: boolean;
      shareAnonymousData: boolean;
    };
  };

  // Metadata
  metadata: {
    onboardingCompleted: boolean;
    lastActive: Date;
    totalStudyTime: number; // cumulative minutes
    studyStreak: number; // consecutive days
    longestStreak: number;
  };
}
```

**Database Schema (PostgreSQL):**
```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Learning Profile (JSONB for flexibility)
  learning_profile JSONB NOT NULL DEFAULT '{}',

  -- Performance History
  performance_history JSONB DEFAULT '{}',

  -- Study Habits
  study_habits JSONB DEFAULT '{}',

  -- Goals
  goals JSONB DEFAULT '{}',

  -- Constraints
  constraints JSONB DEFAULT '{}',

  -- Preferences
  preferences JSONB DEFAULT '{}',

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Indexes
  INDEX idx_student_email (email),
  INDEX idx_student_created (created_at),
  INDEX idx_student_last_active ((metadata->>'lastActive'))
);
```

---

### 2. Course Model

**Purpose**: Represent a course/subject student is studying

```typescript
interface Course {
  // Identity
  id: string;
  studentId: string; // foreign key to StudentProfile
  name: string;
  code?: string; // e.g., "MATH101"
  semester: string; // e.g., "Fall 2024"
  createdAt: Date;
  updatedAt: Date;

  // Course Details
  details: {
    instructor?: string;
    department?: string;
    credits?: number;
    description?: string;
    syllabus?: string; // URL or text
  };

  // Assessment Structure
  assessments: {
    format: Array<'multiple_choice' | 'short_answer' | 'essay' | 'problem_solving' | 'practical' | 'presentation'>;
    weightDistribution: Array<{
      type: string; // e.g., "Midterm", "Final", "Homework", "Participation"
      weight: number; // percentage, e.g., 30
    }>;
    gradingScale?: {
      A: number; // e.g., 90
      B: number; // e.g., 80
      C: number; // e.g., 70
      D: number; // e.g., 60
      F: number; // e.g., 0
    };
  };

  // Topics/Units
  topics: Array<{
    id: string;
    name: string;
    order: number;
    status: 'not_started' | 'in_progress' | 'completed';
    importance: 1 | 2 | 3 | 4 | 5; // 5 = most important
    estimatedHours: number;
    prerequisites?: string[]; // IDs of prerequisite topics
  }>;

  // Schedule
  schedule: {
    classTime?: Array<{
      day: string; // e.g., "Monday"
      startTime: string; // e.g., "09:00"
      endTime: string; // e.g., "10:30"
      location?: string;
    }>;
    officeHours?: Array<{
      day: string;
      time: string;
      location?: string;
    }>;
    importantDates: Array<{
      date: Date;
      description: string; // e.g., "Midterm exam"
      type: 'exam' | 'assignment' | 'quiz' | 'other';
    }>;
  };

  // Current Status
  status: {
    currentGrade?: number | string;
    targetGrade: number | string;
    progressPercentage: number; // 0-100
    hoursSpentTotal: number;
    lastStudied?: Date;
  };

  // Resources
  resources: Array<{
    type: 'textbook' | 'video' | 'website' | 'notes' | 'practice_problems' | 'other';
    title: string;
    url?: string;
    description?: string;
    quality?: number; // 1-5 rating
  }>;

  // Metadata
  metadata: {
    archived: boolean;
    completedAt?: Date;
    finalGrade?: number | string;
    reflection?: string; // post-course reflection
  };
}
```

**Database Schema (PostgreSQL):**
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  semester VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Course information
  details JSONB DEFAULT '{}',
  assessments JSONB DEFAULT '{}',
  topics JSONB DEFAULT '[]',
  schedule JSONB DEFAULT '{}',
  status JSONB DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',

  -- Indexes
  INDEX idx_course_student (student_id),
  INDEX idx_course_semester (semester),
  INDEX idx_course_archived ((metadata->>'archived'))
);
```

---

### 3. Topic/Concept Model (with Mastery Tracking)

**Purpose**: Granular tracking of individual topics within courses

```typescript
interface Topic {
  // Identity
  id: string;
  courseId: string; // foreign key to Course
  studentId: string; // foreign key to StudentProfile
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Hierarchy
  hierarchy: {
    parentTopicId?: string; // for subtopics
    order: number; // position in course
    depth: number; // 0 = main topic, 1 = subtopic, etc.
  };

  // Content
  content: {
    description?: string;
    keywords: string[];
    prerequisites: string[]; // IDs of prerequisite topics
    relatedTopics: string[]; // IDs of related topics
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedHours: number;
  };

  // Mastery Tracking
  mastery: {
    currentLevel: 1 | 2 | 3 | 4 | 5;
    // 1 = No knowledge
    // 2 = Aware of topic, can't explain
    // 3 = Understand basics, struggle with details
    // 4 = Solid understanding, can apply
    // 5 = Expert, can teach

    history: Array<{
      date: Date;
      level: 1 | 2 | 3 | 4 | 5;
      assessmentType: 'self' | 'quiz' | 'test' | 'practice';
      notes?: string;
    }>;

    targetLevel: 1 | 2 | 3 | 4 | 5;

    masteryMetrics: {
      recallAccuracy: number; // 0-100%
      speedScore: number; // relative to baseline
      explanationFluency: number; // 1-10 scale
      applicationSuccess: number; // 0-100%
      lastAssessed: Date;
    };
  };

  // Study Records
  studyRecords: Array<{
    date: Date;
    durationMinutes: number;
    method: string; // e.g., "active_recall", "practice_problems"
    effectiveness: number; // 1-10 self-rating
    notes?: string;
  }>;

  // Learning Resources
  resources: Array<{
    type: string;
    title: string;
    url?: string;
    effectiveness?: number; // 1-10 rating
    completed: boolean;
  }>;

  // Questions/Problems
  questions: {
    total: number;
    correct: number;
    incorrect: number;
    lastPracticed?: Date;
    difficultQuestions: string[]; // IDs of questions student struggles with
  };

  // Review Schedule
  reviewSchedule: {
    lastReviewed?: Date;
    nextReview?: Date;
    reviewInterval: number; // days
    reviewsCompleted: number;
    reviewHistory: Array<{
      date: Date;
      success: boolean; // Could recall well?
      durationMinutes: number;
    }>;
  };

  // Metadata
  metadata: {
    importance: 1 | 2 | 3 | 4 | 5; // from course syllabus
    examRelevance: number; // 0-100%
    realWorldRelevance?: number; // 1-10 scale
    studentInterest: number; // 1-10 scale
    strugglingWithThis: boolean;
    tags: string[];
  };
}
```

**Database Schema (PostgreSQL):**
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Topic structure
  hierarchy JSONB DEFAULT '{}',
  content JSONB DEFAULT '{}',

  -- Mastery tracking
  mastery JSONB DEFAULT '{}',
  study_records JSONB DEFAULT '[]',
  resources JSONB DEFAULT '[]',
  questions JSONB DEFAULT '{}',
  review_schedule JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- Indexes
  INDEX idx_topic_course (course_id),
  INDEX idx_topic_student (student_id),
  INDEX idx_topic_mastery_level ((mastery->>'currentLevel')),
  INDEX idx_topic_next_review ((review_schedule->>'nextReview'))
);
```

---

### 4. Study Session Model

**Purpose**: Record individual study sessions with outcomes

```typescript
interface StudySession {
  // Identity
  id: string;
  studentId: string;
  courseId: string;
  topicIds: string[]; // topics covered in this session
  createdAt: Date; // session start time
  completedAt?: Date; // session end time

  // Session Plan
  plan: {
    plannedDuration: number; // minutes
    plannedActivities: Array<{
      type: 'reading' | 'active_recall' | 'practice_problems' | 'review' | 'video' | 'other';
      topic: string;
      duration: number; // minutes
    }>;
    goals: string[]; // what student wanted to accomplish
  };

  // Session Execution
  execution: {
    actualDuration: number; // minutes
    activitiesCompleted: Array<{
      type: string;
      topic: string;
      duration: number; // actual minutes
      completed: boolean;
      effectiveness: number; // 1-10 self-rating
    }>;
    breaks: Array<{
      startTime: Date;
      durationMinutes: number;
    }>;
    interruptions: Array<{
      time: Date;
      reason: string;
      durationMinutes: number;
    }>;
  };

  // Outcomes
  outcomes: {
    goalsAchieved: string[];
    goalsPartiallyAchieved: string[];
    goalsNotAchieved: string[];

    learningMetrics: {
      topicsCovered: number;
      problemsSolved: number;
      problemsCorrect: number;
      recallAttempts: number;
      recallSuccesses: number;
    };

    masteryChanges: Array<{
      topicId: string;
      previousLevel: number;
      newLevel: number;
    }>;

    newKnowledge: string[]; // what was learned
    identifiedGaps: string[]; // what gaps were discovered
    questionsRaised: string[]; // what questions came up
  };

  // Session Quality
  quality: {
    focusLevel: number; // 1-10 scale
    energyLevel: number; // 1-10 scale
    difficulty: number; // 1-10 scale
    satisfaction: number; // 1-10 scale

    distractions: Array<{
      type: 'phone' | 'noise' | 'people' | 'thoughts' | 'other';
      count: number;
    }>;

    effectiveness: number; // 1-10 overall rating
  };

  // Environment
  environment: {
    location: string;
    timeOfDay: 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'night';
    tools: string[]; // e.g., ["textbook", "laptop", "flashcards"]
    music?: boolean;
    company?: 'alone' | 'study_group' | 'other_people_nearby';
  };

  // Reflection
  reflection: {
    whatWorkedWell: string;
    whatDidntWork: string;
    whatToTryNext: string;
    moodBefore: string; // 'motivated' | 'tired' | 'stressed' | 'neutral' | etc.
    moodAfter: string;
    keyInsights?: string;
  };

  // Next Steps
  nextSteps: {
    immediateFollowUp: string[]; // what to do in next session
    reviewScheduled: Array<{
      topicId: string;
      reviewDate: Date;
    }>;
    questionsToAsk: string[]; // for instructor, tutor, etc.
  };

  // Metadata
  metadata: {
    isPlanned: boolean; // was this scheduled or ad-hoc?
    sessionType: 'regular' | 'exam_prep' | 'review' | 'catchup' | 'exploration';
    tags: string[];
    voiceNotes?: string; // URL to audio recording
    attachments?: string[]; // URLs to files
  };
}
```

**Database Schema (PostgreSQL):**
```sql
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  -- Session data
  plan JSONB DEFAULT '{}',
  execution JSONB DEFAULT '{}',
  outcomes JSONB DEFAULT '{}',
  quality JSONB DEFAULT '{}',
  environment JSONB DEFAULT '{}',
  reflection JSONB DEFAULT '{}',
  next_steps JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- Indexes
  INDEX idx_session_student (student_id),
  INDEX idx_session_course (course_id),
  INDEX idx_session_date (created_at),
  INDEX idx_session_type ((metadata->>'sessionType'))
);

-- Junction table for session-topic relationships
CREATE TABLE study_session_topics (
  session_id UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (session_id, topic_id)
);
```

---

### 5. Review Schedule Model

**Purpose**: Manage spaced repetition schedules

```typescript
interface ReviewSchedule {
  // Identity
  id: string;
  studentId: string;
  topicId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;

  // Schedule Configuration
  config: {
    algorithm: 'standard' | 'intensive' | 'long_term' | 'custom';
    // standard: 1, 3, 7, 14, 30 days
    // intensive: 1, 2, 4, 7, 14 days
    // long_term: 7, 21, 45, 90 days

    customIntervals?: number[]; // days
    adaptiveScheduling: boolean; // adjust based on performance
  };

  // Schedule State
  state: {
    currentInterval: number; // days until next review
    reviewCount: number; // total reviews completed
    consecutiveSuccesses: number; // reviews in a row that went well
    consecutiveFailures: number; // reviews in a row that didn't go well

    lastReview?: {
      date: Date;
      success: boolean;
      durationMinutes: number;
      recallAccuracy: number; // 0-100%
      difficulty: 'easy' | 'medium' | 'hard';
    };

    nextReview: {
      scheduledDate: Date;
      estimatedDuration: number; // minutes
      priority: 'high' | 'medium' | 'low';
      notificationSent: boolean;
    };
  };

  // Review History
  history: Array<{
    date: Date;
    scheduled: Date; // when it was supposed to happen
    onTime: boolean; // did it happen on schedule?
    durationMinutes: number;

    performance: {
      recallAccuracy: number; // 0-100%
      speed: 'faster' | 'normal' | 'slower'; // compared to previous
      confidence: number; // 1-10 scale
      difficulty: 'easy' | 'medium' | 'hard';
    };

    intervalAfter: number; // next interval decided after this review
    notes?: string;
  }>;

  // Predictions
  predictions: {
    retentionProbability: number; // 0-100%, likelihood of remembering without review
    forgettingCurvePosition: number; // 0-100%, how far along forgetting curve
    optimalReviewDate: Date; // algorithmically determined best date
    confidenceScore: number; // 0-100%, how confident in mastery
  };

  // Metadata
  metadata: {
    paused: boolean; // temporarily stop scheduling
    pauseReason?: string;
    resumeDate?: Date;
    importance: number; // 1-10 scale
    linkedToExam?: {
      examId: string;
      examDate: Date;
    };
  };
}
```

**Database Schema (PostgreSQL):**
```sql
CREATE TABLE review_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  config JSONB DEFAULT '{}',
  state JSONB DEFAULT '{}',
  history JSONB DEFAULT '[]',
  predictions JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- Indexes
  INDEX idx_review_student (student_id),
  INDEX idx_review_topic (topic_id),
  INDEX idx_review_next_date ((state->'nextReview'->>'scheduledDate')),
  INDEX idx_review_paused ((metadata->>'paused'))
);
```

---

### 6. Question Bank Model

**Purpose**: Store practice questions and track performance

```typescript
interface Question {
  // Identity
  id: string;
  topicId: string;
  courseId: string;
  createdBy: 'student' | 'instructor' | 'system' | 'imported';
  createdAt: Date;
  updatedAt: Date;

  // Question Content
  content: {
    type: 'multiple_choice' | 'short_answer' | 'true_false' | 'problem_solving' | 'essay';

    question: string; // the actual question text
    context?: string; // additional context/scenario

    // For multiple choice
    options?: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      explanation?: string; // why it's right/wrong
    }>;

    // Answer(s)
    answer: string | string[]; // correct answer(s)
    acceptableAnswers?: string[]; // variations that are also correct

    explanation?: string; // detailed explanation of answer
    solution?: string; // step-by-step solution (for problems)

    attachments?: Array<{
      type: 'image' | 'diagram' | 'code' | 'formula';
      url: string;
      description?: string;
    }>;
  };

  // Question Metadata
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number; // seconds
    skills: string[]; // e.g., ["algebra", "problem-solving", "critical-thinking"]
    keywords: string[];
    source?: string; // e.g., "Textbook Ch 5", "Past exam 2023"
    category?: string; // e.g., "fundamental", "application", "advanced"
    importance: number; // 1-10 scale
  };

  // Performance Tracking
  performance: {
    totalAttempts: number;
    correctAttempts: number;
    incorrectAttempts: number;
    averageTimeSeconds: number;

    firstAttempt?: {
      date: Date;
      correct: boolean;
      timeSeconds: number;
    };

    lastAttempt?: {
      date: Date;
      correct: boolean;
      timeSeconds: number;
    };

    attemptHistory: Array<{
      date: Date;
      correct: boolean;
      timeSeconds: number;
      studentAnswer: string | string[];
      confidence: number; // 1-10 scale
      notes?: string;
    }>;

    masteryLevel: 'not_attempted' | 'struggling' | 'developing' | 'proficient' | 'mastered';
    // not_attempted: 0 attempts
    // struggling: <50% correct
    // developing: 50-79% correct
    // proficient: 80-95% correct
    // mastered: >95% correct and fast
  };

  // Scheduling
  scheduling: {
    dueForReview: boolean;
    nextReviewDate?: Date;
    reviewPriority: 'high' | 'medium' | 'low';
    // high: recently got wrong
    // medium: got right but needs reinforcement
    // low: mastered, occasional review
  };

  // Relationships
  relationships: {
    relatedQuestions: string[]; // IDs of similar/related questions
    prerequisiteQuestions: string[]; // questions that should be mastered first
    followUpQuestions: string[]; // questions to try after this one
  };

  // Tags
  tags: string[]; // flexible tagging
}
```

**Database Schema (PostgreSQL):**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  performance JSONB DEFAULT '{}',
  scheduling JSONB DEFAULT '{}',
  relationships JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',

  -- Indexes
  INDEX idx_question_topic (topic_id),
  INDEX idx_question_course (course_id),
  INDEX idx_question_difficulty ((metadata->>'difficulty')),
  INDEX idx_question_mastery ((performance->>'masteryLevel')),
  INDEX idx_question_due_review ((scheduling->>'dueForReview'))
);
```

---

### 7. Progress Tracking Model

**Purpose**: Aggregate progress metrics across time

```typescript
interface ProgressSnapshot {
  // Identity
  id: string;
  studentId: string;
  courseId?: string; // null for overall progress
  createdAt: Date;
  periodType: 'daily' | 'weekly' | 'monthly' | 'semester' | 'custom';
  periodStart: Date;
  periodEnd: Date;

  // Study Time Metrics
  studyTime: {
    totalMinutes: number;
    byTopic: Map<string, number>; // topic ID -> minutes
    byCourse: Map<string, number>; // course ID -> minutes
    byMethod: Map<string, number>; // method -> minutes
    byTimeOfDay: {
      earlyMorning: number; // 5am-9am
      morning: number; // 9am-12pm
      afternoon: number; // 12pm-5pm
      evening: number; // 5pm-9pm
      night: number; // 9pm-1am
    };
  };

  // Learning Metrics
  learning: {
    topicsStudied: number;
    topicsMastered: number; // reached level 4+

    questionsAttempted: number;
    questionsCorrect: number;
    averageAccuracy: number; // percentage

    averageRecallAccuracy: number; // percentage
    averageFocusLevel: number; // 1-10 scale

    masteryGains: Array<{
      topicId: string;
      topicName: string;
      startLevel: number;
      endLevel: number;
      gain: number;
    }>;
  };

  // Method Usage
  methods: {
    activeRecallSessions: number;
    spacedRepetitionReviews: number;
    practiceProblemsSolved: number;
    readingMinutes: number;
    videoWatchingMinutes: number;

    mostEffectiveMethod: string;
    leastEffectiveMethod: string;

    methodEffectiveness: Map<string, {
      sessionsUsed: number;
      averageSatisfaction: number;
      averageMasteryGain: number;
    }>;
  };

  // Consistency Metrics
  consistency: {
    daysStudied: number;
    daysPlanned: number;
    adherenceRate: number; // percentage

    currentStreak: number; // days
    longestStreak: number; // days in this period

    missedSessions: number;
    rescheduledSessions: number;
  };

  // Performance Metrics
  performance: {
    testScores: Array<{
      testId: string;
      score: number;
      maxScore: number;
      percentage: number;
      date: Date;
    }>;

    averageTestScore: number;
    testScoreTrend: 'improving' | 'stable' | 'declining';

    assignmentScores: Array<{
      assignmentId: string;
      score: number;
      date: Date;
    }>;

    averageAssignmentScore: number;
  };

  // Efficiency Metrics
  efficiency: {
    studyTimePerMasteryPoint: number; // minutes per mastery level gained
    averageSessionEffectiveness: number; // 1-10 scale
    focusTimePercentage: number; // actual focus time vs total time

    bestStudyTime: string; // time of day with highest effectiveness
    bestStudyLocation: string;
    bestStudyDuration: number; // optimal session length in minutes
  };

  // Goal Progress
  goals: {
    completed: string[]; // goal IDs
    inProgress: string[]; // goal IDs
    blocked: string[]; // goal IDs

    completionRate: number; // percentage of goals completed
  };

  // Insights (Auto-generated)
  insights: {
    strengths: string[]; // what's working well
    improvements: string[]; // what to improve
    recommendations: string[]; // specific recommendations
    warnings: string[]; // red flags (e.g., declining performance, low consistency)
  };

  // Comparisons
  comparisons: {
    vsPreviousPeriod: {
      studyTimeChange: number; // percentage
      accuracyChange: number; // percentage
      masteryChange: number; // absolute
      consistencyChange: number; // percentage
    };

    vsAverage: {
      // compare to student's own average
      studyTimeRelative: number; // percentage above/below average
      accuracyRelative: number;
      consistencyRelative: number;
    };
  };

  // Metadata
  metadata: {
    autoGenerated: boolean;
    lastCalculated: Date;
    dataCompleteness: number; // 0-100%, how much data was available
    notes?: string;
  };
}
```

**Database Schema (PostgreSQL):**
```sql
CREATE TABLE progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  period_type VARCHAR(50) NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,

  study_time JSONB DEFAULT '{}',
  learning JSONB DEFAULT '{}',
  methods JSONB DEFAULT '{}',
  consistency JSONB DEFAULT '{}',
  performance JSONB DEFAULT '{}',
  efficiency JSONB DEFAULT '{}',
  goals JSONB DEFAULT '{}',
  insights JSONB DEFAULT '{}',
  comparisons JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- Indexes
  INDEX idx_progress_student (student_id),
  INDEX idx_progress_course (course_id),
  INDEX idx_progress_period (period_type, period_start),
  UNIQUE (student_id, course_id, period_type, period_start) -- prevent duplicates
);
```

---

## API Endpoint Structure

### RESTful API Design

```typescript
// Student Profile Endpoints
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
GET    /api/students/:id/stats

// Course Endpoints
GET    /api/students/:studentId/courses
POST   /api/students/:studentId/courses
GET    /api/courses/:id
PUT    /api/courses/:id
DELETE /api/courses/:id
GET    /api/courses/:id/progress

// Topic Endpoints
GET    /api/courses/:courseId/topics
POST   /api/courses/:courseId/topics
GET    /api/topics/:id
PUT    /api/topics/:id
DELETE /api/topics/:id
GET    /api/topics/:id/mastery-history
POST   /api/topics/:id/assess-mastery

// Study Session Endpoints
GET    /api/students/:studentId/study-sessions
POST   /api/students/:studentId/study-sessions
GET    /api/study-sessions/:id
PUT    /api/study-sessions/:id
POST   /api/study-sessions/:id/complete
GET    /api/study-sessions/:id/insights

// Review Schedule Endpoints
GET    /api/students/:studentId/reviews/due
GET    /api/students/:studentId/reviews/upcoming
POST   /api/topics/:topicId/schedule-review
PUT    /api/review-schedules/:id
POST   /api/review-schedules/:id/complete
GET    /api/review-schedules/:id/adjust

// Question Bank Endpoints
GET    /api/topics/:topicId/questions
POST   /api/topics/:topicId/questions
GET    /api/questions/:id
PUT    /api/questions/:id
DELETE /api/questions/:id
POST   /api/questions/:id/attempt
GET    /api/questions/due-for-review
POST   /api/questions/generate  // AI generation

// Progress Endpoints
GET    /api/students/:studentId/progress/current
GET    /api/students/:studentId/progress/history
GET    /api/students/:studentId/progress/:periodType
POST   /api/students/:studentId/progress/calculate
GET    /api/courses/:courseId/progress/analytics

// Planning Endpoints
POST   /api/students/:studentId/study-plans/generate
GET    /api/students/:studentId/study-plans/current
PUT    /api/students/:studentId/study-plans/:id
GET    /api/students/:studentId/schedule/weekly

// Recommendation Endpoints
GET    /api/students/:studentId/recommendations/next-topic
GET    /api/students/:studentId/recommendations/study-method
GET    /api/students/:studentId/recommendations/schedule-optimization
POST   /api/students/:studentId/diagnose-problems
```

### WebSocket Events

```typescript
// Real-time updates for study sessions
interface WebSocketEvents {
  // Study session updates
  'study:session:started': {
    sessionId: string;
    startTime: Date;
  };

  'study:session:paused': {
    sessionId: string;
    pauseTime: Date;
    durationSoFar: number;
  };

  'study:session:resumed': {
    sessionId: string;
    resumeTime: Date;
  };

  'study:session:completed': {
    sessionId: string;
    endTime: Date;
    summary: {
      duration: number;
      topicsCovered: number;
      effectiveness: number;
    };
  };

  // Review reminders
  'review:due': {
    topicId: string;
    topicName: string;
    courseId: string;
    scheduledTime: Date;
  };

  // Progress updates
  'progress:mastery-gained': {
    topicId: string;
    topicName: string;
    oldLevel: number;
    newLevel: number;
  };

  'progress:streak-updated': {
    currentStreak: number;
    isNewRecord: boolean;
  };

  // Achievements
  'achievement:unlocked': {
    achievementId: string;
    title: string;
    description: string;
  };
}
```

---

## Example Queries & Use Cases

### Query 1: Get All Topics Due for Review Today

```typescript
// TypeScript/JavaScript
const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

const dueTopics = await database.reviewSchedules.findMany({
  where: {
    studentId: studentId,
    'state.nextReview.scheduledDate': { $lte: todayEnd },
    'metadata.paused': false
  },
  include: {
    topic: true,
    course: true
  },
  orderBy: {
    'state.nextReview.priority': 'desc'
  }
});
```

```sql
-- SQL
SELECT rs.*, t.name as topic_name, c.name as course_name
FROM review_schedules rs
JOIN topics t ON rs.topic_id = t.id
JOIN courses c ON rs.course_id = c.id
WHERE rs.student_id = $1
  AND (rs.state->'nextReview'->>'scheduledDate')::timestamp <= NOW()
  AND (rs.metadata->>'paused')::boolean = false
ORDER BY
  CASE (rs.state->'nextReview'->>'priority')
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 3
  END;
```

### Query 2: Calculate Weekly Progress

```typescript
// Algorithm to calculate weekly progress
async function calculateWeeklyProgress(studentId: string, weekStart: Date): Promise<ProgressSnapshot> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  // Get all study sessions in week
  const sessions = await database.studySessions.findMany({
    where: {
      studentId: studentId,
      createdAt: { $gte: weekStart, $lt: weekEnd }
    }
  });

  // Aggregate study time
  const totalMinutes = sessions.reduce((sum, s) => sum + s.execution.actualDuration, 0);

  // Calculate mastery gains
  const masteryChanges = await database.topics.findMany({
    where: {
      studentId: studentId,
      'mastery.history': {
        $elemMatch: {
          date: { $gte: weekStart, $lt: weekEnd }
        }
      }
    }
  });

  // ... more calculations

  return progressSnapshot;
}
```

### Query 3: Recommend Next Topic to Study

```typescript
// Algorithm to recommend next topic
async function recommendNextTopic(studentId: string, courseId: string): Promise<Topic> {
  // Get all topics for course
  const topics = await database.topics.findMany({
    where: {
      courseId: courseId,
      studentId: studentId
    },
    include: {
      reviewSchedule: true
    }
  });

  // Score each topic
  const scoredTopics = topics.map(topic => {
    let score = 0;

    // Priority = Importance × (6 - MasteryLevel)
    const basePriority = topic.metadata.importance * (6 - topic.mastery.currentLevel);
    score += basePriority * 10;

    // Boost if due for review
    if (topic.reviewSchedule?.state.nextReview.scheduledDate <= new Date()) {
      score += 50;
    }

    // Boost if struggling
    if (topic.metadata.strugglingWithThis) {
      score += 30;
    }

    // Boost if prerequisites are met
    const prerequisitesMet = topic.content.prerequisites.every(prereqId => {
      const prereq = topics.find(t => t.id === prereqId);
      return prereq && prereq.mastery.currentLevel >= 3;
    });
    if (prerequisitesMet) {
      score += 20;
    } else {
      score -= 100; // Penalty if prerequisites not met
    }

    // Boost if high exam relevance
    score += topic.metadata.examRelevance;

    return { topic, score };
  });

  // Sort by score descending
  scoredTopics.sort((a, b) => b.score - a.score);

  return scoredTopics[0].topic;
}
```

---

## Integration Considerations

### Data Synchronization
- Implement optimistic UI updates with eventual consistency
- Use WebSockets for real-time updates
- Queue offline changes for sync when connection restored

### Privacy & Security
- Encrypt sensitive data at rest and in transit
- Implement row-level security in database
- GDPR compliance: allow data export and deletion
- Student data is never shared without explicit consent

### Scalability
- Use JSONB for flexible schema evolution
- Index frequently queried fields
- Implement caching layer (Redis) for frequently accessed data
- Consider read replicas for analytics queries

### Analytics & ML Integration
- Export data to analytics warehouse for deep analysis
- Train ML models for:
  - Optimal review timing prediction
  - Study method recommendations
  - Performance forecasting
  - Difficulty estimation

---

**Document version**: 1.0
**Last updated**: 2025-12-19
**Usage**: These data models provide the foundation for building learning applications. Adapt schemas to your specific technology stack and requirements.
