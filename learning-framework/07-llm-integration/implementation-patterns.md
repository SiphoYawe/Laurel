# Implementation Patterns - Reusable Coaching Algorithms

## Purpose
This document provides reusable algorithms (patterns) for common coaching tasks. Each pattern includes input parameters, processing logic, and expected outputs. Use these as templates for systematic student support.

---

## Pattern 1: Study Session Designer

**Purpose**: Generate structured study sessions optimized for learning outcomes

### Input Parameters
```typescript
interface SessionDesignInput {
  subject: string;
  topic: string;
  timeAvailable: number; // minutes
  energyLevel: 'high' | 'medium' | 'low';
  materialType: 'new' | 'review' | 'practice' | 'mixed';
  studentMastery: 1 | 2 | 3 | 4 | 5; // current level
  assessmentDate?: Date; // if preparing for exam
}
```

### Algorithm

```
FUNCTION designStudySession(input):

  // Step 1: Determine session structure based on time
  IF timeAvailable < 25:
    structure = singlePomodoro(input)
  ELSE IF timeAvailable < 60:
    structure = doublePomodoro(input)
  ELSE IF timeAvailable < 120:
    structure = extendedSession(input)
  ELSE:
    structure = marathon(input)

  // Step 2: Select techniques based on energy and material type
  techniques = selectTechniques(input.energyLevel, input.materialType, input.studentMastery)

  // Step 3: Assign activities to time blocks
  session = buildSessionPlan(structure, techniques, input)

  // Step 4: Add spacing if review material
  IF input.materialType == 'review':
    session = addInterleaving(session)

  // Step 5: Generate specific action items
  session.actionItems = generateActionItems(session)

  RETURN session

// Helper: Single Pomodoro (< 25 min)
FUNCTION singlePomodoro(input):
  RETURN {
    type: 'single',
    blocks: [
      {
        duration: input.timeAvailable - 5,
        activity: 'focused_work'
      },
      {
        duration: 5,
        activity: 'break'
      }
    ]
  }

// Helper: Double Pomodoro (25-60 min)
FUNCTION doublePomodoro(input):
  workTime = floor((input.timeAvailable - 15) / 2)
  RETURN {
    type: 'double',
    blocks: [
      { duration: workTime, activity: 'focused_work_1' },
      { duration: 5, activity: 'break' },
      { duration: workTime, activity: 'focused_work_2' },
      { duration: 5, activity: 'break' },
      { duration: input.timeAvailable - (workTime * 2 + 15), activity: 'review' }
    ]
  }

// Helper: Extended Session (60-120 min)
FUNCTION extendedSession(input):
  RETURN {
    type: 'extended',
    blocks: [
      { duration: 25, activity: 'technique_1' },
      { duration: 5, activity: 'break' },
      { duration: 25, activity: 'technique_2' },
      { duration: 10, activity: 'break' },
      { duration: 25, activity: 'practice' },
      { duration: 5, activity: 'break' },
      { duration: 25, activity: 'review_consolidate' }
    ]
  }

// Helper: Technique Selection
FUNCTION selectTechniques(energyLevel, materialType, mastery):

  // High energy = cognitively demanding techniques
  IF energyLevel == 'high':
    IF materialType == 'new':
      RETURN ['active_reading', 'feynman_technique', 'practice_problems']
    ELSE IF materialType == 'review':
      RETURN ['active_recall', 'practice_testing', 'elaboration']
    ELSE IF materialType == 'practice':
      RETURN ['problem_solving', 'error_analysis', 'challenge_problems']

  // Medium energy = balanced approach
  ELSE IF energyLevel == 'medium':
    IF materialType == 'new':
      RETURN ['active_reading', 'active_recall', 'simple_practice']
    ELSE IF materialType == 'review':
      RETURN ['flashcards', 'practice_questions', 'concept_mapping']
    ELSE IF materialType == 'practice':
      RETURN ['routine_problems', 'worked_examples', 'pattern_recognition']

  // Low energy = lighter cognitive load
  ELSE IF energyLevel == 'low':
    IF materialType == 'new':
      RETURN ['reading_with_notes', 'video_with_pauses', 'organize_materials']
    ELSE IF materialType == 'review':
      RETURN ['flashcard_review', 'skim_notes', 'summary_review']
    ELSE IF materialType == 'practice':
      RETURN ['redo_previous_problems', 'check_worked_solutions', 'organize_problem_set']

  RETURN ['active_recall'] // default

// Helper: Build Session Plan
FUNCTION buildSessionPlan(structure, techniques, input):
  plan = {
    subject: input.subject,
    topic: input.topic,
    totalDuration: input.timeAvailable,
    blocks: []
  }

  techniqueIndex = 0

  FOR EACH block IN structure.blocks:
    IF block.activity.startsWith('focused_work') OR block.activity.startsWith('technique'):
      plan.blocks.push({
        duration: block.duration,
        activity: techniques[techniqueIndex % techniques.length],
        description: generateActivityDescription(techniques[techniqueIndex], input)
      })
      techniqueIndex++
    ELSE IF block.activity == 'break':
      plan.blocks.push({
        duration: block.duration,
        activity: 'break',
        description: 'Stand up, walk around, get water, rest eyes'
      })
    ELSE:
      plan.blocks.push({
        duration: block.duration,
        activity: block.activity,
        description: generateActivityDescription(block.activity, input)
      })

  RETURN plan

// Helper: Generate Activity Description
FUNCTION generateActivityDescription(technique, input):
  descriptions = {
    'active_reading': `Read ${input.topic} section actively, pausing to predict what comes next and question claims`,
    'active_recall': `Close materials, write everything you remember about ${input.topic}`,
    'feynman_technique': `Explain ${input.topic} as if teaching a beginner, identify gaps, review gaps, re-explain`,
    'practice_problems': `Solve 5-10 problems on ${input.topic} without looking at solutions`,
    'flashcards': `Review flashcards on ${input.topic}, grade honestly`,
    'problem_solving': `Attempt challenging problems on ${input.topic}, struggle before checking solutions`,
    'error_analysis': `Review problems you got wrong, identify why, redo from scratch`,
    'practice_testing': `Close-book test on ${input.topic}, check answers, study gaps`,
    'elaboration': `For each concept in ${input.topic}, generate examples and connect to prior knowledge`,
    'review': `Quick review of what you just studied, identify strongest and weakest points`
  }

  RETURN descriptions[technique] OR `Work on ${input.topic} using ${technique}`
```

### Example Input
```javascript
{
  subject: "Biology",
  topic: "Cellular Respiration",
  timeAvailable: 60,
  energyLevel: "high",
  materialType: "new",
  studentMastery: 2,
  assessmentDate: "2025-01-15"
}
```

### Example Output
```javascript
{
  subject: "Biology",
  topic: "Cellular Respiration",
  totalDuration: 60,
  blocks: [
    {
      duration: 25,
      activity: "active_reading",
      description: "Read Cellular Respiration section actively, pausing to predict what comes next and question claims"
    },
    {
      duration: 5,
      activity: "break",
      description: "Stand up, walk around, get water, rest eyes"
    },
    {
      duration: 25,
      activity: "active_recall",
      description: "Close materials, write everything you remember about Cellular Respiration"
    },
    {
      duration: 5,
      activity: "break",
      description: "Stand up, walk around, get water, rest eyes"
    }
  ],
  actionItems: [
    "Set timer for 25 minutes",
    "Read textbook section 4.2 on Cellular Respiration",
    "Pause after each paragraph to predict and question",
    "Take 5-minute break (physically move)",
    "Set timer for 25 minutes",
    "Close all materials",
    "Write everything remembered about: glycolysis, Krebs cycle, electron transport chain",
    "Check what you missed and note gaps"
  ],
  nextSession: "Tomorrow: Review notes on gaps, practice problems on ATP yield calculations"
}
```

---

## Pattern 2: Revision Timetable Generator

**Purpose**: Create spaced repetition schedule for exam preparation

### Input Parameters
```typescript
interface RevisionInput {
  examDate: Date;
  currentDate: Date;
  topics: Array<{
    name: string;
    importance: 1 | 2 | 3 | 4 | 5; // 5 = critical
    currentMastery: 1 | 2 | 3 | 4 | 5; // 5 = fully mastered
    timeRequired: number; // estimated minutes for initial review
  }>;
  dailyAvailableTime: number; // minutes per day
  constraints?: {
    busyDates?: Date[];
    preferredStudyTimes?: string[];
  };
}
```

### Algorithm

```
FUNCTION generateRevisionTimetable(input):

  // Step 1: Calculate time until exam
  daysUntilExam = (input.examDate - input.currentDate) / (1000 * 60 * 60 * 24)

  IF daysUntilExam < 1:
    RETURN emergencyTimetable(input)

  // Step 2: Prioritize topics
  prioritizedTopics = prioritizeTopics(input.topics)

  // Step 3: Calculate total time needed
  totalTimeNeeded = calculateTotalTime(prioritizedTopics, daysUntilExam)
  totalTimeAvailable = daysUntilExam * input.dailyAvailableTime

  // Step 4: Check feasibility
  IF totalTimeNeeded > totalTimeAvailable * 1.2:
    WARN "Timeline is tight. May need to deprioritize low-importance topics."

  // Step 5: Generate schedule with spaced repetition
  schedule = buildSpacedSchedule(prioritizedTopics, input.currentDate, input.examDate, input.dailyAvailableTime)

  // Step 6: Apply constraints
  IF input.constraints:
    schedule = applyConstraints(schedule, input.constraints)

  // Step 7: Optimize for cognitive load
  schedule = balanceLoad(schedule)

  RETURN schedule

// Helper: Prioritize Topics
FUNCTION prioritizeTopics(topics):
  // Priority = Importance × (6 - Mastery)
  // High importance + low mastery = highest priority

  FOR EACH topic IN topics:
    topic.priority = topic.importance * (6 - topic.currentMastery)

  SORT topics BY priority DESC
  RETURN topics

// Helper: Calculate Total Time
FUNCTION calculateTotalTime(topics, daysAvailable):
  totalTime = 0

  FOR EACH topic IN topics:
    // Initial study
    totalTime += topic.timeRequired

    // Number of reviews based on time available
    IF daysAvailable >= 14:
      reviews = 4 // Day 1, 3, 7, 14
    ELSE IF daysAvailable >= 7:
      reviews = 3 // Day 1, 3, 7
    ELSE IF daysAvailable >= 3:
      reviews = 2 // Day 1, 3
    ELSE:
      reviews = 1 // Day 1

    // Each review takes 50% of initial time
    reviewTime = topic.timeRequired * 0.5 * reviews
    totalTime += reviewTime

  RETURN totalTime

// Helper: Build Spaced Schedule
FUNCTION buildSpacedSchedule(topics, startDate, examDate, dailyTime):
  schedule = {}
  daysAvailable = (examDate - startDate) / (1000 * 60 * 60 * 24)

  // Determine spacing intervals based on time available
  IF daysAvailable >= 30:
    intervals = [1, 3, 7, 14, 30]
  ELSE IF daysAvailable >= 14:
    intervals = [1, 3, 7, 14]
  ELSE IF daysAvailable >= 7:
    intervals = [1, 3, 7]
  ELSE IF daysAvailable >= 3:
    intervals = [1, 2, 3]
  ELSE:
    intervals = [1] // Emergency mode

  currentDay = new Date(startDate)

  FOR EACH topic IN topics:
    // Schedule initial learning
    IF schedule[currentDay] == undefined:
      schedule[currentDay] = []

    schedule[currentDay].push({
      topic: topic.name,
      type: 'initial',
      duration: topic.timeRequired,
      activity: 'Active recall + practice problems'
    })

    // Schedule reviews
    FOR EACH interval IN intervals:
      reviewDate = new Date(currentDay)
      reviewDate.setDate(reviewDate.getDate() + interval)

      IF reviewDate < examDate:
        IF schedule[reviewDate] == undefined:
          schedule[reviewDate] = []

        schedule[reviewDate].push({
          topic: topic.name,
          type: `review_${interval}d`,
          duration: topic.timeRequired * 0.5,
          activity: 'Active recall + key problem types'
        })

    // Move to next available day for next topic
    currentDay = findNextAvailableDay(schedule, currentDay, dailyTime)

  // Add final comprehensive review 2 days before exam
  finalReviewDate = new Date(examDate)
  finalReviewDate.setDate(finalReviewDate.getDate() - 2)

  IF schedule[finalReviewDate] == undefined:
    schedule[finalReviewDate] = []

  schedule[finalReviewDate].push({
    topic: 'ALL TOPICS',
    type: 'comprehensive',
    duration: dailyTime,
    activity: 'Practice exam + gap filling'
  })

  RETURN schedule

// Helper: Find Next Available Day
FUNCTION findNextAvailableDay(schedule, currentDate, dailyLimit):
  date = new Date(currentDate)

  WHILE getTotalTime(schedule[date]) >= dailyLimit:
    date.setDate(date.getDate() + 1)

  RETURN date

// Helper: Balance Cognitive Load
FUNCTION balanceLoad(schedule):
  FOR EACH date IN schedule:
    sessions = schedule[date]

    // Don't overload any single day
    totalTime = sum(sessions.map(s => s.duration))

    IF totalTime > 180: // More than 3 hours
      WARN `${date}: High study load (${totalTime} min). Consider spreading out.`

    // Mix initial learning and review
    initialCount = sessions.filter(s => s.type == 'initial').length
    reviewCount = sessions.filter(s => s.type.startsWith('review')).length

    // Ideally mix new and review
    IF initialCount > 0 AND reviewCount == 0:
      // All new material - very demanding
      sessions.push({
        type: 'buffer',
        duration: 15,
        activity: 'Break / light review of previous topics'
      })

  RETURN schedule
```

### Example Input
```javascript
{
  examDate: new Date('2025-01-20'),
  currentDate: new Date('2025-01-05'),
  topics: [
    { name: 'Cell Biology', importance: 5, currentMastery: 2, timeRequired: 90 },
    { name: 'Genetics', importance: 4, currentMastery: 3, timeRequired: 60 },
    { name: 'Evolution', importance: 3, currentMastery: 4, timeRequired: 45 },
    { name: 'Ecology', importance: 4, currentMastery: 2, timeRequired: 75 }
  ],
  dailyAvailableTime: 120
}
```

### Example Output
```javascript
{
  metadata: {
    totalDays: 15,
    totalTopics: 4,
    totalStudyTime: 720, // minutes
    averagePerDay: 48,
    warnings: []
  },
  schedule: {
    '2025-01-05': [
      {
        topic: 'Cell Biology',
        type: 'initial',
        duration: 90,
        activity: 'Active recall + practice problems',
        priority: 20 // importance: 5, mastery: 2, priority: 5*(6-2)=20
      }
    ],
    '2025-01-06': [
      {
        topic: 'Cell Biology',
        type: 'review_1d',
        duration: 45,
        activity: 'Active recall + key problem types'
      },
      {
        topic: 'Ecology',
        type: 'initial',
        duration: 75,
        activity: 'Active recall + practice problems',
        priority: 16 // importance: 4, mastery: 2, priority: 4*(6-2)=16
      }
    ],
    '2025-01-07': [
      {
        topic: 'Ecology',
        type: 'review_1d',
        duration: 38,
        activity: 'Active recall + key problem types'
      },
      {
        topic: 'Genetics',
        type: 'initial',
        duration: 60,
        activity: 'Active recall + practice problems',
        priority: 12 // importance: 4, mastery: 3, priority: 4*(6-3)=12
      }
    ],
    '2025-01-08': [
      {
        topic: 'Cell Biology',
        type: 'review_3d',
        duration: 45,
        activity: 'Active recall + key problem types'
      },
      {
        topic: 'Genetics',
        type: 'review_1d',
        duration: 30,
        activity: 'Active recall + key problem types'
      },
      {
        topic: 'Evolution',
        type: 'initial',
        duration: 45,
        activity: 'Active recall + practice problems',
        priority: 6 // importance: 3, mastery: 4, priority: 3*(6-4)=6
      }
    ],
    '2025-01-09': [
      {
        topic: 'Ecology',
        type: 'review_3d',
        duration: 38,
        activity: 'Active recall + key problem types'
      },
      {
        topic: 'Evolution',
        type: 'review_1d',
        duration: 23,
        activity: 'Active recall + key problem types'
      }
    ],
    // ... continued through exam date
    '2025-01-18': [
      {
        topic: 'ALL TOPICS',
        type: 'comprehensive',
        duration: 120,
        activity: 'Practice exam + gap filling'
      }
    ],
    '2025-01-19': [
      {
        topic: 'ALL TOPICS',
        type: 'final_review',
        duration: 60,
        activity: 'Light review of highest-priority topics only. Early sleep.'
      }
    ]
  },
  dailySummary: [
    { date: '2025-01-05', totalTime: 90, newTopics: 1, reviews: 0 },
    { date: '2025-01-06', totalTime: 120, newTopics: 1, reviews: 1 },
    // ... etc
  ],
  recommendations: [
    "Cell Biology is high priority (importance: 5, mastery: 2). Scheduled 4 reviews.",
    "Consider extra practice problems for Ecology (importance: 4, mastery: 2).",
    "Evolution is lowest priority (mastery: 4 already). Focus elsewhere if time tight."
  ]
}
```

---

## Pattern 3: Active Recall Question Generator

**Purpose**: Create questions from source material to facilitate active recall practice

### Input Parameters
```typescript
interface QuestionGenInput {
  topic: string;
  sourceContent: string; // summary or full text
  questionTypes: Array<'factual' | 'conceptual' | 'application' | 'analysis'>;
  difficulty: 'easy' | 'medium' | 'hard';
  quantity: number;
  format: 'flashcard' | 'short-answer' | 'problem-solving';
}
```

### Algorithm

```
FUNCTION generateActiveRecallQuestions(input):

  // Step 1: Parse source content
  keyPoints = extractKeyPoints(input.sourceContent)
  concepts = identifyConcepts(input.sourceContent)
  examples = extractExamples(input.sourceContent)
  relationships = identifyRelationships(concepts)

  // Step 2: Generate questions by type
  questions = []

  FOR EACH questionType IN input.questionTypes:
    SWITCH questionType:
      CASE 'factual':
        questions.push(...generateFactualQuestions(keyPoints, input.difficulty, input.format))
      CASE 'conceptual':
        questions.push(...generateConceptualQuestions(concepts, input.difficulty, input.format))
      CASE 'application':
        questions.push(...generateApplicationQuestions(concepts, examples, input.difficulty, input.format))
      CASE 'analysis':
        questions.push(...generateAnalysisQuestions(relationships, input.difficulty, input.format))

  // Step 3: Balance difficulty
  questions = balanceDifficulty(questions, input.difficulty, input.quantity)

  // Step 4: Format output
  formattedQuestions = formatQuestions(questions, input.format)

  RETURN formattedQuestions

// Helper: Extract Key Points
FUNCTION extractKeyPoints(content):
  // Look for:
  // - Definitions
  // - Key facts
  // - Important numbers/dates
  // - Names and terms

  keyPoints = []

  // Pattern: definitions ("X is Y", "X refers to Y")
  definitionPattern = /(\w+(?:\s+\w+)*)\s+(?:is|refers to|means|represents)\s+(.+?)(?:\.|;|,|$)/gi
  WHILE match = definitionPattern.exec(content):
    keyPoints.push({
      type: 'definition',
      term: match[1],
      definition: match[2],
      importance: calculateImportance(match[1], content)
    })

  // Pattern: key facts ("X causes Y", "X results in Y")
  factPattern = /(\w+(?:\s+\w+)*)\s+(?:causes|results in|leads to|produces)\s+(.+?)(?:\.|;|,|$)/gi
  WHILE match = factPattern.exec(content):
    keyPoints.push({
      type: 'causal',
      cause: match[1],
      effect: match[2],
      importance: calculateImportance(match[1] + match[2], content)
    })

  // Pattern: processes/steps
  IF content.includes('first', 'then', 'next', 'finally'):
    steps = extractProcess(content)
    keyPoints.push({
      type: 'process',
      steps: steps,
      importance: 'high'
    })

  RETURN keyPoints

// Helper: Generate Factual Questions
FUNCTION generateFactualQuestions(keyPoints, difficulty, format):
  questions = []

  FOR EACH point IN keyPoints:
    IF point.type == 'definition':
      questions.push({
        type: 'factual',
        difficulty: 'easy',
        question: `What is ${point.term}?`,
        answer: point.definition,
        cues: difficulty == 'easy' ? [point.term.split(' ')[0]] : []
      })

      // Reverse question
      IF difficulty IN ['medium', 'hard']:
        questions.push({
          type: 'factual',
          difficulty: 'medium',
          question: `What term describes: ${point.definition}?`,
          answer: point.term,
          cues: []
        })

    ELSE IF point.type == 'causal':
      questions.push({
        type: 'factual',
        difficulty: 'medium',
        question: `What does ${point.cause} cause/produce?`,
        answer: point.effect,
        cues: difficulty == 'easy' ? [point.effect.split(' ')[0]] : []
      })

      // Reverse question
      questions.push({
        type: 'factual',
        difficulty: 'medium',
        question: `What causes/produces ${point.effect}?`,
        answer: point.cause,
        cues: []
      })

    ELSE IF point.type == 'process':
      questions.push({
        type: 'factual',
        difficulty: 'medium',
        question: `What are the steps in [process name]?`,
        answer: point.steps.join(', '),
        cues: difficulty == 'easy' ? [point.steps[0]] : []
      })

      // Order questions
      FOR i = 0 TO point.steps.length - 2:
        questions.push({
          type: 'factual',
          difficulty: 'easy',
          question: `What step comes after "${point.steps[i]}"?`,
          answer: point.steps[i+1],
          cues: []
        })

  RETURN questions

// Helper: Generate Conceptual Questions
FUNCTION generateConceptualQuestions(concepts, difficulty, format):
  questions = []

  FOR EACH concept IN concepts:
    // "Explain" questions
    questions.push({
      type: 'conceptual',
      difficulty: 'medium',
      question: `Explain the concept of ${concept.name} in your own words.`,
      answer: concept.explanation,
      assessmentCriteria: ['Accuracy', 'Completeness', 'Clarity'],
      cues: []
    })

    // "Why" questions
    IF concept.reasons:
      questions.push({
        type: 'conceptual',
        difficulty: 'medium',
        question: `Why is ${concept.name} important/significant?`,
        answer: concept.reasons,
        cues: difficulty == 'easy' ? [concept.reasons[0]] : []
      })

    // Comparison questions
    IF difficulty IN ['medium', 'hard']:
      FOR EACH otherConcept IN concepts WHERE otherConcept != concept:
        IF areRelated(concept, otherConcept):
          questions.push({
            type: 'conceptual',
            difficulty: 'hard',
            question: `Compare and contrast ${concept.name} and ${otherConcept.name}.`,
            answer: generateComparison(concept, otherConcept),
            assessmentCriteria: ['Similarities identified', 'Differences identified', 'Depth of analysis'],
            cues: []
          })
          BREAK // Only one comparison question per concept

  RETURN questions

// Helper: Generate Application Questions
FUNCTION generateApplicationQuestions(concepts, examples, difficulty, format):
  questions = []

  FOR EACH concept IN concepts:
    // "Apply to new scenario" questions
    newScenario = generateNovelScenario(concept, examples)
    questions.push({
      type: 'application',
      difficulty: 'hard',
      question: `How would ${concept.name} apply to this scenario: ${newScenario}?`,
      answer: applyConceptToScenario(concept, newScenario),
      assessmentCriteria: ['Correct application', 'Reasoning explained', 'Considers edge cases'],
      cues: difficulty == 'easy' ? [concept.keyPrinciples[0]] : []
    })

    // "Predict outcome" questions
    IF concept.hasCausalRelationships:
      questions.push({
        type: 'application',
        difficulty: 'medium',
        question: `If X happens, what would be the effect according to ${concept.name}?`,
        answer: predictOutcome(concept, 'X'),
        cues: []
      })

    // "Solve problem" questions
    IF concept.isProblemSolvable:
      problem = generateProblem(concept, difficulty)
      questions.push({
        type: 'application',
        difficulty: difficulty,
        question: problem.question,
        answer: problem.solution,
        steps: problem.steps,
        cues: []
      })

  RETURN questions

// Helper: Generate Analysis Questions
FUNCTION generateAnalysisQuestions(relationships, difficulty, format):
  questions = []

  FOR EACH relationship IN relationships:
    // "What is the relationship" questions
    questions.push({
      type: 'analysis',
      difficulty: 'medium',
      question: `What is the relationship between ${relationship.conceptA} and ${relationship.conceptB}?`,
      answer: relationship.description,
      cues: difficulty == 'easy' ? [relationship.type] : [] // e.g., "causal", "hierarchical"
    })

    // "Why does this relationship exist" questions
    IF difficulty IN ['medium', 'hard']:
      questions.push({
        type: 'analysis',
        difficulty: 'hard',
        question: `Why does ${relationship.conceptA} relate to ${relationship.conceptB} in this way?`,
        answer: relationship.reasoning,
        cues: []
      })

    // "What if" questions (manipulating relationships)
    IF difficulty == 'hard':
      questions.push({
        type: 'analysis',
        difficulty: 'hard',
        question: `What would happen if ${relationship.conceptA} changed? How would this affect ${relationship.conceptB}?`,
        answer: analyzeChange(relationship),
        assessmentCriteria: ['Identifies direct effects', 'Considers indirect effects', 'Explains reasoning'],
        cues: []
      })

  RETURN questions

// Helper: Balance Difficulty
FUNCTION balanceDifficulty(questions, targetDifficulty, quantity):
  // Distribution based on target difficulty
  distribution = {
    'easy': { easy: 0.7, medium: 0.2, hard: 0.1 },
    'medium': { easy: 0.3, medium: 0.5, hard: 0.2 },
    'hard': { easy: 0.2, medium: 0.3, hard: 0.5 }
  }

  target = distribution[targetDifficulty]

  // Count current distribution
  current = {
    easy: questions.filter(q => q.difficulty == 'easy').length,
    medium: questions.filter(q => q.difficulty == 'medium').length,
    hard: questions.filter(q => q.difficulty == 'hard').length
  }

  // Select questions to meet target distribution
  selected = []

  neededEasy = floor(quantity * target.easy)
  neededMedium = floor(quantity * target.medium)
  neededHard = floor(quantity * target.hard)

  selected.push(...selectRandom(questions.filter(q => q.difficulty == 'easy'), neededEasy))
  selected.push(...selectRandom(questions.filter(q => q.difficulty == 'medium'), neededMedium))
  selected.push(...selectRandom(questions.filter(q => q.difficulty == 'hard'), neededHard))

  RETURN selected
```

### Example Input
```javascript
{
  topic: "Photosynthesis",
  sourceContent: "Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in two stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). In the light-dependent reactions, chlorophyll absorbs light energy, which is used to split water molecules, releasing oxygen as a byproduct. The energy is stored in ATP and NADPH. In the Calvin cycle, CO2 is fixed and reduced to form glucose using the ATP and NADPH from the light reactions.",
  questionTypes: ['factual', 'conceptual', 'application'],
  difficulty: 'medium',
  quantity: 10,
  format: 'flashcard'
}
```

### Example Output
```javascript
{
  metadata: {
    topic: "Photosynthesis",
    totalQuestions: 10,
    difficultyDistribution: { easy: 3, medium: 5, hard: 2 },
    typeDistribution: { factual: 4, conceptual: 3, application: 3 }
  },
  questions: [
    {
      id: 1,
      type: 'factual',
      difficulty: 'easy',
      format: 'flashcard',
      front: "What is photosynthesis?",
      back: "The process by which plants convert light energy into chemical energy",
      cues: [],
      tags: ['definition', 'basic']
    },
    {
      id: 2,
      type: 'factual',
      difficulty: 'medium',
      format: 'flashcard',
      front: "What are the two main stages of photosynthesis?",
      back: "Light-dependent reactions and light-independent reactions (Calvin cycle)",
      cues: [],
      tags: ['structure', 'overview']
    },
    {
      id: 3,
      type: 'factual',
      difficulty: 'medium',
      format: 'flashcard',
      front: "What is produced during the light-dependent reactions?",
      back: "ATP, NADPH, and oxygen (O2 as byproduct)",
      cues: [],
      tags: ['light-dependent', 'products']
    },
    {
      id: 4,
      type: 'factual',
      difficulty: 'easy',
      format: 'flashcard',
      front: "What gas is released as a byproduct of photosynthesis?",
      back: "Oxygen (O2)",
      cues: ['starts with O'],
      tags: ['byproduct', 'basic']
    },
    {
      id: 5,
      type: 'conceptual',
      difficulty: 'medium',
      format: 'flashcard',
      front: "Explain the role of chlorophyll in photosynthesis",
      back: "Chlorophyll absorbs light energy which is used to power the reactions that split water molecules and store energy in ATP/NADPH",
      cues: [],
      tags: ['chlorophyll', 'mechanism'],
      assessmentCriteria: ['Mentions light absorption', 'Connects to energy transfer', 'Mentions specific products']
    },
    {
      id: 6,
      type: 'conceptual',
      difficulty: 'medium',
      format: 'flashcard',
      front: "Why is photosynthesis described as a two-stage process?",
      back: "The first stage (light-dependent) captures and stores energy, while the second stage (Calvin cycle) uses that stored energy to build glucose from CO2. They're distinct but connected.",
      cues: [],
      tags: ['structure', 'reasoning']
    },
    {
      id: 7,
      type: 'conceptual',
      difficulty: 'hard',
      format: 'flashcard',
      front: "Explain how the light-dependent and light-independent reactions are connected",
      back: "Light-dependent reactions produce ATP and NADPH, which are then consumed by the Calvin cycle to fix and reduce CO2 into glucose. The stages are interdependent.",
      cues: [],
      tags: ['relationship', 'integration']
    },
    {
      id: 8,
      type: 'application',
      difficulty: 'medium',
      format: 'flashcard',
      front: "What would happen to the Calvin cycle if the light-dependent reactions stopped?",
      back: "The Calvin cycle would stop because it requires ATP and NADPH from the light-dependent reactions. No ATP/NADPH = no CO2 fixation or glucose production.",
      cues: [],
      tags: ['prediction', 'dependency']
    },
    {
      id: 9,
      type: 'application',
      difficulty: 'hard',
      format: 'flashcard',
      front: "A plant is placed in an environment with light but no CO2. What stages of photosynthesis will function and what will be produced?",
      back: "Light-dependent reactions will function, producing ATP, NADPH, and O2. But Calvin cycle cannot function without CO2, so no glucose will be produced. ATP/NADPH will accumulate.",
      cues: [],
      tags: ['scenario', 'problem-solving']
    },
    {
      id: 10,
      type: 'application',
      difficulty: 'easy',
      format: 'flashcard',
      front: "Why do plants need sunlight to grow?",
      back: "Sunlight provides the energy for photosynthesis, which produces glucose that plants use for growth and energy",
      cues: ['energy', 'photosynthesis'],
      tags: ['real-world', 'basic']
    }
  ],
  usageInstructions: "Study these flashcards using active recall: read the front, try to answer completely from memory, then check the back. Grade yourself honestly. Review incorrect answers more frequently.",
  spacedRepetitionSchedule: "New cards: study today, tomorrow, in 3 days. Correct cards: extend interval by 2x. Incorrect cards: back to 1-day interval."
}
```

---

## Pattern 4: Technique Recommender

**Purpose**: Recommend study techniques based on learning context

### Input Parameters
```typescript
interface TechniqueRecommendationInput {
  learningGoal: 'understand' | 'memorize' | 'apply' | 'analyze' | 'create';
  timeAvailable: number; // minutes
  materialType: 'reading' | 'lecture' | 'problems' | 'conceptual' | 'factual';
  currentPhase: 'initial_learning' | 'practice' | 'review' | 'exam_prep';
  studentProfile?: {
    learningStyle?: string;
    pastSuccesses?: string[];
    struggles?: string[];
  };
}
```

### Algorithm

```
FUNCTION recommendTechniques(input):

  // Step 1: Get all applicable techniques
  allTechniques = getTechniqueDatabase()

  // Step 2: Filter by learning goal
  goalFiltered = filterByGoal(allTechniques, input.learningGoal)

  // Step 3: Filter by material type
  materialFiltered = filterByMaterial(goalFiltered, input.materialType)

  // Step 4: Filter by time available
  timeFiltered = filterByTime(materialFiltered, input.timeAvailable)

  // Step 5: Rank by phase appropriateness
  phaseRanked = rankByPhase(timeFiltered, input.currentPhase)

  // Step 6: Personalize if profile available
  IF input.studentProfile:
    phaseRanked = personalize(phaseRanked, input.studentProfile)

  // Step 7: Return top recommendations with implementation guidance
  RETURN {
    primary: phaseRanked[0],
    alternatives: phaseRanked.slice(1, 4),
    combination: suggestCombination(phaseRanked, input),
    implementation: generateImplementationGuide(phaseRanked[0], input)
  }

// Helper: Technique Database
FUNCTION getTechniqueDatabase():
  RETURN [
    {
      name: 'Active Recall',
      goals: ['understand', 'memorize', 'apply'],
      materialTypes: ['reading', 'lecture', 'conceptual', 'factual'],
      phases: ['initial_learning', 'practice', 'review', 'exam_prep'],
      timeRequired: 15, // minimum minutes
      effectiveness: 0.90, // 0-1 scale based on research
      difficulty: 'moderate',
      description: 'Close materials and retrieve information from memory'
    },
    {
      name: 'Spaced Repetition',
      goals: ['memorize', 'retain'],
      materialTypes: ['reading', 'conceptual', 'factual'],
      phases: ['review', 'exam_prep'],
      timeRequired: 10,
      effectiveness: 0.88,
      difficulty: 'easy',
      description: 'Review material at increasing intervals'
    },
    {
      name: 'Feynman Technique',
      goals: ['understand', 'analyze'],
      materialTypes: ['reading', 'lecture', 'conceptual'],
      phases: ['initial_learning', 'practice'],
      timeRequired: 20,
      effectiveness: 0.85,
      difficulty: 'moderate',
      description: 'Explain concept in simple terms as if teaching'
    },
    {
      name: 'Practice Testing',
      goals: ['apply', 'memorize'],
      materialTypes: ['problems', 'factual'],
      phases: ['practice', 'exam_prep'],
      timeRequired: 25,
      effectiveness: 0.92,
      difficulty: 'hard',
      description: 'Solve problems without looking at solutions'
    },
    {
      name: 'Interleaved Practice',
      goals: ['apply', 'analyze'],
      materialTypes: ['problems', 'conceptual'],
      phases: ['practice', 'review', 'exam_prep'],
      timeRequired: 30,
      effectiveness: 0.82,
      difficulty: 'moderate',
      description: 'Mix different types of problems/topics in one session'
    },
    {
      name: 'Elaboration',
      goals: ['understand', 'analyze', 'create'],
      materialTypes: ['reading', 'lecture', 'conceptual'],
      phases: ['initial_learning', 'practice'],
      timeRequired: 20,
      effectiveness: 0.75,
      difficulty: 'moderate',
      description: 'Generate explanations, examples, and connections'
    },
    {
      name: 'Dual Coding',
      goals: ['understand', 'memorize'],
      materialTypes: ['reading', 'conceptual'],
      phases: ['initial_learning', 'review'],
      timeRequired: 25,
      effectiveness: 0.70,
      difficulty: 'moderate',
      description: 'Combine words and visuals (diagrams, concept maps)'
    },
    {
      name: 'Self-Explanation',
      goals: ['understand', 'analyze'],
      materialTypes: ['reading', 'problems', 'conceptual'],
      phases: ['initial_learning', 'practice'],
      timeRequired: 15,
      effectiveness: 0.78,
      difficulty: 'moderate',
      description: 'Explain steps and reasoning while solving problems'
    },
    {
      name: 'Retrieval Practice',
      goals: ['memorize', 'apply'],
      materialTypes: ['factual', 'problems'],
      phases: ['practice', 'review', 'exam_prep'],
      timeRequired: 20,
      effectiveness: 0.90,
      difficulty: 'moderate',
      description: 'Repeatedly retrieve information from memory'
    },
    {
      name: 'Concept Mapping',
      goals: ['understand', 'analyze'],
      materialTypes: ['reading', 'lecture', 'conceptual'],
      phases: ['initial_learning', 'review'],
      timeRequired: 30,
      effectiveness: 0.72,
      difficulty: 'hard',
      description: 'Create visual maps showing relationships between concepts'
    }
  ]

// Helper: Filter by Goal
FUNCTION filterByGoal(techniques, goal):
  RETURN techniques.filter(t => t.goals.includes(goal))

// Helper: Filter by Material
FUNCTION filterByMaterial(techniques, materialType):
  RETURN techniques.filter(t => t.materialTypes.includes(materialType))

// Helper: Filter by Time
FUNCTION filterByTime(techniques, timeAvailable):
  RETURN techniques.filter(t => t.timeRequired <= timeAvailable)

// Helper: Rank by Phase
FUNCTION rankByPhase(techniques, phase):
  // Score each technique
  FOR EACH technique IN techniques:
    score = 0

    // Base score from effectiveness
    score += technique.effectiveness * 100

    // Boost if perfect phase match
    IF technique.phases.includes(phase):
      score += 30

    // Boost if phase is exam_prep and technique is high effectiveness
    IF phase == 'exam_prep' AND technique.effectiveness >= 0.85:
      score += 20

    technique.score = score

  // Sort by score
  SORT techniques BY score DESC

  RETURN techniques

// Helper: Personalize
FUNCTION personalize(techniques, profile):
  FOR EACH technique IN techniques:
    // Boost techniques that worked before
    IF profile.pastSuccesses.includes(technique.name):
      technique.score += 25

    // Lower rank for techniques student struggles with
    IF profile.struggles.includes(technique.name):
      technique.score -= 15

  // Re-sort
  SORT techniques BY score DESC

  RETURN techniques

// Helper: Suggest Combination
FUNCTION suggestCombination(rankedTechniques, input):
  // Combine techniques that complement each other

  primary = rankedTechniques[0]

  // If primary is active recall, combine with spaced repetition
  IF primary.name == 'Active Recall':
    secondary = rankedTechniques.find(t => t.name == 'Spaced Repetition')
    RETURN {
      approach: 'sequential',
      techniques: [primary, secondary],
      description: 'Use active recall for initial learning and practice, then schedule reviews using spaced repetition'
    }

  // If primary is practice testing, combine with interleaving
  ELSE IF primary.name == 'Practice Testing':
    secondary = rankedTechniques.find(t => t.name == 'Interleaved Practice')
    RETURN {
      approach: 'integrated',
      techniques: [primary, secondary],
      description: 'Do practice problems (testing) while mixing different problem types (interleaving)'
    }

  // If primary is Feynman, combine with elaboration
  ELSE IF primary.name == 'Feynman Technique':
    secondary = rankedTechniques.find(t => t.name == 'Elaboration')
    RETURN {
      approach: 'integrated',
      techniques: [primary, secondary],
      description: 'Use Feynman technique to explain, and elaboration to generate examples and connections'
    }

  // Default: primary technique plus active recall
  ELSE:
    secondary = rankedTechniques.find(t => t.name == 'Active Recall')
    RETURN {
      approach: 'sequential',
      techniques: [primary, secondary],
      description: `Use ${primary.name} for initial engagement, then active recall to test understanding`
    }

// Helper: Generate Implementation Guide
FUNCTION generateImplementationGuide(technique, input):
  guides = {
    'Active Recall': `
      1. After reading/studying, close all materials
      2. Set timer for ${input.timeAvailable} minutes
      3. Write everything you remember about the topic
      4. Open materials and check what you missed
      5. Focus additional study on gaps
      6. Repeat recall attempt after short break
    `,
    'Practice Testing': `
      1. Gather practice problems on this topic
      2. Set timer for ${input.timeAvailable} minutes
      3. Attempt problems WITHOUT looking at solutions
      4. If stuck, review concept (not solution), then retry
      5. Only check solutions after attempting all problems
      6. Redo incorrect problems from scratch
    `,
    'Feynman Technique': `
      1. Choose a concept from your material
      2. Explain it out loud as if teaching a beginner (${input.timeAvailable / 3} min)
      3. Identify where your explanation broke down
      4. Review those specific gaps in the material (${input.timeAvailable / 3} min)
      5. Try explaining again, more simply (${input.timeAvailable / 3} min)
      6. Repeat until explanation is clear and complete
    `,
    'Spaced Repetition': `
      1. Create flashcards or questions from material
      2. Study them today (${input.timeAvailable} min)
      3. Review tomorrow (schedule now)
      4. Review in 3 days (schedule now)
      5. Review in 7 days (schedule now)
      6. Review in 14 days (schedule now)
    `,
    'Interleaved Practice': `
      1. Identify 3-4 different topics or problem types
      2. Do 5 problems from Topic A
      3. Do 5 problems from Topic B
      4. Do 5 problems from Topic C
      5. Rotate through topics every ${input.timeAvailable / 4} minutes
      6. Mix in old and new material
    `
  }

  RETURN guides[technique.name] OR `
    1. Allocate ${input.timeAvailable} minutes
    2. ${technique.description}
    3. Self-test to verify understanding
    4. Note gaps for follow-up study
  `
```

### Example Input
```javascript
{
  learningGoal: 'understand',
  timeAvailable: 45,
  materialType: 'conceptual',
  currentPhase: 'initial_learning',
  studentProfile: {
    learningStyle: 'visual',
    pastSuccesses: ['Active Recall', 'Concept Mapping'],
    struggles: ['Long reading sessions']
  }
}
```

### Example Output
```javascript
{
  primary: {
    name: 'Active Recall',
    effectiveness: 0.90,
    timeRequired: 15,
    difficulty: 'moderate',
    description: 'Close materials and retrieve information from memory',
    score: 145, // base 90 + phase match 30 + past success 25
    whyRecommended: 'Highest effectiveness for understanding, matches initial learning phase, and has worked well for you before'
  },
  alternatives: [
    {
      name: 'Feynman Technique',
      effectiveness: 0.85,
      timeRequired: 20,
      difficulty: 'moderate',
      description: 'Explain concept in simple terms as if teaching',
      score: 115,
      whyRecommended: 'Excellent for deep understanding, appropriate time requirement'
    },
    {
      name: 'Concept Mapping',
      effectiveness: 0.72,
      timeRequired: 30,
      difficulty: 'hard',
      description: 'Create visual maps showing relationships between concepts',
      score: 127, // base 72 + phase match 30 + past success 25
      whyRecommended: 'Matches your visual learning style and past success'
    },
    {
      name: 'Elaboration',
      effectiveness: 0.75,
      timeRequired: 20,
      difficulty: 'moderate',
      description: 'Generate explanations, examples, and connections',
      score: 105,
      whyRecommended: 'Good for understanding phase, fits time constraint'
    }
  ],
  combination: {
    approach: 'sequential',
    techniques: [
      { name: 'Active Recall', duration: 20 },
      { name: 'Concept Mapping', duration: 25 }
    ],
    description: 'Start with active recall to see what you know, then create a concept map to organize and visualize connections. This combines retrieval practice with your visual learning preference.',
    timeline: '20 min active recall → 5 min break → 20 min concept mapping'
  },
  implementation: {
    stepByStep: [
      {
        step: 1,
        duration: 20,
        instruction: 'After reading material, close everything and write/draw what you remember',
        tips: ['Don\'t peek!', 'Include as much detail as possible', 'Note areas of uncertainty']
      },
      {
        step: 2,
        duration: 5,
        instruction: 'Take a real break - stand up, walk around, rest eyes',
        tips: ['Don\'t check phone', 'Physical movement helps', 'Hydrate']
      },
      {
        step: 3,
        duration: 20,
        instruction: 'Create a concept map showing relationships between ideas',
        tips: ['Use main concepts as nodes', 'Draw connections with labeled arrows', 'Use colors/shapes to categorize', 'This matches your visual learning style']
      }
    ],
    expectedOutcome: 'By end of session, you should be able to recall main concepts and explain how they relate to each other. The concept map becomes a review tool.',
    successCriteria: [
      'Can recall 70%+ of main concepts without looking',
      'Concept map shows clear relationships',
      'Can explain the map to someone else'
    ],
    nextSteps: 'Review this concept map tomorrow using active recall (close it, try to recreate it from memory). Schedule additional reviews at 3 days and 7 days.'
  },
  warnings: [
    'Avoid falling back into passive reading',
    'Active recall should feel difficult - that\'s normal and beneficial',
    'If you can\'t recall much initially, that reveals gaps to focus on'
  ],
  whyNotOthers: {
    'Practice Testing': 'Better for application goals; you\'re focused on understanding first',
    'Spaced Repetition': 'More appropriate for review phase; you\'re in initial learning',
    'Interleaved Practice': 'Requires multiple topics; focus on understanding this one first'
  }
}
```

---

## Pattern 5: Study Habit Auditor

**Purpose**: Analyze current study habits and provide improvement recommendations

### Input Parameters
```typescript
interface StudyHabitInput {
  currentHabits: string; // free-text description
  weeklySchedule?: Array<{
    day: string;
    studyBlocks: Array<{
      startTime: string;
      duration: number;
      activity: string;
    }>;
  }>;
  performanceMetrics?: {
    testScores: number[];
    hoursStudied: number[];
    subjectiveRetention: number; // 1-10 scale
  };
  goals?: string[];
  constraints?: string[];
}
```

### Algorithm

```
FUNCTION auditStudyHabits(input):

  // Step 1: Parse habits description
  habits = parseHabits(input.currentHabits)

  // Step 2: Identify passive vs active methods
  activePassiveRatio = calculateActivePassiveRatio(habits)

  // Step 3: Check for spacing/scheduling
  spacingScore = analyzeSpacing(input.weeklySchedule)

  // Step 4: Identify red flags
  redFlags = identifyRedFlags(habits, input.weeklySchedule)

  // Step 5: Calculate efficiency
  IF input.performanceMetrics:
    efficiency = calculateEfficiency(input.performanceMetrics)
  ELSE:
    efficiency = 'unknown'

  // Step 6: Generate recommendations
  recommendations = generateRecommendations(activePassiveRatio, spacingScore, redFlags, efficiency, input.goals)

  // Step 7: Create action plan
  actionPlan = createActionPlan(recommendations, input.constraints)

  RETURN {
    analysis: {
      activePassiveRatio: activePassiveRatio,
      spacingScore: spacingScore,
      efficiency: efficiency,
      redFlags: redFlags
    },
    recommendations: recommendations,
    actionPlan: actionPlan,
    expectedImprovement: estimateImprovement(activePassiveRatio, spacingScore)
  }

// Helper: Parse Habits
FUNCTION parseHabits(habitDescription):
  habits = {
    passive: [],
    active: [],
    scheduling: {},
    environment: {}
  }

  text = habitDescription.toLowerCase()

  // Identify passive methods
  passiveKeywords = {
    'read': 'reading',
    'reread': 're-reading',
    'highlight': 'highlighting',
    'watch': 'watching lectures',
    'review notes': 'reviewing notes passively',
    'go over': 'going over material'
  }

  FOR EACH keyword IN passiveKeywords:
    IF text.includes(keyword):
      habits.passive.push(passiveKeywords[keyword])

  // Identify active methods
  activeKeywords = {
    'practice problems': 'practice problems',
    'quiz': 'self-quizzing',
    'flashcard': 'flashcards',
    'explain': 'explaining concepts',
    'teach': 'teaching/explaining',
    'test myself': 'self-testing',
    'write from memory': 'active recall',
    'recall': 'active recall'
  }

  FOR EACH keyword IN activeKeywords:
    IF text.includes(keyword):
      habits.active.push(activeKeywords[keyword])

  // Identify scheduling patterns
  IF text.includes('cram') OR text.includes('night before'):
    habits.scheduling.pattern = 'cramming'
  ELSE IF text.includes('every day') OR text.includes('daily'):
    habits.scheduling.pattern = 'daily'
  ELSE IF text.includes('whenever') OR text.includes('when I have time'):
    habits.scheduling.pattern = 'ad-hoc'
  ELSE:
    habits.scheduling.pattern = 'unclear'

  // Identify review habits
  IF text.includes('don\'t review') OR text.includes('only once'):
    habits.scheduling.review = 'none'
  ELSE IF text.includes('review before exam') OR text.includes('review at end'):
    habits.scheduling.review = 'end-loaded'
  ELSE IF text.includes('review regularly') OR text.includes('spaced'):
    habits.scheduling.review = 'spaced'
  ELSE:
    habits.scheduling.review = 'unclear'

  RETURN habits

// Helper: Calculate Active/Passive Ratio
FUNCTION calculateActivePassiveRatio(habits):
  activeCount = habits.active.length
  passiveCount = habits.passive.length
  total = activeCount + passiveCount

  IF total == 0:
    RETURN { ratio: 'unknown', assessment: 'unclear', activePercentage: null }

  activePercentage = activeCount / total

  IF activePercentage >= 0.8:
    assessment = 'excellent'
  ELSE IF activePercentage >= 0.6:
    assessment = 'good'
  ELSE IF activePercentage >= 0.4:
    assessment = 'fair'
  ELSE:
    assessment = 'poor'

  RETURN {
    ratio: `${activeCount}:${passiveCount}`,
    assessment: assessment,
    activePercentage: activePercentage,
    activeMethods: habits.active,
    passiveMethods: habits.passive
  }

// Helper: Analyze Spacing
FUNCTION analyzeSpacing(schedule):
  IF NOT schedule:
    RETURN { score: 'unknown', description: 'No schedule provided' }

  // Check if material is reviewed multiple times
  hasRegularReview = false
  hasSpacing = false

  // Analyze pattern of study sessions
  sessions = []
  FOR EACH day IN schedule:
    FOR EACH block IN day.studyBlocks:
      sessions.push({
        day: day.day,
        activity: block.activity
      })

  // Check for same topics across multiple days
  topics = sessions.map(s => s.activity).unique()
  FOR EACH topic IN topics:
    daysWithTopic = sessions.filter(s => s.activity == topic).map(s => s.day)
    IF daysWithTopic.length > 1:
      hasRegularReview = true
      // Check spacing between reviews
      // (simplified: just checking if spread across week)
      IF daysWithTopic.length >= 3:
        hasSpacing = true

  score = 0
  IF hasRegularReview: score += 50
  IF hasSpacing: score += 50

  IF score >= 80:
    assessment = 'excellent'
  ELSE IF score >= 50:
    assessment = 'good'
  ELSE IF score >= 30:
    assessment = 'fair'
  ELSE:
    assessment = 'poor'

  RETURN {
    score: score,
    assessment: assessment,
    hasRegularReview: hasRegularReview,
    hasSpacing: hasSpacing,
    description: generateSpacingDescription(hasRegularReview, hasSpacing)
  }

// Helper: Identify Red Flags
FUNCTION identifyRedFlags(habits, schedule):
  flags = []

  // Red flag: All passive methods
  IF habits.active.length == 0 AND habits.passive.length > 0:
    flags.push({
      severity: 'critical',
      issue: 'No active learning methods detected',
      impact: 'Retention and understanding will be significantly impaired',
      fix: 'Introduce active recall immediately'
    })

  // Red flag: Cramming
  IF habits.scheduling.pattern == 'cramming':
    flags.push({
      severity: 'high',
      issue: 'Cramming detected (studying only night before)',
      impact: 'Poor long-term retention, high stress, lower performance',
      fix: 'Spread study over multiple days, implement spaced repetition'
    })

  // Red flag: No review
  IF habits.scheduling.review == 'none':
    flags.push({
      severity: 'high',
      issue: 'No review of previously studied material',
      impact: 'Forgetting curve will erase 70-90% of material within a week',
      fix: 'Schedule reviews at 1, 3, 7, and 14 days after initial learning'
    })

  // Red flag: Excessive highlighting
  IF habits.passive.includes('highlighting'):
    flags.push({
      severity: 'medium',
      issue: 'Relying on highlighting',
      impact: 'Creates illusion of productivity with minimal learning benefit',
      fix: 'Replace highlighting with active recall or question generation'
    })

  // Red flag: Re-reading
  IF habits.passive.includes('re-reading'):
    flags.push({
      severity: 'medium',
      issue: 'Re-reading as primary study method',
      impact: 'Creates familiarity (recognition) but not recall ability',
      fix: 'Read once carefully, then use active recall instead of re-reading'
    })

  // Red flag: Long unbroken study sessions
  IF schedule:
    FOR EACH day IN schedule:
      FOR EACH block IN day.studyBlocks:
        IF block.duration > 90:
          flags.push({
            severity: 'low',
            issue: `Long unbroken study session (${block.duration} min)`,
            impact: 'Decreased focus and retention in later portion',
            fix: 'Break into 25-50 minute blocks with 5-10 minute breaks'
          })
          BREAK // Only report once

  RETURN flags

// Helper: Calculate Efficiency
FUNCTION calculateEfficiency(metrics):
  // Efficiency = Performance / Input
  // High efficiency: Good scores with less time
  // Low efficiency: Poor scores despite high time

  avgScore = average(metrics.testScores)
  avgHours = average(metrics.hoursStudied)

  // Normalize (assuming 100 point scale, reasonable study hours)
  efficiency = avgScore / (avgHours * 10) // rough formula

  IF efficiency > 1.2:
    assessment = 'high'
  ELSE IF efficiency > 0.8:
    assessment = 'moderate'
  ELSE:
    assessment = 'low'

  RETURN {
    score: efficiency,
    assessment: assessment,
    avgTestScore: avgScore,
    avgHoursPerWeek: avgHours,
    interpretation: generateEfficiencyInterpretation(efficiency, avgScore, avgHours)
  }

// Helper: Generate Recommendations
FUNCTION generateRecommendations(activePassiveRatio, spacingScore, redFlags, efficiency, goals):
  recommendations = []

  // Priority 1: Address critical red flags
  criticalFlags = redFlags.filter(f => f.severity == 'critical')
  FOR EACH flag IN criticalFlags:
    recommendations.push({
      priority: 1,
      category: 'critical_fix',
      recommendation: flag.fix,
      reason: flag.issue,
      expectedImpact: 'high'
    })

  // Priority 2: Improve active/passive ratio
  IF activePassiveRatio.activePercentage < 0.5:
    recommendations.push({
      priority: 1,
      category: 'study_methods',
      recommendation: 'Shift to 80% active learning methods',
      reason: `Currently only ${(activePassiveRatio.activePercentage * 100).toFixed(0)}% active methods`,
      specificActions: [
        'After reading a section, close the book and write what you remember',
        'Replace re-reading with self-quizzing',
        'Do practice problems without looking at solutions first'
      ],
      expectedImpact: 'high'
    })

  // Priority 3: Implement spacing
  IF spacingScore.score < 50:
    recommendations.push({
      priority: 2,
      category: 'scheduling',
      recommendation: 'Implement spaced repetition schedule',
      reason: 'No systematic review schedule detected',
      specificActions: [
        'After learning new material, schedule review for next day',
        'Second review at 3 days',
        'Third review at 7 days',
        'Fourth review at 14 days'
      ],
      expectedImpact: 'high'
    })

  // Priority 4: Address high-severity red flags
  highFlags = redFlags.filter(f => f.severity == 'high')
  FOR EACH flag IN highFlags:
    recommendations.push({
      priority: 2,
      category: 'habit_correction',
      recommendation: flag.fix,
      reason: flag.issue,
      expectedImpact: 'medium-high'
    })

  // Priority 5: Optimize techniques based on goals
  IF goals:
    FOR EACH goal IN goals:
      recommendations.push({
        priority: 3,
        category: 'optimization',
        recommendation: recommendForGoal(goal),
        reason: `To achieve goal: ${goal}`,
        expectedImpact: 'medium'
      })

  RETURN recommendations

// Helper: Create Action Plan
FUNCTION createActionPlan(recommendations, constraints):
  // Sort recommendations by priority
  SORT recommendations BY priority ASC

  plan = {
    immediate: [], // This week
    shortTerm: [], // Next 2-4 weeks
    longTerm: [] // Ongoing habits
  }

  // Immediate actions: Top priority items
  immediateRecs = recommendations.filter(r => r.priority == 1)
  plan.immediate = immediateRecs.map(r => ({
    action: r.recommendation,
    reason: r.reason,
    howTo: r.specificActions OR generateHowTo(r.recommendation),
    timeframe: 'Start this week'
  }))

  // Short-term: Build on immediate changes
  shortTermRecs = recommendations.filter(r => r.priority == 2)
  plan.shortTerm = shortTermRecs.map(r => ({
    action: r.recommendation,
    reason: r.reason,
    howTo: r.specificActions OR generateHowTo(r.recommendation),
    timeframe: 'Implement over next 2-4 weeks'
  }))

  // Long-term: Optimize and maintain
  longTermRecs = recommendations.filter(r => r.priority == 3)
  plan.longTerm = longTermRecs.map(r => ({
    action: r.recommendation,
    reason: r.reason,
    howTo: r.specificActions OR generateHowTo(r.recommendation),
    timeframe: 'Ongoing habit'
  }))

  // Add follow-up checkpoints
  plan.checkpoints = [
    { when: '1 week', check: 'Are you using active recall methods?' },
    { when: '2 weeks', check: 'Have you stuck to your review schedule?' },
    { when: '1 month', check: 'Compare performance to baseline' }
  ]

  RETURN plan
```

### Example Input
```javascript
{
  currentHabits: "I usually read my textbook and highlight important parts. Sometimes I reread my notes before exams. I try to study every day but it depends on my schedule. I don't really review old material, just keep moving forward.",
  weeklySchedule: [
    {
      day: 'Monday',
      studyBlocks: [
        { startTime: '19:00', duration: 90, activity: 'Read Chapter 5' }
      ]
    },
    {
      day: 'Tuesday',
      studyBlocks: [
        { startTime: '19:00', duration: 90, activity: 'Read Chapter 6' }
      ]
    }
  ],
  performanceMetrics: {
    testScores: [65, 70, 68, 72],
    hoursStudied: [12, 14, 15, 13],
    subjectiveRetention: 4
  },
  goals: ['Get above 80% on exams', 'Spend less time studying'],
  constraints: ['Busy schedule with classes and work']
}
```

### Example Output
```javascript
{
  analysis: {
    activePassiveRatio: {
      ratio: '0:3',
      assessment: 'poor',
      activePercentage: 0,
      activeMethods: [],
      passiveMethods: ['reading', 'highlighting', 'reviewing notes passively']
    },
    spacingScore: {
      score: 0,
      assessment: 'poor',
      hasRegularReview: false,
      hasSpacing: false,
      description: 'No evidence of review or spaced repetition. Material studied once and not revisited.'
    },
    efficiency: {
      score: 0.52,
      assessment: 'low',
      avgTestScore: 68.75,
      avgHoursPerWeek: 13.5,
      interpretation: 'Spending significant time studying (13.5 hrs/week) but achieving below-target scores (69%). This suggests inefficient study methods rather than lack of effort.'
    },
    redFlags: [
      {
        severity: 'critical',
        issue: 'No active learning methods detected',
        impact: 'Retention and understanding will be significantly impaired',
        fix: 'Introduce active recall immediately'
      },
      {
        severity: 'high',
        issue: 'No review of previously studied material',
        impact: 'Forgetting curve will erase 70-90% of material within a week',
        fix: 'Schedule reviews at 1, 3, 7, and 14 days after initial learning'
      },
      {
        severity: 'medium',
        issue: 'Relying on highlighting',
        impact: 'Creates illusion of productivity with minimal learning benefit',
        fix: 'Replace highlighting with active recall or question generation'
      },
      {
        severity: 'medium',
        issue: 'Re-reading as primary study method',
        impact: 'Creates familiarity (recognition) but not recall ability',
        fix: 'Read once carefully, then use active recall instead of re-reading'
      }
    ]
  },

  recommendations: [
    {
      priority: 1,
      category: 'critical_fix',
      recommendation: 'Introduce active recall immediately',
      reason: 'No active learning methods detected',
      specificActions: [
        'After reading a section, close the book and write what you remember',
        'Test yourself with questions before looking at answers',
        'Explain concepts out loud as if teaching someone'
      ],
      expectedImpact: 'high',
      estimatedImprovement: '+15-20% on test scores'
    },
    {
      priority: 1,
      category: 'study_methods',
      recommendation: 'Shift to 80% active learning methods',
      reason: 'Currently 0% active methods',
      specificActions: [
        'After reading a section, close the book and write what you remember',
        'Replace re-reading with self-quizzing',
        'Do practice problems without looking at solutions first'
      ],
      expectedImpact: 'high'
    },
    {
      priority: 2,
      category: 'scheduling',
      recommendation: 'Implement spaced repetition schedule',
      reason: 'No systematic review schedule detected',
      specificActions: [
        'After learning new material, schedule review for next day',
        'Second review at 3 days',
        'Third review at 7 days',
        'Fourth review at 14 days'
      ],
      expectedImpact: 'high',
      estimatedImprovement: 'Will reduce forgetting from 90% to <20% by exam time'
    },
    {
      priority: 3,
      category: 'optimization',
      recommendation: 'Replace reading time with practice testing',
      reason: 'To achieve goal: Get above 80% on exams',
      expectedImpact: 'medium'
    }
  ],

  actionPlan: {
    immediate: [
      {
        action: 'Introduce active recall immediately',
        reason: 'No active learning methods detected',
        howTo: [
          'Tonight: After reading next section, close book and write everything you remember',
          'Compare what you wrote to the actual content',
          'Focus next study session on what you missed',
          'Repeat this process for all new material'
        ],
        timeframe: 'Start this week'
      },
      {
        action: 'Stop highlighting, start questioning',
        reason: 'Highlighting provides minimal learning benefit',
        howTo: [
          'As you read, write questions in margin instead of highlighting',
          'After reading, answer those questions from memory',
          'Use questions as review material'
        ],
        timeframe: 'Start this week'
      }
    ],

    shortTerm: [
      {
        action: 'Implement spaced repetition schedule',
        reason: 'Currently no review of old material',
        howTo: [
          'Create calendar with review dates',
          'For material studied today, mark reviews for: tomorrow, +3 days, +7 days, +14 days',
          'Each review: 15 min active recall session',
          'Adjust intervals based on how well you remember'
        ],
        timeframe: 'Implement over next 2-4 weeks'
      },
      {
        action: 'Break 90-min sessions into Pomodoros',
        reason: 'Long sessions decrease efficiency',
        howTo: [
          'Use 25-min focused blocks with 5-min breaks',
          'Instead of 90-min reading session, do: 25 read + 5 break + 25 active recall + 5 break + 25 practice problems',
          'Track which blocks are most productive'
        ],
        timeframe: 'Implement over next 2 weeks'
      }
    ],

    longTerm: [
      {
        action: 'Maintain 80:20 active:passive ratio',
        reason: 'Sustainable efficiency for achieving 80%+ scores',
        howTo: [
          'Track weekly: hours spent on active vs passive methods',
          'Target: 10 hours active, 3 hours passive (based on current 13 hrs/week)',
          'Active = recall, practice problems, explaining',
          'Passive = reading, watching lectures (first time only)'
        ],
        timeframe: 'Ongoing habit'
      }
    ],

    checkpoints: [
      { when: '1 week', check: 'Are you using active recall methods? Did you close the book and test yourself?' },
      { when: '2 weeks', check: 'Have you stuck to your review schedule? Are reviews getting easier?' },
      { when: '1 month', check: 'Compare next test score to baseline (current avg: 69%). Target: 75%+' }
    ]
  },

  expectedImprovement: {
    timeline: 'Within 4 weeks',
    testScores: {
      current: 68.75,
      projected: 82,
      reasoning: 'Active recall (+10-15%), spaced repetition (+8-10%), better use of same study time'
    },
    timeEfficiency: {
      current: '13.5 hrs/week for 69% avg',
      projected: '10-11 hrs/week for 80%+ avg',
      reasoning: 'Active methods achieve more per hour; eliminate low-value highlighting and re-reading'
    },
    retention: {
      current: 'Subjective rating: 4/10',
      projected: '7-8/10',
      reasoning: 'Spaced repetition prevents forgetting; active recall strengthens retrieval pathways'
    }
  },

  keyInsights: [
    'Your effort (13.5 hrs/week) is good. The problem is method efficiency, not effort.',
    'All current methods are passive (reading, highlighting). Switching to active methods could increase performance by 15-20% with LESS time.',
    'No review schedule means you\'re forgetting 70-90% of material. This forces re-learning before exams (inefficient cramming).',
    'Good news: These are fixable problems with immediate-impact solutions.'
  ],

  priorityAction: {
    single Most ImportantChange: 'Start using active recall after every study session',
    whyThisOne: 'Biggest bang for buck. Takes no extra time, but dramatically improves retention and reveals gaps.',
    howToStart: 'Tonight, after your next reading session, close the book and write everything you remember. That\'s it. Do this every session.',
    expectedResult: 'Within 1-2 weeks, you\'ll notice you remember material better and identify weak areas faster.'
  }
}
```

---

## Pattern 6: Energy-Task Matcher

**Purpose**: Optimize daily schedule by matching task difficulty to energy levels

### Input Parameters
```typescript
interface EnergyTaskInput {
  dailySchedule: Array<{
    timeBlock: string; // e.g., "09:00-10:00"
    currentActivity?: string;
    isFixed: boolean; // can't be changed (class, work, etc.)
  }>;
  energyPattern: 'morning_person' | 'night_owl' | 'consistent' | 'custom';
  customEnergyLevels?: Array<{
    timeBlock: string;
    energyLevel: 'high' | 'medium' | 'low';
  }>;
  taskList: Array<{
    name: string;
    subject: string;
    difficulty: 'high' | 'medium' | 'low';
    estimatedDuration: number; // minutes
    deadline?: Date;
    type: 'study' | 'practice' | 'review' | 'admin';
  }>;
}
```

### Algorithm

```
FUNCTION matchEnergyToTasks(input):

  // Step 1: Determine energy curve for the day
  energyCurve = generateEnergyCurve(input.energyPattern, input.customEnergyLevels)

  // Step 2: Identify available time blocks
  availableBlocks = input.dailySchedule.filter(block => NOT block.isFixed)

  // Step 3: Add energy levels to available blocks
  FOR EACH block IN availableBlocks:
    block.energyLevel = energyCurve[block.timeBlock]

  // Step 4: Sort tasks by priority
  prioritizedTasks = prioritizeTasks(input.taskList)

  // Step 5: Match tasks to optimal time blocks
  schedule = matchTasksToBlocks(prioritizedTasks, availableBlocks)

  // Step 6: Validate and optimize
  schedule = validateSchedule(schedule, input.taskList)

  RETURN schedule

// Helper: Generate Energy Curve
FUNCTION generateEnergyCurve(pattern, customLevels):
  IF pattern == 'custom' AND customLevels:
    RETURN customLevels.reduce((curve, level) => {
      curve[level.timeBlock] = level.energyLevel
      RETURN curve
    }, {})

  // Standard patterns
  curves = {
    'morning_person': {
      '06:00-08:00': 'medium',
      '08:00-12:00': 'high',
      '12:00-14:00': 'low',     // post-lunch dip
      '14:00-17:00': 'medium',
      '17:00-19:00': 'low',
      '19:00-21:00': 'medium',
      '21:00-23:00': 'low'
    },
    'night_owl': {
      '06:00-08:00': 'low',
      '08:00-12:00': 'medium',
      '12:00-14:00': 'low',     // post-lunch dip
      '14:00-17:00': 'medium',
      '17:00-19:00': 'medium',
      '19:00-21:00': 'high',    // evening peak
      '21:00-23:00': 'high'
    },
    'consistent': {
      '06:00-08:00': 'medium',
      '08:00-12:00': 'medium',
      '12:00-14:00': 'low',     // post-lunch dip
      '14:00-17:00': 'medium',
      '17:00-19:00': 'medium',
      '19:00-21:00': 'medium',
      '21:00-23:00': 'low'
    }
  }

  RETURN curves[pattern]

// Helper: Prioritize Tasks
FUNCTION prioritizeTasks(taskList):
  FOR EACH task IN taskList:
    // Calculate priority score
    score = 0

    // Deadline urgency
    IF task.deadline:
      daysUntil = (task.deadline - TODAY) / (1000 * 60 * 60 * 24)
      IF daysUntil <= 1:
        score += 100
      ELSE IF daysUntil <= 3:
        score += 70
      ELSE IF daysUntil <= 7:
        score += 40
      ELSE:
        score += 20

    // Difficulty weight (harder = slightly higher priority to ensure good time slot)
    IF task.difficulty == 'high':
      score += 15
    ELSE IF task.difficulty == 'medium':
      score += 10
    ELSE:
      score += 5

    // Type weight (study > practice > review > admin)
    typeWeights = { 'study': 15, 'practice': 12, 'review': 8, 'admin': 3 }
    score += typeWeights[task.type]

    task.priorityScore = score

  SORT taskList BY priorityScore DESC
  RETURN taskList

// Helper: Match Tasks to Blocks
FUNCTION matchTasksToBlocks(tasks, blocks):
  schedule = []
  usedBlocks = []

  FOR EACH task IN tasks:
    // Find best block for this task
    bestBlock = findBestBlock(task, blocks, usedBlocks)

    IF bestBlock:
      schedule.push({
        timeBlock: bestBlock.timeBlock,
        energyLevel: bestBlock.energyLevel,
        task: task,
        match Quality: assessMatch(task.difficulty, bestBlock.energyLevel)
      })

      usedBlocks.push(bestBlock)
    ELSE:
      // No suitable block found
      schedule.push({
        task: task,
        warning: 'No available time block found',
        suggestion: 'Consider extending study time or moving deadline'
      })

  RETURN schedule

// Helper: Find Best Block
FUNCTION findBestBlock(task, allBlocks, usedBlocks):
  availableBlocks = allBlocks.filter(block => NOT usedBlocks.includes(block))

  IF availableBlocks.length == 0:
    RETURN null

  // Match task difficulty to energy level
  idealMatches = {
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
  }

  // First, try to find ideal match
  idealBlock = availableBlocks.find(block => block.energyLevel == idealMatches[task.difficulty])

  IF idealBlock:
    RETURN idealBlock

  // Second, try acceptable matches
  acceptableMatches = {
    'high': ['high', 'medium'],       // high-difficulty task can work with medium energy
    'medium': ['high', 'medium', 'low'], // medium-difficulty is flexible
    'low': ['medium', 'low', 'high']  // low-difficulty works anywhere
  }

  acceptableBlock = availableBlocks.find(block =>
    acceptableMatches[task.difficulty].includes(block.energyLevel)
  )

  IF acceptableBlock:
    RETURN acceptableBlock

  // Last resort: return first available
  RETURN availableBlocks[0]

// Helper: Assess Match Quality
FUNCTION assessMatch(taskDifficulty, blockEnergy):
  matchMatrix = {
    'high': { 'high': 'optimal', 'medium': 'acceptable', 'low': 'poor' },
    'medium': { 'high': 'optimal', 'medium': 'optimal', 'low': 'acceptable' },
    'low': { 'high': 'overkill', 'medium': 'optimal', 'low': 'optimal' }
  }

  RETURN matchMatrix[taskDifficulty][blockEnergy]

// Helper: Validate Schedule
FUNCTION validateSchedule(schedule, originalTasks):
  validation = {
    scheduledTasks: schedule.filter(s => s.task).length,
    totalTasks: originalTasks.length,
    unscheduled: originalTasks.length - schedule.filter(s => s.task).length,
    warnings: []
  }

  // Check for poor matches
  poorMatches = schedule.filter(s => s.matchQuality == 'poor')
  IF poorMatches.length > 0:
    validation.warnings.push({
      type: 'suboptimal_matching',
      message: `${poorMatches.length} high-difficulty tasks scheduled during low-energy periods`,
      recommendation: 'Consider adjusting schedule or splitting tasks'
    })

  // Check for unscheduled high-priority tasks
  unscheduledHighPriority = schedule.filter(s => s.warning AND s.task.priorityScore > 80)
  IF unscheduledHighPriority.length > 0:
    validation.warnings.push({
      type: 'missing_critical_tasks',
      message: `${unscheduledHighPriority.length} high-priority tasks could not be scheduled`,
      recommendation: 'Need to find additional study time or adjust deadlines'
    })

  schedule.validation = validation
  RETURN schedule
```

### Example Input & Output

Due to the length of this document, the complete example for Pattern 6 with full input/output is available upon request. The algorithm above provides the complete implementation logic.

---

## Usage Notes for LLM Agents

1. **Patterns are templates**: Adapt them to specific student contexts
2. **Combine patterns**: Often multiple patterns work together (e.g., Session Designer + Technique Recommender)
3. **Iterate**: Use outputs as inputs for refinement
4. **Explain logic**: When presenting recommendations, explain the reasoning
5. **Measure outcomes**: Suggest tracking metrics to validate pattern effectiveness

---

**Document version**: 1.0
**Last updated**: 2025-12-19
**Integration**: Use with decision-trees.md for problem-solving flows, key-concepts-summary.md for technique definitions
