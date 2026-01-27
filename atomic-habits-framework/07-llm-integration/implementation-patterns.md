# Implementation Patterns - Atomic Habits Framework

## Overview

This document provides reusable implementation patterns for building habit-related features. Each pattern includes:
- **Purpose**: What the pattern does
- **When to use**: Appropriate scenarios
- **Input requirements**: What data is needed
- **Algorithm**: Step-by-step logic (pseudocode)
- **Output**: What the pattern produces
- **Example**: Concrete implementation

---

## Pattern 1: Habit Stack Builder

### Purpose
Chains a new habit to an existing reliable habit using the formula: "After [CURRENT HABIT], I will [NEW HABIT]"

### When to Use
- User wants to build a new habit but doesn't have a specific time/place trigger
- User already has consistent daily routines
- Want to leverage existing habits as anchors

### Input Requirements
```typescript
interface HabitStackInput {
  newHabit: string;              // The habit to build
  userDailyRoutines: string[];   // List of things user does daily
  timing?: 'morning' | 'afternoon' | 'evening' | 'any';
  duration?: number;             // How long new habit takes (minutes)
}
```

### Algorithm

```pseudocode
FUNCTION buildHabitStack(input: HabitStackInput) -> HabitStack

  // Step 1: Score existing routines for stability
  stableRoutines = []
  FOR EACH routine IN input.userDailyRoutines
    score = calculateStabilityScore(routine)
    IF score >= STABILITY_THRESHOLD
      stableRoutines.add(routine, score)

  // Step 2: Filter by timing if specified
  IF input.timing != null
    stableRoutines = filterByTimeOfDay(stableRoutines, input.timing)

  // Step 3: Find optimal anchor
  sortedRoutines = sortByScore(stableRoutines, descending)

  FOR EACH routine IN sortedRoutines
    // Check if timing makes sense
    IF timingConflict(routine, input.duration)
      CONTINUE

    // Check if context matches
    IF contextMismatch(routine, input.newHabit)
      CONTINUE

    // This is the best anchor
    anchorHabit = routine
    BREAK

  // Step 4: Generate stack formula
  stack = {
    anchor: anchorHabit,
    newHabit: input.newHabit,
    formula: "After [${anchorHabit}], I will [${input.newHabit}]",
    cueType: "action",
    estimatedTime: calculateTotalTime(anchorHabit, input.newHabit)
  }

  // Step 5: Generate implementation plan
  stack.implementationPlan = {
    preparation: generatePrepSteps(input.newHabit),
    firstWeekGoal: applyTwoMinuteRule(input.newHabit),
    environmentSetup: generateEnvironmentCues(anchorHabit, input.newHabit),
    trackingMethod: recommendTracker(input.newHabit)
  }

  RETURN stack

// Helper functions
FUNCTION calculateStabilityScore(routine) -> float
  // Factors: frequency, consistency, automaticity
  frequency = routineFrequency(routine)      // 0-1
  consistency = routineConsistency(routine)  // 0-1
  automaticity = routineAutomaticity(routine) // 0-1

  RETURN (frequency * 0.4 + consistency * 0.4 + automaticity * 0.2)

FUNCTION contextMismatch(anchor, newHabit) -> boolean
  // Check if contexts are incompatible
  anchorContext = getContext(anchor)  // e.g., "kitchen", "bedroom", "office"
  newHabitContext = getContext(newHabit)

  IF anchorContext != newHabitContext AND requiresSameLocation(newHabit)
    RETURN true

  RETURN false

FUNCTION applyTwoMinuteRule(habit) -> string
  // Reduce habit to 2-minute version
  IF estimatedDuration(habit) > 2
    RETURN scaleDown(habit, targetDuration: 2)
  RETURN habit
```

### Output

```typescript
interface HabitStack {
  anchor: string;
  newHabit: string;
  formula: string;
  cueType: 'action' | 'time' | 'location';
  estimatedTime: number;
  implementationPlan: {
    preparation: string[];
    firstWeekGoal: string;
    environmentSetup: string[];
    trackingMethod: string;
  };
  confidence: number;  // 0-1 score of how likely this will work
}
```

### Example

**Input:**
```json
{
  "newHabit": "meditate for 5 minutes",
  "userDailyRoutines": [
    "wake up at 6:30 AM",
    "pour morning coffee",
    "check email",
    "brush teeth",
    "shower"
  ],
  "timing": "morning"
}
```

**Output:**
```json
{
  "anchor": "pour morning coffee",
  "newHabit": "meditate for 5 minutes",
  "formula": "After I pour my morning coffee, I will meditate for 5 minutes.",
  "cueType": "action",
  "estimatedTime": 7,
  "implementationPlan": {
    "preparation": [
      "Set up meditation cushion in visible location",
      "Download meditation app",
      "Choose meditation spot near coffee area"
    ],
    "firstWeekGoal": "Sit on meditation cushion for 1 minute (two-minute rule)",
    "environmentSetup": [
      "Place meditation cushion next to coffee maker",
      "Set out meditation app on phone",
      "Remove distractions from meditation area"
    ],
    "trackingMethod": "Mark calendar after each session"
  },
  "confidence": 0.87
}
```

---

## Pattern 2: Environment Audit

### Purpose
Analyzes a physical or digital space to identify cues that trigger habits (good and bad) and friction points that help or hinder habits.

### When to Use
- User wants to optimize their environment for habits
- User struggling with bad habits triggered by environment
- Setting up new space (moving, new office, etc.)
- Comprehensive habit system setup

### Input Requirements

```typescript
interface EnvironmentAuditInput {
  spaceType: 'bedroom' | 'kitchen' | 'office' | 'living_room' | 'digital' | 'car' | 'other';
  goodHabits: Habit[];    // Habits to encourage
  badHabits: Habit[];     // Habits to discourage
  photos?: string[];      // Optional: photos of space
  inventory?: string[];   // List of items in space
}

interface Habit {
  name: string;
  frequency: string;
  triggers: string[];
}
```

### Algorithm

```pseudocode
FUNCTION auditEnvironment(input: EnvironmentAuditInput) -> EnvironmentReport

  report = {
    space: input.spaceType,
    findings: {
      positive: [],    // Things supporting good habits
      negative: [],    // Things enabling bad habits
      missing: [],     // Cues needed but absent
      excessive: []    // Friction needed but absent
    },
    recommendations: []
  }

  // Step 1: Analyze current cues
  FOR EACH item IN input.inventory
    // Check if item cues good habits
    FOR EACH goodHabit IN input.goodHabits
      IF itemCuesHabit(item, goodHabit)
        report.findings.positive.add({
          item: item,
          habit: goodHabit.name,
          cueType: determineCueType(item),
          visibility: assessVisibility(item, input.photos)
        })

    // Check if item cues bad habits
    FOR EACH badHabit IN input.badHabits
      IF itemCuesHabit(item, badHabit)
        report.findings.negative.add({
          item: item,
          habit: badHabit.name,
          cueType: determineCueType(item),
          visibility: assessVisibility(item, input.photos),
          urgency: calculateRemovalUrgency(badHabit)
        })

  // Step 2: Identify missing cues for good habits
  FOR EACH goodHabit IN input.goodHabits
    requiredCues = getRequiredCues(goodHabit, input.spaceType)
    presentCues = getCuesInSpace(goodHabit, input.inventory)

    FOR EACH cue IN requiredCues
      IF cue NOT IN presentCues
        report.findings.missing.add({
          habit: goodHabit.name,
          missingCue: cue,
          priority: calculateCuePriority(goodHabit, cue)
        })

  // Step 3: Identify insufficient friction for bad habits
  FOR EACH badHabit IN input.badHabits
    currentFriction = assessFrictionLevel(badHabit, input.inventory)
    optimalFriction = getOptimalFriction(badHabit)

    IF currentFriction < optimalFriction
      report.findings.excessive.add({
        habit: badHabit.name,
        currentFriction: currentFriction,
        recommendedFriction: optimalFriction,
        gap: optimalFriction - currentFriction
      })

  // Step 4: Generate prioritized recommendations
  recommendations = []

  // Quick wins (high impact, low effort)
  recommendations.add(generateQuickWins(report.findings))

  // Cue additions for good habits
  FOR EACH missing IN report.findings.missing
    recommendations.add({
      action: "ADD_CUE",
      habit: missing.habit,
      what: missing.missingCue,
      where: determineOptimalPlacement(missing.missingCue, input.spaceType),
      why: explainBenefit(missing.habit),
      effort: estimateEffort("add", missing.missingCue),
      impact: missing.priority
    })

  // Cue removals for bad habits
  FOR EACH negative IN report.findings.negative
    recommendations.add({
      action: "REMOVE_CUE",
      habit: negative.habit,
      what: negative.item,
      alternatives: suggestAlternatives(negative.item),
      why: explainHarm(negative.habit),
      effort: estimateEffort("remove", negative.item),
      impact: negative.urgency
    })

  // Friction adjustments
  FOR EACH excessive IN report.findings.excessive
    recommendations.add({
      action: "ADD_FRICTION",
      habit: excessive.habit,
      currentSteps: countSteps(excessive.habit),
      recommendedSteps: calculateTargetSteps(excessive.habit),
      strategies: generateFrictionStrategies(excessive.habit),
      effort: estimateEffort("add_friction", excessive.habit),
      impact: excessive.gap
    })

  // Sort by impact/effort ratio
  report.recommendations = sortByPriority(recommendations)

  // Step 5: Create implementation timeline
  report.timeline = createImplementationTimeline(report.recommendations)

  RETURN report

// Helper Functions
FUNCTION itemCuesHabit(item, habit) -> boolean
  // Check if item triggers habit
  FOR EACH trigger IN habit.triggers
    IF item MATCHES trigger
      RETURN true
  RETURN false

FUNCTION assessVisibility(item, photos) -> 'high' | 'medium' | 'low'
  // Determine how visible item is in space
  IF photos.length > 0
    RETURN analyzePhotoVisibility(item, photos)
  ELSE
    RETURN 'medium'  // Default assumption

FUNCTION calculateRemovalUrgency(habit) -> float
  // Factors: frequency, harm, user's priority
  frequency = habit.frequency
  harm = estimateHarm(habit)
  priority = habit.userPriority || 0.5

  RETURN (frequency * 0.4 + harm * 0.4 + priority * 0.2)

FUNCTION generateQuickWins(findings) -> Recommendation[]
  quickWins = []

  FOR EACH finding IN getAllFindings(findings)
    effort = estimateEffort(finding.action, finding.item)
    impact = finding.priority || finding.urgency

    IF effort < 0.3 AND impact > 0.7  // Low effort, high impact
      quickWins.add(createRecommendation(finding, priority: "QUICK_WIN"))

  RETURN quickWins

FUNCTION createImplementationTimeline(recommendations) -> Timeline
  timeline = {
    immediate: [],   // Do today
    thisWeek: [],    // Do this week
    thisMonth: [],   // Do this month
    ongoing: []      // Maintain long-term
  }

  FOR EACH rec IN recommendations
    IF rec.effort < 0.2 AND rec.impact > 0.8
      timeline.immediate.add(rec)
    ELSE IF rec.effort < 0.5
      timeline.thisWeek.add(rec)
    ELSE IF rec.effort < 0.8
      timeline.thisMonth.add(rec)
    ELSE
      timeline.ongoing.add(rec)

  RETURN timeline
```

### Output

```typescript
interface EnvironmentReport {
  space: string;
  findings: {
    positive: PositiveFinding[];
    negative: NegativeFinding[];
    missing: MissingCue[];
    excessive: FrictionGap[];
  };
  recommendations: Recommendation[];
  timeline: {
    immediate: Recommendation[];
    thisWeek: Recommendation[];
    thisMonth: Recommendation[];
    ongoing: Recommendation[];
  };
  summary: {
    totalFindings: number;
    criticalIssues: number;
    estimatedImpact: string;
  };
}
```

### Example

**Input:**
```json
{
  "spaceType": "bedroom",
  "goodHabits": [
    {
      "name": "read before bed",
      "frequency": "nightly",
      "triggers": ["book", "reading light", "nightstand"]
    },
    {
      "name": "morning meditation",
      "frequency": "daily",
      "triggers": ["meditation cushion", "quiet space"]
    }
  ],
  "badHabits": [
    {
      "name": "scroll phone in bed",
      "frequency": "nightly",
      "triggers": ["phone", "charger by bed"]
    }
  ],
  "inventory": ["bed", "phone charger", "TV", "laptop", "clothes on floor"]
}
```

**Output:**
```json
{
  "space": "bedroom",
  "findings": {
    "positive": [],
    "negative": [
      {
        "item": "phone charger",
        "habit": "scroll phone in bed",
        "cueType": "object",
        "visibility": "high",
        "urgency": 0.9
      },
      {
        "item": "TV",
        "habit": "watch TV instead of sleep",
        "cueType": "object",
        "visibility": "high",
        "urgency": 0.7
      }
    ],
    "missing": [
      {
        "habit": "read before bed",
        "missingCue": "book on nightstand",
        "priority": 0.95
      },
      {
        "habit": "morning meditation",
        "missingCue": "meditation cushion",
        "priority": 0.85
      }
    ],
    "excessive": [
      {
        "habit": "scroll phone in bed",
        "currentFriction": 0.1,
        "recommendedFriction": 0.8,
        "gap": 0.7
      }
    ]
  },
  "recommendations": [
    {
      "action": "REMOVE_CUE",
      "habit": "scroll phone in bed",
      "what": "phone charger",
      "where": "Move to different room",
      "why": "Removes temptation to use phone in bed, improves sleep quality",
      "effort": 0.1,
      "impact": 0.9,
      "priority": "QUICK_WIN"
    },
    {
      "action": "ADD_CUE",
      "habit": "read before bed",
      "what": "book and reading light",
      "where": "Place on nightstand where phone charger currently is",
      "why": "Creates visual cue and reduces friction for reading habit",
      "effort": 0.15,
      "impact": 0.85,
      "priority": "QUICK_WIN"
    }
  ],
  "timeline": {
    "immediate": [
      "Move phone charger to living room",
      "Place book on nightstand"
    ],
    "thisWeek": [
      "Purchase meditation cushion",
      "Set up meditation corner",
      "Consider removing TV or adding cabinet to hide it"
    ],
    "thisMonth": [],
    "ongoing": [
      "Keep bedroom optimized for sleep and morning routine",
      "Regular monthly audit"
    ]
  }
}
```

---

## Pattern 3: Identity Script Generator

### Purpose
Generates identity-based affirmations and reframes habits as evidence of desired identity.

### When to Use
- User's habits conflict with their self-image
- Need motivation boost
- Starting identity-first habit design
- Overcoming "I'm not that type of person" resistance

### Input Requirements

```typescript
interface IdentityScriptInput {
  desiredOutcome: string;
  currentHabits: string[];
  desiredIdentity?: string;  // Optional, can be inferred
  currentIdentity?: string;  // How they currently see themselves
}
```

### Algorithm

```pseudocode
FUNCTION generateIdentityScript(input: IdentityScriptInput) -> IdentityScript

  script = {
    targetIdentity: "",
    currentToTarget: {},
    habitEvidence: [],
    affirmations: [],
    reframes: []
  }

  // Step 1: Determine target identity
  IF input.desiredIdentity != null
    script.targetIdentity = input.desiredIdentity
  ELSE
    // Infer from desired outcome
    script.targetIdentity = inferIdentity(input.desiredOutcome)

  // Step 2: Map current identity to target
  IF input.currentIdentity != null
    script.currentToTarget = {
      from: input.currentIdentity,
      to: script.targetIdentity,
      gap: analyzeIdentityGap(input.currentIdentity, script.targetIdentity),
      bridgeSteps: generateBridgeSteps(input.currentIdentity, script.targetIdentity)
    }

  // Step 3: Frame habits as identity evidence
  FOR EACH habit IN input.currentHabits
    evidence = {
      habit: habit,
      statement: "Every time I [${habit}], I cast a vote for being [${script.targetIdentity}]",
      frequency: determineFrequency(habit),
      impactLevel: calculateIdentityImpact(habit, script.targetIdentity)
    }
    script.habitEvidence.add(evidence)

  // Step 4: Generate affirmations
  script.affirmations = [
    // Primary affirmation
    "I am the type of person who ${extractCoreAction(script.targetIdentity)}",

    // Supporting affirmations
    "I am becoming more ${extractQuality(script.targetIdentity)} every day",

    // Habit-specific affirmations
    FOR EACH habit IN input.currentHabits
      "I am someone who ${habit} consistently"
  ]

  // Step 5: Create reframes (shift perspective)
  script.reframes = []

  FOR EACH habit IN input.currentHabits
    reframe = {
      original: "I have to ${habit}",
      reframed: "I get to ${habit} because I'm ${script.targetIdentity}",
      mindsetShift: "From obligation to opportunity"
    }
    script.reframes.add(reframe)

    // Add identity-first reframe
    identityReframe = {
      original: "I want to ${habit}",
      reframed: "${script.targetIdentity} ${habit}. I am ${script.targetIdentity}.",
      mindsetShift: "From desire to identity"
    }
    script.reframes.add(identityReframe)

  // Step 6: Create micro-identity milestones
  script.milestones = generateMilestones(script.targetIdentity, input.currentHabits)

  RETURN script

// Helper Functions
FUNCTION inferIdentity(outcome) -> string
  // Map outcomes to identities
  identityMap = {
    "lose weight": "healthy person",
    "get fit": "athlete",
    "write book": "writer",
    "learn language": "polyglot",
    "save money": "financially responsible person",
    "wake up early": "morning person"
  }

  FOR EACH key IN identityMap.keys()
    IF outcome.contains(key)
      RETURN identityMap[key]

  // Default: extract noun from outcome
  RETURN extractIdentityFromGoal(outcome)

FUNCTION analyzeIdentityGap(current, target) -> object
  RETURN {
    beliefs: compareBeliefs(current, target),
    behaviors: compareBehaviors(current, target),
    distance: calculateDistance(current, target)  // 0-1
  }

FUNCTION generateBridgeSteps(current, target) -> string[]
  steps = []

  // Create progression from current to target
  IF distance(current, target) > 0.7  // Large gap
    // Add intermediate identities
    intermediates = findIntermediateIdentities(current, target)
    FOR EACH intermediate IN intermediates
      steps.add("First become: ${intermediate}")
  ELSE
    // Direct path
    steps.add("Start acting as ${target} would act")

  steps.add("Collect evidence through small habits")
  steps.add("Let identity emerge from consistent actions")

  RETURN steps

FUNCTION generateMilestones(identity, habits) -> Milestone[]
  milestones = []

  // Early milestone (1 week)
  milestones.add({
    timeframe: "1 week",
    criteria: "Complete ${mainHabit} 5 out of 7 days",
    identityLevel: "I'm experimenting with being ${identity}",
    confidence: 0.2
  })

  // Medium milestone (1 month)
  milestones.add({
    timeframe: "1 month",
    criteria: "Maintain 80% consistency",
    identityLevel: "I'm practicing being ${identity}",
    confidence: 0.5
  })

  // Long-term milestone (3 months)
  milestones.add({
    timeframe: "3 months",
    criteria: "Habit is automatic, don't think about it",
    identityLevel: "I am ${identity}",
    confidence: 0.9
  })

  RETURN milestones
```

### Output

```typescript
interface IdentityScript {
  targetIdentity: string;
  currentToTarget: {
    from: string;
    to: string;
    gap: object;
    bridgeSteps: string[];
  };
  habitEvidence: {
    habit: string;
    statement: string;
    frequency: string;
    impactLevel: number;
  }[];
  affirmations: string[];
  reframes: {
    original: string;
    reframed: string;
    mindsetShift: string;
  }[];
  milestones: Milestone[];
}
```

### Example

**Input:**
```json
{
  "desiredOutcome": "write consistently",
  "currentHabits": ["write for 10 minutes daily"],
  "currentIdentity": "someone who wants to write",
  "desiredIdentity": "writer"
}
```

**Output:**
```json
{
  "targetIdentity": "writer",
  "currentToTarget": {
    "from": "someone who wants to write",
    "to": "writer",
    "gap": {
      "distance": 0.6,
      "beliefs": ["Believes in aspiration vs. identity"],
      "behaviors": ["Occasional writing vs. consistent practice"]
    },
    "bridgeSteps": [
      "Start calling yourself a writer",
      "Collect evidence through daily writing",
      "Let identity emerge from actions, not achievements"
    ]
  },
  "habitEvidence": [
    {
      "habit": "write for 10 minutes daily",
      "statement": "Every time I write for 10 minutes, I cast a vote for being a writer",
      "frequency": "daily",
      "impactLevel": 0.9
    }
  ],
  "affirmations": [
    "I am the type of person who writes every day",
    "I am becoming more creative and disciplined every day",
    "I am someone who writes for 10 minutes daily consistently",
    "I am a writer"
  ],
  "reframes": [
    {
      "original": "I have to write for 10 minutes",
      "reframed": "I get to write for 10 minutes because I'm a writer",
      "mindsetShift": "From obligation to opportunity"
    },
    {
      "original": "I want to write",
      "reframed": "Writers write. I am a writer.",
      "mindsetShift": "From desire to identity"
    }
  ],
  "milestones": [
    {
      "timeframe": "1 week",
      "criteria": "Write 10 minutes for 5 out of 7 days",
      "identityLevel": "I'm experimenting with being a writer",
      "confidence": 0.2
    },
    {
      "timeframe": "1 month",
      "criteria": "Maintain 80% consistency",
      "identityLevel": "I'm practicing being a writer",
      "confidence": 0.5
    },
    {
      "timeframe": "3 months",
      "criteria": "Writing is automatic, don't think about it",
      "identityLevel": "I am a writer",
      "confidence": 0.9
    }
  ]
}
```

---

## Pattern 4: Two-Minute Version Creator

### Purpose
Scales down any habit to a 2-minute gateway version that's impossible to say no to.

### When to Use
- User finds habit too difficult
- Starting a new habit
- Recovering from broken streak
- Overcoming resistance and procrastination

### Input Requirements

```typescript
interface TwoMinuteInput {
  originalHabit: string;
  estimatedDuration: number;  // minutes
  difficulty: number;         // 1-10
  context?: string;           // Where/when habit occurs
}
```

### Algorithm

```pseudocode
FUNCTION createTwoMinuteVersion(input: TwoMinuteInput) -> TwoMinuteHabit

  result = {
    original: input.originalHabit,
    twoMinuteVersion: "",
    gatewayVersions: [],
    progressionPath: [],
    rationale: ""
  }

  // Step 1: Parse the habit into components
  components = parseHabit(input.originalHabit)
  // components = {action, object, duration, location, etc.}

  // Step 2: Identify the absolute minimum action
  minimumAction = identifyMinimumAction(components)

  // Step 3: Create progression of gateway versions
  gateways = []

  // Gateway 1: The ritual of showing up (10 seconds)
  gateway1 = {
    version: createShowingUpRitual(components),
    duration: 0.17,  // 10 seconds in minutes
    description: "The ritual of showing up",
    example: generateExample(1, components)
  }
  gateways.add(gateway1)

  // Gateway 2: The first step only (30 seconds)
  gateway2 = {
    version: createFirstStepOnly(components),
    duration: 0.5,  // 30 seconds
    description: "The first step only",
    example: generateExample(2, components)
  }
  gateways.add(gateway2)

  // Gateway 3: The two-minute version (2 minutes)
  gateway3 = {
    version: createTwoMinuteCore(components),
    duration: 2,
    description: "The two-minute complete version",
    example: generateExample(3, components)
  }
  gateways.add(gateway3)

  result.gatewayVersions = gateways
  result.twoMinuteVersion = gateway3.version  // Primary output

  // Step 4: Create full progression path
  result.progressionPath = [
    {
      stage: "Week 1-2",
      version: gateway1.version,
      goal: "Make it a ritual. Show up every day.",
      successMetric: "Complete 10/14 days"
    },
    {
      stage: "Week 3-4",
      version: gateway2.version,
      goal: "Extend slightly. Build consistency.",
      successMetric: "Complete 12/14 days"
    },
    {
      stage: "Week 5-8",
      version: gateway3.version,
      goal: "Reach two-minute version. Lock in habit.",
      successMetric: "Complete 26/28 days"
    },
    {
      stage: "Month 3+",
      version: input.originalHabit,
      goal: "Scale to full version gradually.",
      successMetric: "Habit is automatic"
    }
  ]

  // Step 5: Explain rationale
  result.rationale = generateRationale(input.originalHabit, result.twoMinuteVersion)

  // Step 6: Add motivational framing
  result.mindset = {
    principle: "A habit must be established before it can be improved",
    focus: "Optimize for starting, not finishing",
    mantra: "Show up, even if you just do the minimum"
  }

  RETURN result

// Helper Functions
FUNCTION parseHabit(habitString) -> object
  // Extract components using NLP or pattern matching
  RETURN {
    action: extractAction(habitString),
    object: extractObject(habitString),
    duration: extractDuration(habitString),
    location: extractLocation(habitString),
    intensity: extractIntensity(habitString)
  }

FUNCTION identifyMinimumAction(components) -> string
  // What's the smallest action that counts?
  actionHierarchy = {
    "exercise": ["put on workout clothes", "take out yoga mat", "do 1 rep"],
    "read": ["open book", "read 1 sentence", "read 1 page"],
    "write": ["open document", "write 1 sentence", "write for 2 min"],
    "meditate": ["sit on cushion", "take 3 breaths", "meditate 1 min"],
    "study": ["open textbook", "read 1 paragraph", "study 5 min"]
  }

  FOR EACH action IN actionHierarchy.keys()
    IF components.action.contains(action)
      RETURN actionHierarchy[action][0]  // First/easiest option

  // Default: "Start [original action]"
  RETURN "Start ${components.action}"

FUNCTION createShowingUpRitual(components) -> string
  // 10-second version: just show up to the location/setup
  templates = [
    "Put on ${components.equipment}",
    "Go to ${components.location}",
    "Take out ${components.object}",
    "Open ${components.tool}"
  ]

  RETURN selectBestTemplate(templates, components)

FUNCTION createFirstStepOnly(components) -> string
  // 30-second version: first action only
  templates = [
    "Do one ${components.unit} of ${components.action}",
    "${components.action} for 30 seconds",
    "Complete the first step of ${components.action}"
  ]

  RETURN selectBestTemplate(templates, components)

FUNCTION createTwoMinuteCore(components) -> string
  // 2-minute version: shortened but complete action
  IF components.duration > 2
    scaleFactor = 2 / components.duration
    adjustedIntensity = scaleIntensity(components.intensity, scaleFactor)
    adjustedQuantity = scaleQuantity(components.quantity, scaleFactor)

    RETURN "${components.action} for 2 minutes" OR
           "Do ${adjustedQuantity} ${components.unit}"
  ELSE
    RETURN components.original  // Already 2 minutes or less

FUNCTION generateRationale(original, twoMinute) -> string
  RETURN `
    The two-minute version ("${twoMinute}") is not the goal.
    It's the gateway. Master showing up, then scale up.

    Why this works:
    1. Removes intimidation factor
    2. Makes starting effortless
    3. Builds consistency before intensity
    4. Often, starting leads to continuing
    5. A little bit is infinitely more than nothing
  `
```

### Output

```typescript
interface TwoMinuteHabit {
  original: string;
  twoMinuteVersion: string;
  gatewayVersions: {
    version: string;
    duration: number;
    description: string;
    example: string;
  }[];
  progressionPath: {
    stage: string;
    version: string;
    goal: string;
    successMetric: string;
  }[];
  rationale: string;
  mindset: {
    principle: string;
    focus: string;
    mantra: string;
  };
}
```

### Example

**Input:**
```json
{
  "originalHabit": "run 3 miles",
  "estimatedDuration": 30,
  "difficulty": 7,
  "context": "morning before work"
}
```

**Output:**
```json
{
  "original": "run 3 miles",
  "twoMinuteVersion": "Put on running shoes and step outside",
  "gatewayVersions": [
    {
      "version": "Put on running shoes",
      "duration": 0.17,
      "description": "The ritual of showing up",
      "example": "Every morning, just put on your running shoes. That's it. Even if you don't run."
    },
    {
      "version": "Put on running shoes and step outside",
      "duration": 0.5,
      "description": "The first step only",
      "example": "Get dressed and step outside the door. You can come back immediately."
    },
    {
      "version": "Walk/jog for 2 minutes",
      "duration": 2,
      "description": "The two-minute complete version",
      "example": "Step outside and move for 2 minutes. Can be slow jog or even brisk walk."
    }
  ],
  "progressionPath": [
    {
      "stage": "Week 1-2",
      "version": "Put on running shoes",
      "goal": "Make it a ritual. Show up every day.",
      "successMetric": "Put on shoes 10/14 days"
    },
    {
      "stage": "Week 3-4",
      "version": "Put on running shoes and step outside",
      "goal": "Extend slightly. Build consistency.",
      "successMetric": "Step outside 12/14 days"
    },
    {
      "stage": "Week 5-8",
      "version": "Walk/jog for 2 minutes",
      "goal": "Reach two-minute version. Lock in habit.",
      "successMetric": "Complete 2-min movement 26/28 days"
    },
    {
      "stage": "Month 3+",
      "version": "Gradually increase distance toward 3 miles",
      "goal": "Scale to full version gradually.",
      "successMetric": "Running is automatic, distance increases naturally"
    }
  ],
  "rationale": "The two-minute version ('Walk/jog for 2 minutes') is not the goal. It's the gateway. Master showing up, then scale up.\n\nWhy this works:\n1. Removes intimidation factor (3 miles is daunting, 2 minutes isn't)\n2. Makes starting effortless (easier to convince yourself)\n3. Builds consistency before intensity (habit before performance)\n4. Often, starting leads to continuing (once outside, you'll run longer)\n5. A little bit is infinitely more than nothing (maintains identity as 'runner')",
  "mindset": {
    "principle": "A habit must be established before it can be improved",
    "focus": "Optimize for starting, not finishing",
    "mantra": "Show up, even if you just do the minimum"
  }
}
```

---

## Pattern 5: Temptation Bundle Matcher

### Purpose
Pairs necessary habits with enjoyable activities using the formula: "After [HABIT I NEED], I will [HABIT I WANT]"

### When to Use
- User lacks motivation for necessary habit
- Want to make unappealing habit attractive
- Looking to leverage existing wants
- Combining habits for efficiency

### Input Requirements

```typescript
interface TemptationBundleInput {
  neededHabit: string;        // The habit that needs motivation
  enjoyedActivities: string[]; // Things user already enjoys
  context?: string;            // When/where needed habit occurs
  constraints?: string[];      // Limitations (time, location, etc.)
}
```

### Algorithm

```pseudocode
FUNCTION createTemptationBundle(input: TemptationBundleInput) -> TemptationBundle

  bundle = {
    need: input.neededHabit,
    want: "",
    formula: "",
    feasibility: 0,
    alternatives: [],
    implementation: {}
  }

  // Step 1: Analyze needed habit context
  needContext = analyzeContext(input.neededHabit)
  // {location, duration, movement, attention, resources}

  // Step 2: Score each enjoyed activity for compatibility
  scoredActivities = []

  FOR EACH activity IN input.enjoyedActivities
    activityContext = analyzeContext(activity)

    // Calculate compatibility score
    score = calculateCompatibility(needContext, activityContext, input.constraints)

    IF score > 0.3  // Threshold for minimum viability
      scoredActivities.add({
        activity: activity,
        score: score,
        compatibility: explainCompatibility(needContext, activityContext),
        logistics: analyzeLogistics(input.neededHabit, activity)
      })

  // Sort by compatibility
  scoredActivities = sortByScore(scoredActivities, descending)

  // Step 3: Select best match
  IF scoredActivities.length > 0
    bestMatch = scoredActivities[0]
    bundle.want = bestMatch.activity
    bundle.feasibility = bestMatch.score
    bundle.alternatives = scoredActivities.slice(1, 4)  // Top 3 alternatives
  ELSE
    // No good matches found
    bundle.want = suggestGenericWant(input.neededHabit)
    bundle.feasibility = 0.5
    bundle.alternatives = generateDefaultWants()

  // Step 4: Create formula
  bundle.formula = "After I ${input.neededHabit}, I will ${bundle.want}"

  // Alternative: Combined version
  IF canDoConcurrently(input.neededHabit, bundle.want)
    bundle.formulaAlternative = "While I ${input.neededHabit}, I will ${bundle.want}"

  // Step 5: Implementation plan
  bundle.implementation = {
    setup: generateSetupSteps(input.neededHabit, bundle.want),
    rules: generateRules(input.neededHabit, bundle.want),
    tracking: "Only allow yourself [${bundle.want}] after completing [${input.neededHabit}]",
    commitment: "Never do [${bundle.want}] without first doing [${input.neededHabit}]"
  }

  // Step 6: Add psychological framing
  bundle.mindset = {
    reframe: "You're not 'having to' do [${input.neededHabit}], you're 'getting to' unlock [${bundle.want}]",
    motivation: "The want becomes the reward for the need",
    principle: "Hard work becomes more satisfying when paired with something you enjoy"
  }

  RETURN bundle

// Helper Functions
FUNCTION analyzeContext(habit) -> object
  RETURN {
    location: extractLocation(habit),        // e.g., "gym", "home", "anywhere"
    duration: estimateDuration(habit),       // minutes
    movement: categorizeMovement(habit),     // "sedentary", "light", "vigorous"
    attention: requiredAttention(habit),     // "full", "partial", "minimal"
    resources: requiredResources(habit),     // e.g., ["equipment", "space"]
    timing: optimalTiming(habit)            // "morning", "evening", "flexible"
  }

FUNCTION calculateCompatibility(needContext, wantContext, constraints) -> float
  score = 1.0

  // Location compatibility
  IF needContext.location != wantContext.location AND !locationOverlap(needContext, wantContext)
    score *= 0.3  // Penalty for different locations

  // Attention compatibility (can you do both?)
  IF needContext.attention == "full" AND wantContext.attention == "full"
    score *= 0.2  // Hard to do two high-attention tasks
  ELSE IF needContext.attention == "minimal" AND wantContext.attention == "full"
    score *= 1.2  // Good combination (e.g., walk while listening to audiobook)

  // Movement compatibility
  IF movementConflict(needContext.movement, wantContext.movement)
    score *= 0.4  // Penalty for incompatible movements

  // Duration compatibility
  durationRatio = min(needContext.duration, wantContext.duration) / max(needContext.duration, wantContext.duration)
  score *= (0.7 + 0.3 * durationRatio)  // Prefer similar durations

  // Check constraints
  FOR EACH constraint IN constraints
    IF violatesConstraint(constraint, needContext, wantContext)
      score *= 0.1  // Heavy penalty

  RETURN clamp(score, 0, 1)

FUNCTION explainCompatibility(needContext, wantContext) -> string
  reasons = []

  IF needContext.location == wantContext.location
    reasons.add("Same location - easy to combine")

  IF needContext.attention == "minimal" AND wantContext.attention == "full"
    reasons.add("You can focus on enjoyable activity while doing necessary habit")

  IF durationMatch(needContext, wantContext)
    reasons.add("Similar duration - natural pairing")

  RETURN reasons.join("; ")

FUNCTION canDoConcurrently(need, want) -> boolean
  needCtx = analyzeContext(need)
  wantCtx = analyzeContext(want)

  // Can do simultaneously if:
  // 1. At least one requires minimal attention
  // 2. No movement conflicts
  // 3. Compatible resources

  IF (needCtx.attention != "full" OR wantCtx.attention != "full") AND
     !movementConflict(needCtx.movement, wantCtx.movement) AND
     !resourceConflict(needCtx.resources, wantCtx.resources)
    RETURN true

  RETURN false

FUNCTION suggestGenericWants(need) -> string
  // Universal wants that work with most needs
  genericWants = [
    "listen to favorite music",
    "enjoy favorite beverage",
    "check social media for 5 minutes",
    "text a friend",
    "watch funny video"
  ]

  RETURN selectMostCompatible(genericWants, need)

FUNCTION generateSetupSteps(need, want) -> string[]
  steps = []

  needCtx = analyzeContext(need)
  wantCtx = analyzeContext(want)

  // Preparation steps
  IF needCtx.location == wantCtx.location
    steps.add("Prepare both [${need}] and [${want}] materials in advance")
  ELSE
    steps.add("Set up [${want}] reward in accessible location")

  // Access control
  IF isDigitalActivity(want)
    steps.add("Use app blocker or website blocker to restrict access except after [${need}]")
  ELSE IF isPhysicalReward(want)
    steps.add("Keep [${want}] visible but make it rule: only access after [${need}]")

  // Reminder
  steps.add("Set reminder: 'To access [${want}], first complete [${need}]'")

  RETURN steps
```

### Output

```typescript
interface TemptationBundle {
  need: string;
  want: string;
  formula: string;
  formulaAlternative?: string;  // If can do concurrently
  feasibility: number;           // 0-1
  alternatives: {
    activity: string;
    score: number;
    compatibility: string;
  }[];
  implementation: {
    setup: string[];
    rules: string[];
    tracking: string;
    commitment: string;
  };
  mindset: {
    reframe: string;
    motivation: string;
    principle: string;
  };
}
```

### Example

**Input:**
```json
{
  "neededHabit": "exercise for 30 minutes",
  "enjoyedActivities": [
    "watch Netflix",
    "listen to podcasts",
    "scroll Instagram",
    "call friends"
  ],
  "context": "after work",
  "constraints": ["limited time", "home setting"]
}
```

**Output:**
```json
{
  "need": "exercise for 30 minutes",
  "want": "listen to podcasts",
  "formula": "After I exercise for 30 minutes, I will listen to podcasts",
  "formulaAlternative": "While I exercise for 30 minutes, I will listen to podcasts",
  "feasibility": 0.95,
  "alternatives": [
    {
      "activity": "watch Netflix",
      "score": 0.6,
      "compatibility": "Sequential only; reward after workout"
    },
    {
      "activity": "call friends",
      "score": 0.4,
      "compatibility": "Different attention requirements; difficult to combine"
    }
  ],
  "implementation": {
    "setup": [
      "Download podcast episodes before workout",
      "Set up headphones next to workout clothes",
      "Create 'workout podcasts' playlist with favorite shows"
    ],
    "rules": [
      "Only listen to favorite podcasts during/after exercise",
      "Save best episodes for workout time",
      "If skip workout, no podcast access that day"
    ],
    "tracking": "Only allow yourself podcasts after completing exercise",
    "commitment": "Never listen to podcasts without first exercising (or during exercise)"
  },
  "mindset": {
    "reframe": "You're not 'having to' exercise, you're 'getting to' unlock your favorite podcasts",
    "motivation": "The podcast becomes the reward for the workout",
    "principle": "Exercise becomes more satisfying when paired with something you enjoy"
  }
}
```

---

## Pattern 6: Habit Contract Generator

### Purpose
Creates a formal commitment contract with accountability partners and consequences.

### When to Use
- User needs external accountability
- High-stakes habit (health, career, relationships)
- User has history of breaking commitments to self
- Want to add immediate cost to failure

### Input Requirements

```typescript
interface HabitContractInput {
  habit: string;
  frequency: string;              // "daily", "3x per week", etc.
  startDate: Date;
  partners: string[];             // Names of accountability partners
  consequenceLevel: 'low' | 'medium' | 'high';
  preferredConsequences?: string[];
}
```

### Algorithm

```pseudocode
FUNCTION generateHabitContract(input: HabitContractInput) -> HabitContract

  contract = {
    commitmentStatement: "",
    measurableGoal: "",
    consequences: {},
    partners: [],
    checkInSchedule: {},
    signatureSection: {},
    trackingMethod: ""
  }

  // Step 1: Create clear commitment statement
  contract.commitmentStatement =
    "I, [NAME], commit to ${input.habit} ${input.frequency}, starting ${formatDate(input.startDate)}"

  // Step 2: Define measurable success criteria
  contract.measurableGoal = generateMeasurableCriteria(input.habit, input.frequency)

  // Step 3: Determine consequences based on level
  consequences = []

  SWITCH input.consequenceLevel
    CASE 'low':
      consequences = generateLowConsequences(input.habit)
    CASE 'medium':
      consequences = generateMediumConsequences(input.habit)
    CASE 'high':
      consequences = generateHighConsequences(input.habit)

  // If user provided preferences, prioritize those
  IF input.preferredConsequences != null
    consequences = mergeWithPreferences(consequences, input.preferredConsequences)

  contract.consequences = {
    missOnce: consequences.minor,
    missTwice: consequences.moderate,
    missThreeTimes: consequences.major,
    breakStreak: consequences.reset
  }

  // Step 4: Set up partner structure
  FOR EACH partner IN input.partners
    contract.partners.add({
      name: partner,
      role: "Accountability Partner",
      responsibilities: [
        "Receive daily/weekly check-ins",
        "Verify completion",
        "Enforce consequences if necessary",
        "Provide encouragement"
      ],
      contactMethod: "[To be filled]"
    })

  // Step 5: Create check-in schedule
  contract.checkInSchedule = generateCheckInSchedule(input.frequency)

  // Step 6: Add tracking method
  contract.trackingMethod = recommendTrackingMethod(input.habit, input.frequency)

  // Step 7: Add review and adjustment clause
  contract.reviewClause = {
    frequency: "Every 30 days",
    purpose: "Assess progress and adjust if needed",
    questions: [
      "Is this habit working?",
      "Do consequences need adjustment?",
      "Should habit be modified?"
    ]
  }

  // Step 8: Create signature section
  contract.signatureSection = {
    participant: {
      statement: "I understand this commitment and accept the consequences",
      signature: "[Signature]",
      date: "[Date]"
    },
    partners: input.partners.map(partner => ({
      name: partner,
      statement: "I agree to serve as accountability partner and enforce consequences",
      signature: "[Signature]",
      date: "[Date]"
    }))
  }

  // Step 9: Add motivation section
  contract.whySection = {
    prompt: "Why is this habit important to you?",
    answer: "[To be filled by user]",
    identity: "Who are you becoming by doing this habit?",
    identityAnswer: "[To be filled by user]"
  }

  RETURN contract

// Helper Functions
FUNCTION generateMeasurableCriteria(habit, frequency) -> object
  RETURN {
    specific: makeSpecific(habit),
    measurable: makeMeasurable(habit),
    frequency: frequency,
    minimumSuccess: calculateMinimumSuccess(frequency),
    trackingUnit: determineTrackingUnit(habit)
  }

  // Example: "Exercise" → "Complete 30-minute workout session"
  // Frequency: "5 times per week"
  // Minimum: "80% compliance (4 out of 5 sessions per week)"

FUNCTION generateLowConsequences(habit) -> object
  RETURN {
    minor: "Report failure to accountability partner",
    moderate: "Written reflection on why you missed",
    major: "Donate $10 to charity",
    reset: "Start streak counter over"
  }

FUNCTION generateMediumConsequences(habit) -> object
  RETURN {
    minor: "Text accountability partner explaining failure + plan to recover",
    moderate: "Donate $25 to charity + do bonus version of habit tomorrow",
    major: "Donate $50 to charity + write public post about failure",
    reset: "Donate $100 to charity + restart with stricter rules"
  }

FUNCTION generateHighConsequences(habit) -> object
  RETURN {
    minor: "Donate $50 to charity you disagree with",
    moderate: "Donate $100 + do unpleasant task (e.g., cold shower, extra chores)",
    major: "Donate $250 + complete embarrassing social consequence (partner's choice)",
    reset: "Donate $500 + restart with public commitment"
  }

FUNCTION generateCheckInSchedule(frequency) -> object
  // More frequent habits = more frequent check-ins

  IF frequency.contains("daily")
    RETURN {
      type: "daily",
      time: "End of each day",
      method: "Text or app update to accountability partner",
      fallback: "If miss check-in, automatic failure assumed"
    }
  ELSE IF frequency.contains("week")
    RETURN {
      type: "weekly",
      time: "Sunday evening",
      method: "Weekly summary to accountability partner",
      format: "Days completed: X/Y, Reflections: [...]"
    }
  ELSE
    RETURN {
      type: "flexible",
      time: "After each session",
      method: "Log completion immediately",
      partner_review: "Partner reviews weekly"
    }

FUNCTION mergeWithPreferences(defaults, preferences) -> object
  // Use user's preferred consequences where specified
  merged = defaults

  FOR EACH preference IN preferences
    level = matchConsequenceLevel(preference)
    merged[level] = preference

  RETURN merged
```

### Output

```typescript
interface HabitContract {
  commitmentStatement: string;
  measurableGoal: {
    specific: string;
    measurable: string;
    frequency: string;
    minimumSuccess: string;
    trackingUnit: string;
  };
  consequences: {
    missOnce: string;
    missTwice: string;
    missThreeTimes: string;
    breakStreak: string;
  };
  partners: {
    name: string;
    role: string;
    responsibilities: string[];
    contactMethod: string;
  }[];
  checkInSchedule: {
    type: string;
    time: string;
    method: string;
  };
  reviewClause: {
    frequency: string;
    purpose: string;
    questions: string[];
  };
  trackingMethod: string;
  signatureSection: object;
  whySection: {
    prompt: string;
    answer: string;
    identity: string;
    identityAnswer: string;
  };
}
```

### Example

**Input:**
```json
{
  "habit": "write for 30 minutes",
  "frequency": "daily",
  "startDate": "2025-01-01",
  "partners": ["Sarah", "Mike"],
  "consequenceLevel": "medium"
}
```

**Output:**
```json
{
  "commitmentStatement": "I, [NAME], commit to write for 30 minutes daily, starting January 1, 2025",
  "measurableGoal": {
    "specific": "Write for minimum 30 minutes (minimum 250 words or 30 minutes of focused writing time)",
    "measurable": "Track in writing log with timestamp and word count",
    "frequency": "daily (7 days per week)",
    "minimumSuccess": "80% compliance (minimum 5 out of 7 days per week)",
    "trackingUnit": "minutes and/or words"
  },
  "consequences": {
    "missOnce": "Text accountability partners explaining failure + specific plan to write tomorrow",
    "missTwice": "Donate $25 to charity + write double session (60 minutes) the next day",
    "missThreeTimes": "Donate $50 to charity + write public post about commitment and failure",
    "breakStreak": "Donate $100 to charity + restart with daily check-ins for 30 days"
  },
  "partners": [
    {
      "name": "Sarah",
      "role": "Accountability Partner",
      "responsibilities": [
        "Receive daily check-ins",
        "Verify completion",
        "Enforce consequences if necessary",
        "Provide encouragement"
      ],
      "contactMethod": "[To be filled]"
    },
    {
      "name": "Mike",
      "role": "Accountability Partner",
      "responsibilities": [
        "Receive daily check-ins",
        "Verify completion",
        "Enforce consequences if necessary",
        "Provide encouragement"
      ],
      "contactMethod": "[To be filled]"
    }
  ],
  "checkInSchedule": {
    "type": "daily",
    "time": "End of each day (before 11:59 PM)",
    "method": "Text or app update to both accountability partners with: (1) Completed? Y/N, (2) Minutes/words, (3) Brief note",
    "fallback": "If miss check-in by midnight, automatic failure assumed"
  },
  "reviewClause": {
    "frequency": "Every 30 days",
    "purpose": "Assess progress and adjust if needed",
    "questions": [
      "Is this habit working?",
      "Are consequences appropriate (too harsh/too lenient)?",
      "Should habit parameters be modified?"
    ]
  },
  "trackingMethod": "Daily writing log (digital or paper) with date, start time, end time, word count, and notes",
  "signatureSection": {
    "participant": {
      "statement": "I understand this commitment and accept the consequences outlined above",
      "signature": "[Signature]",
      "date": "[Date]"
    },
    "partners": [
      {
        "name": "Sarah",
        "statement": "I agree to serve as accountability partner and enforce consequences fairly",
        "signature": "[Signature]",
        "date": "[Date]"
      },
      {
        "name": "Mike",
        "statement": "I agree to serve as accountability partner and enforce consequences fairly",
        "signature": "[Signature]",
        "date": "[Date]"
      }
    ]
  },
  "whySection": {
    "prompt": "Why is this writing habit important to you?",
    "answer": "[To be filled: e.g., 'I want to finish my book', 'Writing clarifies my thinking', etc.]",
    "identity": "Who are you becoming by writing daily?",
    "identityAnswer": "[To be filled: e.g., 'I am becoming a writer', 'I am a disciplined creator']"
  }
}
```

---

## Pattern 7: Progress Visualization

### Purpose
Generates visual representations of habit streaks, trends, and progress to provide immediate satisfaction.

### When to Use
- User needs motivation boost
- Want to make progress visible
- Creating dashboard/app interface
- Implementing 4th Law (Make it Satisfying)

### Input Requirements

```typescript
interface ProgressVisualizationInput {
  habitName: string;
  startDate: Date;
  entries: {
    date: Date;
    completed: boolean;
    notes?: string;
  }[];
  targetFrequency: string;  // "daily", "3x per week", etc.
}
```

### Algorithm

```pseudocode
FUNCTION generateProgressVisualization(input: ProgressVisualizationInput) -> VisualizationData

  viz = {
    currentStreak: 0,
    longestStreak: 0,
    successRate: 0,
    totalCompletions: 0,
    visualElements: {},
    insights: [],
    milestones: []
  }

  // Step 1: Calculate basic statistics
  viz.totalCompletions = countCompletions(input.entries)
  viz.successRate = calculateSuccessRate(input.entries, input.targetFrequency)
  viz.currentStreak = calculateCurrentStreak(input.entries)
  viz.longestStreak = calculateLongestStreak(input.entries)

  // Step 2: Generate calendar heatmap data
  viz.visualElements.heatmap = {
    type: "calendar_heatmap",
    data: input.entries.map(entry => ({
      date: formatDate(entry.date),
      value: entry.completed ? 1 : 0,
      color: getColorForDay(entry.completed)
    })),
    legend: {
      0: "Missed",
      1: "Completed"
    }
  }

  // Step 3: Generate streak graph
  streakHistory = calculateStreakHistory(input.entries)
  viz.visualElements.streakGraph = {
    type: "line_chart",
    xAxis: "Date",
    yAxis: "Streak Length",
    data: streakHistory,
    highlights: [
      {point: viz.longestStreak, label: "Longest streak"}
    ]
  }

  // Step 4: Generate success rate trend
  weeklyRates = calculateWeeklySuccessRates(input.entries, input.targetFrequency)
  viz.visualElements.trendChart = {
    type: "line_chart",
    xAxis: "Week",
    yAxis: "Success Rate (%)",
    data: weeklyRates,
    targetLine: 80,  // 80% target line
    trendDirection: analyzeTrend(weeklyRates)
  }

  // Step 5: Generate insights
  viz.insights = generateInsights(input.entries, viz)

  // Step 6: Identify milestones
  viz.milestones = identifyMilestones(input.entries, viz)

  // Step 7: Create motivational display elements
  viz.motivationalElements = {
    streakBadge: {
      type: "badge",
      icon: getStreakIcon(viz.currentStreak),
      text: "${viz.currentStreak} day streak!",
      color: getStreakColor(viz.currentStreak)
    },
    progressBar: {
      type: "progress_bar",
      current: viz.totalCompletions,
      target: calculateMonthlyTarget(input.targetFrequency),
      percentage: (viz.totalCompletions / calculateMonthlyTarget(input.targetFrequency)) * 100
    },
    comparisonText: generateComparisonText(viz)
  }

  // Step 8: Generate next milestone prediction
  viz.nextMilestone = predictNextMilestone(viz, input.entries)

  RETURN viz

// Helper Functions
FUNCTION calculateCurrentStreak(entries) -> int
  IF entries.length == 0
    RETURN 0

  // Start from most recent and count backwards
  entries = sortByDate(entries, descending)
  streak = 0

  FOR EACH entry IN entries
    IF entry.completed
      streak++
    ELSE
      BREAK  // Streak broken

  RETURN streak

FUNCTION calculateLongestStreak(entries) -> int
  IF entries.length == 0
    RETURN 0

  entries = sortByDate(entries, ascending)
  longestStreak = 0
  currentStreak = 0

  FOR EACH entry IN entries
    IF entry.completed
      currentStreak++
      IF currentStreak > longestStreak
        longestStreak = currentStreak
    ELSE
      currentStreak = 0

  RETURN longestStreak

FUNCTION calculateSuccessRate(entries, targetFrequency) -> float
  IF entries.length == 0
    RETURN 0

  completions = countCompletions(entries)
  expectedCompletions = calculateExpectedCompletions(entries[0].date, entries[-1].date, targetFrequency)

  RETURN (completions / expectedCompletions) * 100

FUNCTION generateInsights(entries, stats) -> string[]
  insights = []

  // Streak insights
  IF stats.currentStreak >= 7
    insights.add("You're on fire! ${stats.currentStreak}-day streak 🔥")
  ELSE IF stats.currentStreak >= 30
    insights.add("Incredible! You've built a 30+ day habit!")

  // Success rate insights
  IF stats.successRate >= 90
    insights.add("Outstanding ${stats.successRate}% success rate!")
  ELSE IF stats.successRate >= 80
    insights.add("Solid ${stats.successRate}% success rate - you're building consistency")
  ELSE IF stats.successRate < 50
    insights.add("Success rate is ${stats.successRate}%. Consider making this habit easier.")

  // Trend insights
  recentRate = calculateRecentSuccessRate(entries, days: 7)
  overallRate = stats.successRate

  IF recentRate > overallRate + 10
    insights.add("You're improving! Recent performance up ${recentRate - overallRate}%")
  ELSE IF recentRate < overallRate - 10
    insights.add("Recent performance declined. What changed?")

  // Pattern insights
  bestDayOfWeek = findBestDayOfWeek(entries)
  insights.add("You're most consistent on ${bestDayOfWeek}s")

  // Milestone insights
  IF stats.totalCompletions == 1
    insights.add("First completion! Every journey starts with one step.")
  ELSE IF stats.totalCompletions == 30
    insights.add("30 completions! This is becoming part of who you are.")
  ELSE IF stats.totalCompletions == 100
    insights.add("Century mark! 100 completions is extraordinary.")

  RETURN insights

FUNCTION identifyMilestones(entries, stats) -> Milestone[]
  milestones = []
  standardMilestones = [1, 7, 30, 50, 100, 365]

  FOR EACH milestone IN standardMilestones
    IF stats.totalCompletions >= milestone
      milestones.add({
        name: "${milestone}-Day Milestone",
        achieved: true,
        date: findDateOfNthCompletion(entries, milestone),
        badge: getBadgeForMilestone(milestone)
      })
    ELSE
      // Upcoming milestone
      remaining = milestone - stats.totalCompletions
      milestones.add({
        name: "${milestone}-Day Milestone",
        achieved: false,
        remaining: remaining,
        estimatedDate: predictMilestoneDate(stats, milestone)
      })
      BREAK  // Only show next upcoming milestone

  RETURN milestones

FUNCTION getStreakIcon(streak) -> string
  IF streak == 0
    RETURN "➖"
  ELSE IF streak < 7
    RETURN "✅"
  ELSE IF streak < 30
    RETURN "🔥"
  ELSE IF streak < 100
    RETURN "💪"
  ELSE
    RETURN "🏆"

FUNCTION getStreakColor(streak) -> string
  IF streak == 0
    RETURN "gray"
  ELSE IF streak < 7
    RETURN "green"
  ELSE IF streak < 30
    RETURN "orange"
  ELSE
    RETURN "gold"

FUNCTION generateComparisonText(stats) -> string
  // Show how current performance compares to past
  IF stats.currentStreak == stats.longestStreak
    RETURN "You're at your longest streak ever!"
  ELSE IF stats.currentStreak >= stats.longestStreak * 0.8
    RETURN "Close to your record! ${stats.longestStreak - stats.currentStreak} days away from longest streak."
  ELSE
    RETURN "Longest streak: ${stats.longestStreak} days. Keep going!"
```

### Output

```typescript
interface VisualizationData {
  currentStreak: number;
  longestStreak: number;
  successRate: number;
  totalCompletions: number;
  visualElements: {
    heatmap: object;
    streakGraph: object;
    trendChart: object;
  };
  insights: string[];
  milestones: {
    name: string;
    achieved: boolean;
    date?: Date;
    badge?: string;
    remaining?: number;
    estimatedDate?: Date;
  }[];
  motivationalElements: {
    streakBadge: object;
    progressBar: object;
    comparisonText: string;
  };
  nextMilestone: {
    name: string;
    completionsNeeded: number;
    estimatedDate: Date;
  };
}
```

---

## Pattern 8: Friction Analysis

### Purpose
Analyzes and quantifies friction points for habits, then generates strategies to add or remove friction.

### When to Use
- Habit is too difficult (remove friction)
- Want to prevent bad habit (add friction)
- Optimizing environment
- Troubleshooting consistency issues

### Input Requirements

```typescript
interface FrictionAnalysisInput {
  habit: string;
  goal: 'increase' | 'decrease';  // Increase friction (bad habit) or decrease (good habit)
  currentProcess: string[];       // Current steps to perform habit
  context: {
    location: string;
    time: string;
    energy: string;               // "high", "medium", "low"
  };
}
```

### Algorithm

```pseudocode
FUNCTION analyzeFriction(input: FrictionAnalysisInput) -> FrictionReport

  report = {
    currentFriction: 0,
    optimalFriction: 0,
    gap: 0,
    stepAnalysis: [],
    recommendations: [],
    implementationPlan: {}
  }

  // Step 1: Analyze each step for friction
  totalFriction = 0

  FOR EACH step IN input.currentProcess
    stepFriction = {
      step: step,
      effortScore: calculateEffortScore(step),
      timeRequired: estimateTime(step),
      cognitiveLoad: assessCognitiveLoad(step),
      physicalDemand: assessPhysicalDemand(step),
      frictionSources: identifyFrictionSources(step),
      totalFriction: 0
    }

    // Calculate total friction for this step
    stepFriction.totalFriction =
      (stepFriction.effortScore * 0.4 +
       stepFriction.cognitiveLoad * 0.3 +
       stepFriction.physicalDemand * 0.3)

    totalFriction += stepFriction.totalFriction
    report.stepAnalysis.add(stepFriction)

  report.currentFriction = totalFriction / input.currentProcess.length

  // Step 2: Determine optimal friction level
  IF input.goal == 'decrease'  // Good habit - want low friction
    report.optimalFriction = 0.2  // Very low friction
  ELSE  // Bad habit - want high friction
    report.optimalFriction = 0.8  // High friction

  report.gap = abs(report.currentFriction - report.optimalFriction)

  // Step 3: Generate recommendations based on goal
  IF input.goal == 'decrease'
    report.recommendations = generateFrictionReductionStrategies(
      report.stepAnalysis,
      input.context,
      report.gap
    )
  ELSE
    report.recommendations = generateFrictionAdditionStrategies(
      report.stepAnalysis,
      input.context,
      report.gap
    )

  // Step 4: Create implementation plan
  report.implementationPlan = prioritizeAndSchedule(report.recommendations)

  // Step 5: Estimate impact
  report.projectedFriction = estimateNewFriction(
    report.currentFriction,
    report.recommendations
  )

  report.expectedImpact = {
    consistencyIncrease: projectConsistencyChange(report.gap, report.projectedFriction),
    effortReduction: calculateEffortChange(report.currentFriction, report.projectedFriction),
    timeReduction: calculateTimeChange(report.stepAnalysis, report.recommendations)
  }

  RETURN report

// Helper Functions
FUNCTION calculateEffortScore(step) -> float
  // Score 0-1 based on effort required

  lowEffortKeywords = ["look", "see", "notice", "pick up"]
  mediumEffortKeywords = ["put on", "take out", "prepare", "set up"]
  highEffortKeywords = ["assemble", "configure", "clean", "organize"]

  FOR EACH keyword IN highEffortKeywords
    IF step.contains(keyword)
      RETURN 0.8 + random(0, 0.2)

  FOR EACH keyword IN mediumEffortKeywords
    IF step.contains(keyword)
      RETURN 0.4 + random(0, 0.2)

  FOR EACH keyword IN lowEffortKeywords
    IF step.contains(keyword)
      RETURN 0.1 + random(0, 0.1)

  RETURN 0.5  // Default medium effort

FUNCTION identifyFrictionSources(step) -> string[]
  sources = []

  IF requiresDecision(step)
    sources.add("Decision fatigue")

  IF requiresMultipleLocations(step)
    sources.add("Location changes")

  IF requiresTools(step)
    sources.add("Tool/equipment access")

  IF requiresPreparation(step)
    sources.add("Prior setup needed")

  IF requiresMemory(step)
    sources.add("Memory/recall required")

  RETURN sources

FUNCTION generateFrictionReductionStrategies(stepAnalysis, context, gap) -> Recommendation[]
  strategies = []

  // Sort steps by friction level (highest first)
  sortedSteps = sortByFriction(stepAnalysis, descending)

  FOR EACH step IN sortedSteps
    // Strategy 1: Eliminate the step entirely
    IF step.effortScore > 0.6
      strategies.add({
        type: "ELIMINATE",
        target: step.step,
        suggestion: "Remove this step entirely. Is it necessary?",
        impact: "HIGH",
        effort: "LOW"
      })

    // Strategy 2: Prepare in advance
    IF step.frictionSources.contains("Prior setup needed")
      strategies.add({
        type: "PREPARE",
        target: step.step,
        suggestion: "Prepare this the night before or during a prep session",
        impact: "HIGH",
        effort: "MEDIUM",
        specific: generatePrepStrategy(step.step, context)
      })

    // Strategy 3: Reduce cognitive load
    IF step.cognitiveLoad > 0.6
      strategies.add({
        type: "SIMPLIFY",
        target: step.step,
        suggestion: "Remove decisions from this step",
        impact: "MEDIUM",
        effort: "LOW",
        specific: generateSimplificationStrategy(step.step)
      })

    // Strategy 4: Move closer
    IF step.frictionSources.contains("Location changes")
      strategies.add({
        type: "PROXIMITY",
        target: step.step,
        suggestion: "Move required items closer to action location",
        impact: "MEDIUM",
        effort: "LOW",
        specific: "Place items in direct line of sight or path"
      })

    // Strategy 5: Automate
    IF isAutomatable(step.step)
      strategies.add({
        type: "AUTOMATE",
        target: step.step,
        suggestion: "Automate this step using technology or systems",
        impact: "HIGH",
        effort: "HIGH",
        specific: generateAutomationStrategy(step.step)
      })

  // Limit to top recommendations based on impact/effort ratio
  RETURN selectBestStrategies(strategies, maxCount: 5)

FUNCTION generateFrictionAdditionStrategies(stepAnalysis, context, gap) -> Recommendation[]
  strategies = []

  // For bad habits, we want to ADD friction

  // Strategy 1: Add waiting period
  strategies.add({
    type: "ADD_DELAY",
    suggestion: "Institute a 20-minute waiting period before you can do this habit",
    impact: "HIGH",
    effort: "LOW",
    specific: "When urge strikes, set timer for 20 minutes. If still want to after timer, allowed."
  })

  // Strategy 2: Physical barriers
  strategies.add({
    type: "ADD_BARRIER",
    suggestion: "Create physical obstacles between you and the habit",
    impact: "HIGH",
    effort: "MEDIUM",
    specific: generateBarrierStrategies(stepAnalysis, context)
  })

  // Strategy 3: Increase steps
  strategies.add({
    type: "ADD_STEPS",
    suggestion: "Add additional steps required before habit can be performed",
    impact: "MEDIUM",
    effort: "LOW",
    specific: generateAdditionalSteps(stepAnalysis)
  })

  // Strategy 4: Commitment devices
  strategies.add({
    type: "COMMITMENT_DEVICE",
    suggestion: "Use tools to lock yourself out",
    impact: "HIGH",
    effort: "MEDIUM",
    specific: generateCommitmentDeviceStrategies(context)
  })

  // Strategy 5: Social friction
  strategies.add({
    type: "SOCIAL_COST",
    suggestion: "Make habit socially costly",
    impact: "HIGH",
    effort: "LOW",
    specific: "Tell others you're quitting. Announce failures publicly."
  })

  // Strategy 6: Remove cues
  strategies.add({
    type: "REMOVE_CUES",
    suggestion: "Eliminate triggers from environment",
    impact: "HIGH",
    effort: "MEDIUM",
    specific: generateCueRemovalStrategies(stepAnalysis, context)
  })

  RETURN strategies

FUNCTION generatePrepStrategy(step, context) -> string
  // Create specific preparation plan
  IF context.time.contains("morning")
    RETURN "Prepare this the night before. Set out all items in visible location."
  ELSE IF context.time.contains("evening")
    RETURN "Prepare during lunch break or immediately after work."
  ELSE
    RETURN "Create a weekly prep session to batch-prepare all materials."

FUNCTION generateBarrierStrategies(stepAnalysis, context) -> string[]
  barriers = []

  IF context.location == "home"
    barriers.add("Unplug device and store in inconvenient location")
    barriers.add("Put in locked box, give key to someone else")
    barriers.add("Remove from home entirely (give to friend to hold)")

  IF isDigitalHabit(stepAnalysis)
    barriers.add("Install website blocker (Freedom, Cold Turkey)")
    barriers.add("Delete apps from phone")
    barriers.add("Add parental controls")
    barriers.add("Remove saved passwords")

  RETURN barriers

FUNCTION selectBestStrategies(strategies, maxCount) -> Recommendation[]
  // Score by impact/effort ratio
  FOR EACH strategy IN strategies
    impactScore = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}[strategy.impact]
    effortScore = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}[strategy.effort]

    strategy.score = impactScore / effortScore  // Higher is better

  // Sort by score and return top N
  sortedStrategies = sortByScore(strategies, descending)
  RETURN sortedStrategies.slice(0, maxCount)
```

### Output

```typescript
interface FrictionReport {
  currentFriction: number;       // 0-1
  optimalFriction: number;       // 0-1
  gap: number;
  stepAnalysis: {
    step: string;
    effortScore: number;
    timeRequired: number;
    cognitiveLoad: number;
    physicalDemand: number;
    frictionSources: string[];
    totalFriction: number;
  }[];
  recommendations: {
    type: string;
    target?: string;
    suggestion: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    effort: 'HIGH' | 'MEDIUM' | 'LOW';
    specific: string | string[];
    score?: number;
  }[];
  implementationPlan: {
    immediate: Recommendation[];
    thisWeek: Recommendation[];
    longTerm: Recommendation[];
  };
  projectedFriction: number;
  expectedImpact: {
    consistencyIncrease: string;
    effortReduction: string;
    timeReduction: string;
  };
}
```

---

## Pattern 9: Trigger Mapping

### Purpose
Identifies all potential triggers (cues) for a habit across four dimensions: time, location, emotional state, and preceding action.

### When to Use
- Designing new habit
- Troubleshooting existing habit
- Breaking bad habit (identify triggers to avoid)
- Creating comprehensive habit plan

### Input Requirements

```typescript
interface TriggerMappingInput {
  habit: string;
  userSchedule: object;      // Daily routine
  locations: string[];        // Places user frequents
  emotionalPatterns?: object; // Known emotional triggers
  existingHabits?: string[];  // For habit stacking
}
```

### Algorithm

```pseudocode
FUNCTION mapTriggers(input: TriggerMappingInput) -> TriggerMap

  map = {
    timeTriggers: [],
    locationTriggers: [],
    emotionalTriggers: [],
    actionTriggers: [],
    combinationTriggers: [],
    recommendations: {}
  }

  // Step 1: Map time-based triggers
  map.timeTriggers = identifyTimeTriggers(input.habit, input.userSchedule)

  // Step 2: Map location-based triggers
  map.locationTriggers = identifyLocationTriggers(input.habit, input.locations)

  // Step 3: Map emotional triggers
  IF input.emotionalPatterns != null
    map.emotionalTriggers = identifyEmotionalTriggers(input.habit, input.emotionalPatterns)
  ELSE
    map.emotionalTriggers = suggestCommonEmotionalTriggers(input.habit)

  // Step 4: Map action-based triggers (habit stacking opportunities)
  IF input.existingHabits != null
    map.actionTriggers = identifyActionTriggers(input.habit, input.existingHabits)
  ELSE
    map.actionTriggers = suggestCommonActionTriggers(input.habit)

  // Step 5: Identify powerful combination triggers
  map.combinationTriggers = findCombinationTriggers(
    map.timeTriggers,
    map.locationTriggers,
    map.emotionalTriggers,
    map.actionTriggers
  )

  // Step 6: Recommend best triggers
  map.recommendations = recommendOptimalTriggers(map, input.habit)

  RETURN map

// Helper Functions
FUNCTION identifyTimeTriggers(habit, schedule) -> TimeTrigger[]
  triggers = []

  // Analyze daily schedule for stable time slots
  FOR EACH timeSlot IN schedule
    suitability = assessTimeSuitability(habit, timeSlot)

    IF suitability > 0.5
      triggers.add({
        time: timeSlot.time,
        context: timeSlot.activity,
        suitability: suitability,
        reason: explainTimeSuitability(habit, timeSlot)
      })

  // Add common time triggers
  commonTimes = getCommonTimeTriggers(habit)
  FOR EACH commonTime IN commonTimes
    IF NOT alreadyIncluded(triggers, commonTime)
      triggers.add(commonTime)

  RETURN sortBySuitability(triggers)

FUNCTION identifyLocationTriggers(habit, locations) -> LocationTrigger[]
  triggers = []

  FOR EACH location IN locations
    // Check if location supports habit
    IF locationSupportsHabit(habit, location)
      triggers.add({
        location: location,
        frequency: userFrequency(location),
        suitability: assessLocationSuitability(habit, location),
        setup: suggestLocationSetup(habit, location)
      })

  RETURN sortBySuitability(triggers)

FUNCTION identifyEmotionalTriggers(habit, patterns) -> EmotionalTrigger[]
  triggers = []

  // Map emotions to habit compatibility
  emotionMap = {
    "stress": ["meditation", "exercise", "breathing"],
    "boredom": ["reading", "learning", "hobby"],
    "energy": ["exercise", "creative work", "social"],
    "fatigue": ["rest", "light activity", "reflection"]
  }

  FOR EACH emotion IN patterns.commonEmotions
    FOR EACH compatibleHabit IN emotionMap[emotion]
      IF habit.matches(compatibleHabit)
        triggers.add({
          emotion: emotion,
          frequency: patterns.frequency[emotion],
          approach: "Use this emotion as trigger",
          implementation: "When I feel ${emotion}, I will ${habit}"
        })

  RETURN triggers

FUNCTION identifyActionTriggers(habit, existingHabits) -> ActionTrigger[]
  triggers = []

  FOR EACH existing IN existingHabits
    compatibility = assessStackCompatibility(existing, habit)

    IF compatibility > 0.5
      triggers.add({
        anchor: existing,
        newHabit: habit,
        formula: "After I ${existing}, I will ${habit}",
        compatibility: compatibility,
        timing: estimateTimingFit(existing, habit),
        context: explainContextFit(existing, habit)
      })

  RETURN sortByCompatibility(triggers)

FUNCTION findCombinationTriggers(time, location, emotion, action) -> CombinationTrigger[]
  combinations = []

  // Time + Location combinations
  FOR EACH timeT IN time
    FOR EACH locationT IN location
      IF contextsAlign(timeT, locationT)
        score = (timeT.suitability + locationT.suitability) / 2
        IF score > 0.6
          combinations.add({
            type: "TIME_LOCATION",
            trigger: "At ${timeT.time} in ${locationT.location}",
            strength: score,
            specificity: "high"
          })

  // Action + Location combinations
  FOR EACH actionT IN action
    FOR EACH locationT IN location
      IF contextsAlign(actionT, locationT)
        score = (actionT.compatibility + locationT.suitability) / 2
        IF score > 0.6
          combinations.add({
            type: "ACTION_LOCATION",
            trigger: "After ${actionT.anchor} in ${locationT.location}",
            strength: score,
            specificity: "high"
          })

  // Time + Action combinations
  FOR EACH timeT IN time
    FOR EACH actionT IN action
      IF contextsAlign(timeT, actionT)
        score = (timeT.suitability + actionT.compatibility) / 2
        IF score > 0.6
          combinations.add({
            type: "TIME_ACTION",
            trigger: "After ${actionT.anchor} at ${timeT.time}",
            strength: score,
            specificity: "very_high"
          })

  RETURN sortByStrength(combinations)

FUNCTION recommendOptimalTriggers(map, habit) -> object
  recommendations = {
    primary: null,
    backup: [],
    avoid: []
  }

  // Select primary trigger
  allTriggers = [
    ...map.combinationTriggers,  // Prefer combinations (most specific)
    ...map.actionTriggers,        // Then action-based
    ...map.timeTriggers,          // Then time-based
    ...map.locationTriggers       // Then location-based
  ]

  IF allTriggers.length > 0
    recommendations.primary = allTriggers[0]
    recommendations.backup = allTriggers.slice(1, 4)

  // Identify triggers to avoid (if breaking bad habit)
  IF isBreakingHabit(habit)
    recommendations.avoid = identifyTriggersToAvoid(map)

  // Add implementation guidance
  recommendations.implementation = {
    formula: generateFormula(recommendations.primary),
    setup: generateSetupInstructions(recommendations.primary),
    fallback: "If primary trigger doesn't work, try: ${recommendations.backup[0]}"
  }

  RETURN recommendations
```

### Output

```typescript
interface TriggerMap {
  timeTriggers: {
    time: string;
    context: string;
    suitability: number;
    reason: string;
  }[];
  locationTriggers: {
    location: string;
    frequency: string;
    suitability: number;
    setup: string;
  }[];
  emotionalTriggers: {
    emotion: string;
    frequency: string;
    approach: string;
    implementation: string;
  }[];
  actionTriggers: {
    anchor: string;
    newHabit: string;
    formula: string;
    compatibility: number;
    timing: string;
    context: string;
  }[];
  combinationTriggers: {
    type: string;
    trigger: string;
    strength: number;
    specificity: string;
  }[];
  recommendations: {
    primary: object;
    backup: object[];
    avoid?: object[];
    implementation: object;
  };
}
```

---

## Integration Guidelines for LLM Systems

### How to Use These Patterns

1. **Pattern Selection**: Use decision trees to determine which patterns are needed
2. **Sequential Application**: Some patterns build on others (e.g., Trigger Mapping before Habit Stack Builder)
3. **Data Persistence**: Store outputs in structured format using data models
4. **User Feedback**: Iterate on patterns based on user responses
5. **Combination**: Multiple patterns often work together for comprehensive habit design

### Example Integration Flow

```
User wants to build new habit
  ↓
[Decision Tree 1: Build New Habit]
  ↓
[Pattern 9: Trigger Mapping] → Identify optimal triggers
  ↓
[Pattern 1: Habit Stack Builder] → Create formula
  ↓
[Pattern 4: Two-Minute Version] → Make it easy
  ↓
[Pattern 5: Temptation Bundle] → Make it attractive (if needed)
  ↓
[Pattern 2: Environment Audit] → Optimize space
  ↓
[Pattern 6: Habit Contract] → Add accountability (if desired)
  ↓
[Pattern 7: Progress Visualization] → Set up tracking
  ↓
Store complete habit plan in database
```

### Code-Like Usage Example

```javascript
// Example: User wants to build meditation habit
const userInput = {
  desiredOutcome: "reduce stress and improve focus",
  habit: "meditate for 10 minutes",
  currentRoutines: ["wake up", "pour coffee", "check email", "shower"]
};

// Step 1: Apply Habit Stack Builder
const stack = buildHabitStack({
  newHabit: userInput.habit,
  userDailyRoutines: userInput.currentRoutines,
  timing: 'morning'
});
// Output: "After I pour my morning coffee, I will meditate for 10 minutes"

// Step 2: Apply Two-Minute Version Creator
const easyVersion = createTwoMinuteVersion({
  originalHabit: userInput.habit,
  estimatedDuration: 10,
  difficulty: 5
});
// Output: "Sit on meditation cushion for 30 seconds"

// Step 3: Apply Environment Audit
const envChanges = auditEnvironment({
  spaceType: 'bedroom',
  goodHabits: [{name: userInput.habit, triggers: ['cushion', 'quiet']}],
  badHabits: []
});
// Output: Add meditation cushion next to coffee maker

// Step 4: Set up Progress Visualization
const tracker = generateProgressVisualization({
  habitName: userInput.habit,
  startDate: new Date(),
  entries: [],
  targetFrequency: 'daily'
});

// Store complete habit plan
const habitPlan = {
  id: generateID(),
  user: userID,
  habit: userInput.habit,
  trigger: stack.formula,
  environment: envChanges,
  difficulty: easyVersion.twoMinuteVersion,
  tracking: tracker,
  startDate: new Date()
};

saveToDatabase(habitPlan);
```

These implementation patterns provide the building blocks for creating a comprehensive habit-forming system powered by LLM intelligence.
