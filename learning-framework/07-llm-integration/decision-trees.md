# Decision Trees - Systematic Coaching Logic for LLM Agents

## Purpose
This document provides algorithmic decision-making flows for common student scenarios. Use these to systematically diagnose problems and prescribe evidence-based solutions.

---

## Decision Tree 1: Student Struggling with a Course

```
START: Student reports "struggling" with a course

QUESTION 1: "What do test scores/grades show?"
├─ ANSWER: "Failing or very low" → PATH A: Performance Crisis
├─ ANSWER: "Below target but passing" → PATH B: Performance Gap
└─ ANSWER: "Haven't had assessment yet" → PATH C: Preventive

PATH A: Performance Crisis
│
├─ QUESTION 2: "Have you attended all classes/watched all lectures?"
│  ├─ NO → ACTION: Catch up on missed content first
│  │        THEN: Return to QUESTION 3
│  └─ YES → Continue
│
├─ QUESTION 3: "After class, what do you do with the material?"
│  ├─ "Nothing" or "Just read textbook" → DIAGNOSIS: Zero active processing
│  │  ACTION: Implement Active Recall Protocol
│  │  STEPS:
│  │    1. After next lecture, close materials
│  │    2. Write everything remembered
│  │    3. Check what was missed
│  │    4. Create questions for missed material
│  │    5. Answer those questions from memory next day
│  │
│  ├─ "I take notes" or "I highlight" → DIAGNOSIS: Passive methods only
│  │  ACTION: Convert to Active Learning
│  │  STEPS:
│  │    1. Keep attending and taking notes
│  │    2. Within 24h: Active recall session on notes
│  │    3. Create flashcards/questions from gaps
│  │    4. Schedule review for 3 days later
│  │
│  └─ "I do practice problems" → Continue to QUESTION 4
│
├─ QUESTION 4: "When doing practice problems, do you check solutions?"
│  ├─ "I look at solution when stuck" → DIAGNOSIS: Solution dependency
│  │  ACTION: Struggle Protocol
│  │  STEPS:
│  │    1. Attempt problem completely before looking
│  │    2. If stuck, review concept FIRST, then try again
│  │    3. Only check solution after attempt
│  │    4. Redo problem from scratch without looking
│  │
│  └─ "I try completely first" → Continue to QUESTION 5
│
├─ QUESTION 5: "Do you redo problems you got wrong?"
│  ├─ NO → DIAGNOSIS: No consolidation of errors
│  │  ACTION: Error Analysis Protocol
│  │  STEPS:
│  │    1. Create "wrong answer journal"
│  │    2. For each error: why wrong, what concept missed, correct approach
│  │    3. Redo same problem 1 day later
│  │    4. Do similar problem 3 days later
│  │
│  └─ YES → Continue to QUESTION 6
│
├─ QUESTION 6: "Can you explain core concepts without looking at materials?"
│  ├─ NO → DIAGNOSIS: Conceptual gaps
│  │  ACTION: Feynman Technique Implementation
│  │  STEPS:
│  │    1. List 5 core concepts from syllabus
│  │    2. Explain each in simple terms (record or write)
│  │    3. Identify where explanation breaks down
│  │    4. Study those specific gaps
│  │    5. Re-explain until fluent
│  │
│  └─ YES → Continue to QUESTION 7
│
└─ QUESTION 7: "How much sleep are you getting?"
   ├─ <6 hours → DIAGNOSIS: Sleep deprivation affecting consolidation
   │  ACTION: Sleep Hygiene Protocol
   │  STEPS:
   │    1. 7-9 hours non-negotiable for 1 week
   │    2. Review material before sleep (consolidation boost)
   │    3. Track performance improvement
   │
   └─ ≥7 hours → DIAGNOSIS: May need conceptual help or prerequisites
      ACTION: Seek instructor help + intensify active recall

PATH B: Performance Gap (Passing but below target)
│
├─ QUESTION 1: "What's your current study method?"
│  ├─ Mostly passive (reading, highlighting) → IMPLEMENT: Active Recall
│  ├─ Some active, no schedule → IMPLEMENT: Spaced Repetition
│  └─ Active + scheduled → IMPLEMENT: Interleaved Practice + Difficulty Scaling
│
├─ QUESTION 2: "Do you review old material or just keep moving forward?"
│  ├─ NO → DIAGNOSIS: Forgetting curve losses
│  │  ACTION: Implement Spaced Repetition Schedule
│  │  STEPS:
│  │    1. List all topics covered so far
│  │    2. Rate mastery: 1-5 for each
│  │    3. Schedule reviews: 1-2 → review in 1 day; 3 → 3 days; 4 → 7 days; 5 → 14 days
│  │    4. Maintain review alongside new material
│  │
│  └─ YES → Continue to QUESTION 3
│
└─ QUESTION 3: "Do you practice different types of problems in same session?"
   ├─ NO → IMPLEMENT: Interleaving
   │  ACTION: Redesign practice sessions
   │  EXAMPLE: Instead of 20 Chapter 3 problems, do:
   │    - 5 from Chapter 3
   │    - 5 from Chapter 2
   │    - 5 from Chapter 1
   │    - 5 mixed from all chapters
   │
   └─ YES → IMPLEMENT: Advanced optimization (see implementation-patterns.md)

PATH C: Preventive (No assessment yet)
│
└─ ACTION: Set up proactive system now
   STEPS:
     1. Implement active recall from Day 1
     2. Create spaced repetition schedule
     3. Weekly self-testing
     4. Track confidence and gaps
     5. Adjust before first assessment

TERMINATION: Provide specific action plan + follow-up timeline
```

---

## Decision Tree 2: Student Cramming for Exam

```
START: Student says "Exam in X days" or "I need to cram"

QUESTION 1: "How many days until exam?"
├─ 1 day → EMERGENCY PROTOCOL
├─ 2-3 days → INTENSIVE PROTOCOL
├─ 4-7 days → ACCELERATED PROTOCOL
└─ >7 days → OPTIMAL PROTOCOL

EMERGENCY PROTOCOL (1 day)
│
├─ STEP 1: Triage material
│  ACTION: "List all topics that could be on exam"
│  THEN: "Which of these are weighted most heavily?"
│  FOCUS: Top 20% of material that yields 80% of points
│
├─ STEP 2: Identify current knowledge
│  ACTION: "For each high-value topic, rate your confidence 1-5"
│  PRIORITY: Study topics rated 2-3 (biggest ROI)
│  SKIP: Topics rated 5 (diminishing returns) and 1 (not enough time)
│
├─ STEP 3: Active recall on priority topics
│  TIMING: 2-hour focused blocks
│  METHOD:
│    1. Read/watch summary of topic (15 min)
│    2. Close materials, write what you know (20 min)
│    3. Check gaps, focus study on those (30 min)
│    4. Practice problems on topic (45 min)
│    5. Quick review (10 min)
│    BREAK: 20 minutes
│    REPEAT: For next topic
│
├─ STEP 4: Spaced micro-reviews
│  ACTION: Brief review of each topic 2-3 times before exam
│  SPACING: If studying 8 hours, review at:
│    - Initial learning
│    - +2 hours
│    - +4 hours
│    - Before sleep
│
├─ STEP 5: Sleep protocol
│  CRITICAL: 7+ hours sleep
│  RATIONALE: Sleep deprivation costs more performance than extra study gains
│  BEFORE BED: 10-minute review of key concepts (consolidation boost)
│
└─ WHAT TO AVOID:
   ✗ All-nighter (devastating to recall)
   ✗ Trying to cover everything (spread too thin)
   ✗ Passive re-reading (false fluency)
   ✗ Energy drinks after 6pm (sleep quality)

INTENSIVE PROTOCOL (2-3 days)
│
├─ DAY 1:
│  MORNING (3 hours):
│    - Comprehensive topic inventory
│    - Active recall baseline test (what can you recall NOW?)
│    - Identify critical gaps
│  AFTERNOON (3 hours):
│    - Active learning on biggest gaps
│    - Create practice questions
│  EVENING (2 hours):
│    - Review day's material
│    - Set up tomorrow's priorities
│
├─ DAY 2:
│  MORNING (3 hours):
│    - Review yesterday's material (spaced repetition)
│    - Active learning on remaining gaps
│  AFTERNOON (3 hours):
│    - Practice problems (mixed topics)
│    - Error analysis
│  EVENING (2 hours):
│    - Comprehensive review of Days 1 & 2
│
├─ DAY 3 (if available):
│  MORNING (2 hours):
│    - Review all material
│    - Focus on weakest areas
│  AFTERNOON (2 hours):
│    - Practice exam simulation
│    - Final gap filling
│  EVENING (1 hour):
│    - Light review only
│    - Early sleep
│
└─ SPACING STRATEGY:
   - Review material at: +3 hours, +1 day, +2 days
   - Interleave topics
   - Sleep 7+ hours each night

ACCELERATED PROTOCOL (4-7 days)
│
├─ Can implement modified spaced repetition
├─ Schedule: 1 day, 3 days, 6 days intervals
├─ More time for practice problems
├─ Include one full practice exam
└─ See Exam Preparation guide in implementation-patterns.md

OPTIMAL PROTOCOL (>7 days)
│
├─ Full spaced repetition: 1, 3, 7 day intervals
├─ Balanced active recall and practice
├─ Multiple practice exams
├─ Time for conceptual deep-dives
└─ Follow standard study session design

COACHING NOTE: Always acknowledge reality ("I understand you're in a tough spot") while setting realistic expectations ("This isn't ideal, but here's how to maximize these X days")

FOLLOW-UP AFTER EXAM:
"Now that exam is over, let's set up a system so you never have to cram like this again. Would you like to create a study schedule for your next course?"
```

---

## Decision Tree 3: Student Spending Hours But Not Improving

```
START: Student says "I study so much but my grades aren't improving"

QUESTION 1: "What does a typical study session look like? Walk me through yesterday."
│
├─ LISTEN FOR RED FLAGS:
│  ⚠ "I re-read the chapter"
│  ⚠ "I go over my notes"
│  ⚠ "I highlight important parts"
│  ⚠ "I watch lecture videos again"
│  ⚠ "I make study guides"
│  └─ If ANY of these → DIAGNOSIS: Passive Study Syndrome

DIAGNOSIS: Passive Study Syndrome
│
├─ EXPLAIN PROBLEM:
│  "You're confusing familiarity with mastery. When you re-read, material
│   feels familiar, so you think you know it. But recognition ≠ recall.
│   Your brain needs to practice RETRIEVING, not just seeing."
│
├─ DEMONSTRATE GAP:
│  "Right now, close your materials. Explain to me [recent topic] as if
│   I know nothing about it."
│
│  LIKELY OUTCOME: Student struggles, says "I know it when I see it"
│
│  COACHING RESPONSE: "Exactly. You need to practice retrieving WITHOUT seeing it.
│   That struggle you just felt? That's what creates real learning."
│
└─ INTERVENTION: Active Study Conversion

   STEPS:
   1. IMMEDIATE CHANGE (Today):
      "For your next study session:
       - Read material ONCE, carefully
       - Close book immediately
       - Write everything you remember
       - Only then open book to check what you missed
       - Create questions about what you missed
       - Answer those questions from memory"

   2. MEASURE CHANGE (This week):
      "Track two things:
       - Time spent actively recalling vs passively reading
       - Your ability to explain concepts without looking
       Target: 80% active, 20% passive"

   3. REINFORCE SUCCESS (Ongoing):
      "Before each test/assessment, do a practice recall session
       Notice how much better you perform when you've practiced retrieval"

ALTERNATIVE PATH: If student IS using active methods
│
├─ QUESTION 2: "When you practice problems or test yourself, what happens?"
│  ├─ "I get them wrong a lot" → DIAGNOSIS: Difficulty level mismatch
│  │  ACTION: Assess prerequisites
│  │  STEPS:
│  │    1. "Go back one chapter/topic level"
│  │    2. "Test yourself on that material"
│  │    3. "If >85% correct, move back up"
│  │    4. "If <70% correct, you found the gap"
│  │    5. "Master this level before moving forward"
│  │
│  ├─ "I get them right when I practice" → DIAGNOSIS: Transfer problem
│  │  ACTION: Interleaved practice + varied contexts
│  │  STEPS:
│  │    1. "Mix problem types in practice sessions"
│  │    2. "Practice with different numbers/contexts"
│  │    3. "Do problems without formula sheets"
│  │    4. "Explain WHY solution works, not just HOW"
│  │
│  └─ "I can't remember what I studied" → DIAGNOSIS: No spaced repetition
│     ACTION: Implement review schedule
│     STEPS:
│       1. "Create schedule: review at 1, 3, 7 days"
│       2. "Review = active recall, not re-reading"
│       3. "Track what you remember vs forget"
│       4. "Adjust intervals based on difficulty"

QUESTION 3: "How do you decide what to study each day?"
│
├─ "Whatever seems most important" → DIAGNOSIS: No systematic approach
│  ACTION: Implement structured planning
│  STEPS:
│    1. List all topics
│    2. Rate current mastery (1-5)
│    3. Prioritize topics rated 2-3 (highest ROI)
│    4. Schedule specific sessions for each
│
├─ "I just work through the textbook" → DIAGNOSIS: No feedback loop
│  ACTION: Test-driven studying
│  STEPS:
│    1. Self-test FIRST to identify gaps
│    2. Study specific gaps
│    3. Re-test to confirm mastery
│    4. Move to next area
│
└─ "I study what I'm worst at" → GOOD INSTINCT, but check:
   QUESTION: "How do you know what you're worst at?"
   ├─ "It feels hardest" → Unreliable, implement testing
   └─ "I test myself and track it" → EXCELLENT, optimize technique

FINAL CHECK: "How much time do you spend on each type of activity?"
│
├─ Calculate ratio: Active (recall, practice) vs Passive (reading, watching)
├─ TARGET: 80% active, 20% passive
├─ IF BELOW TARGET: "This is your problem. Hours don't matter if they're passive."
└─ ACTION PLAN: Rebuild study sessions with active focus

TERMINATION:
"Let's run an experiment. For the next week:
 1. Track time spent on active vs passive study
 2. Use active recall as primary method
 3. Test yourself before and after each session
 At the end of the week, compare your ability to recall material
 versus previous weeks. I predict you'll see significant improvement
 in LESS time."
```

---

## Decision Tree 4: Student Can't Focus

```
START: Student reports difficulty focusing, getting distracted

QUESTION 1: "When you sit down to study, how long before you get distracted?"
├─ <5 minutes → SEVERE: Immediate distraction
├─ 5-15 minutes → MODERATE: Short attention span
├─ 15-30 minutes → MILD: Normal challenge
└─ >30 minutes → SPECIFIC: Fatigue or topic-specific

PATH: SEVERE (Distracted within 5 minutes)
│
├─ QUESTION 2: "What typically distracts you?"
│  ├─ Phone/social media → DIAGNOSIS: Environmental control issue
│  │  ACTION: Digital Quarantine
│  │  STEPS:
│  │    1. Phone in different room (not just silent)
│  │    2. Website blockers on computer
│  │    3. Offline mode if possible
│  │    4. Check messages only during scheduled breaks
│  │
│  ├─ Random thoughts/worries → DIAGNOSIS: Mental clutter
│  │  ACTION: Brain Dump Protocol
│  │  STEPS:
│  │    1. Before studying: 5-minute brain dump
│  │    2. Write down all distracting thoughts
│  │    3. Schedule time to address them later
│  │    4. Keep notepad nearby for new thoughts during study
│  │    5. Acknowledge thought, write it down, return to work
│  │
│  ├─ Other people/noise → DIAGNOSIS: Environment issue
│  │  ACTION: Sacred Space Protocol
│  │  STEPS:
│  │    1. Find or create quiet space
│  │    2. Communicate "do not disturb" hours
│  │    3. Use noise-canceling headphones if needed
│  │    4. Library, coffee shop, or quiet room
│  │
│  └─ Urge to do other tasks → DIAGNOSIS: Task anxiety
│     ACTION: Structured Planning
│     STEPS:
│       1. Write today's task list before studying
│       2. Assign time blocks to each
│       3. Permission to ignore other tasks during study block
│       4. They have their time, this is study time

├─ QUESTION 3: "Have you tried any focus techniques?"
│  ├─ NO → IMPLEMENT: Pomodoro Technique (Modified)
│  │  STEPS:
│  │    1. Set timer for 10 minutes (shorter due to severe distraction)
│  │    2. ONLY study during those 10 minutes
│  │    3. Take 2-minute break (stand up, walk)
│  │    4. Repeat
│  │    5. Gradually increase to 15, then 20, then 25 minutes
│  │
│  │  RATIONALE: Build focus muscle gradually
│  │
│  └─ YES, but didn't work → Investigate why
│     QUESTION: "What happened when you tried?"
│     - Timer created pressure → Try no timer, just one task completion
│     - Couldn't take real breaks → Emphasize breaks are mandatory
│     - Inconsistent application → Commit to 3 days minimum

PATH: MODERATE (5-15 minutes focus)
│
├─ IMPLEMENT: Standard Pomodoro (25/5)
├─ ADD: Single-tasking discipline
│  "One subject, one type of activity per pomodoro"
├─ CHECK: Material difficulty
│  "If material too hard or too easy, focus suffers"
│  ADJUST: Find 70-85% success rate sweet spot

PATH: MILD (15-30 minutes focus)
│
├─ This is relatively normal
├─ OPTIMIZE: Use natural attention spans
│  "Work in 25-30 minute blocks"
│  "Take real breaks between"
│  "Match task difficulty to focus capacity"

PATH: SPECIFIC (Good focus but degrades)
│
├─ QUESTION 4: "What time of day is this?"
│  ├─ Late night → DIAGNOSIS: Fatigue
│  │  ACTION: Respect circadian rhythm
│  │  STEPS:
│  │    1. Schedule deep work during peak hours (usually morning)
│  │    2. Lighter tasks in afternoon/evening
│  │    3. Stop studying 1-2 hours before bed
│  │
│  ├─ After meals → DIAGNOSIS: Postprandial dip (normal)
│  │  ACTION: Schedule around it
│  │  STEPS:
│  │    1. Don't schedule hard focus work post-lunch
│  │    2. Use this time for lighter tasks
│  │    3. Deep work 2-3 hours after waking, late afternoon
│  │
│  └─ After long session → DIAGNOSIS: Mental fatigue
│     ACTION: Break pattern
│     STEPS:
│       1. Maximum 90-minute deep focus blocks
│       2. 15-minute real break after each
│       3. Different activity type after 2 blocks

UNIVERSAL INTERVENTIONS (Apply regardless of severity):

1. THE 5-MINUTE RULE (For starting difficulty)
   "Just commit to 5 minutes. Usually you'll continue, but if not, at least you did 5."

2. SINGLE-TASKING
   "One browser tab, one document, one problem. Close everything else."

3. PHYSICAL MOVEMENT
   "Between sessions: stand up, walk around, get water. Blood flow = better focus."

4. CAFFEINE TIMING
   "If using caffeine, time it 30 minutes before study session. Avoid after 2pm if it affects sleep."

5. PROGRESS VISIBILITY
   "Check off completed pomodoros. Visual progress builds motivation."

6. FOCUS AUDIT
   "Track each time you get distracted. What triggered it? When? Why?
    Patterns will emerge. Address root causes."

TERMINATION:
"Let's start with [chosen intervention] for just 3 days.
 Track your focus duration and number of distraction-free blocks.
 You should see measurable improvement. Then we can add more techniques."
```

---

## Decision Tree 5: Student Procrastinating

```
START: Student says "I keep putting off studying" or "I can't get myself to start"

QUESTION 1: "When you think about starting to study, what feeling comes up?"
├─ "Overwhelm" / "Don't know where to start" → PATH A: Paralysis by Analysis
├─ "Dread" / "I hate it" → PATH B: Aversion
├─ "Guilt" / "I should have started earlier" → PATH C: Shame Spiral
└─ "Nothing really, I just don't do it" → PATH D: Habit/System Issue

PATH A: Paralysis by Analysis (Overwhelm)
│
├─ DIAGNOSIS: Task seems too large, unclear, or complex
│
├─ INTERVENTION: The Breakdown Protocol
│  STEPS:
│    1. "List everything you think you need to do"
│    2. "Pick ONE item from that list"
│    3. "Break that one item into stupidly small steps"
│    4. "Do just the first step (5 minutes max)"
│
│  EXAMPLE:
│    Student: "I need to study for biology exam"
│    Coach: "Too big. What's one topic?"
│    Student: "Cell respiration"
│    Coach: "What's the first tiny step?"
│    Student: "Read the section"
│    Coach: "Smaller. Read one paragraph?"
│    Student: "Okay, read one paragraph"
│    Coach: "Do that right now. Set a timer for 5 minutes."
│
├─ PSYCHOLOGICAL PRINCIPLE: Activation energy
│  "Starting is hardest. Once moving, momentum carries you forward."
│  "80% of the time, you'll continue past 5 minutes."
│
└─ FOLLOW-UP: Build from success
   "You just started! That was the hard part. Now do one more small step."

PATH B: Aversion (Dread/Hate)
│
├─ QUESTION 2: "What specifically do you hate about it?"
│  ├─ "The subject is boring" → SUB-PATH B1: Interest problem
│  ├─ "It's too hard" → SUB-PATH B2: Difficulty problem
│  ├─ "I'm bad at it" → SUB-PATH B3: Confidence problem
│  └─ "It takes too long" → SUB-PATH B4: Endurance problem

SUB-PATH B1: Boring subject
│
├─ REFRAME: "Boring = not engaging your brain in interesting way"
│
├─ INTERVENTION: Gamification & Challenge
│  STRATEGIES:
│    1. "How fast can you recall 10 facts about this?"
│    2. "Can you explain this to a 10-year-old?"
│    3. "Create a weird analogy or story about this concept"
│    4. "Find one surprising/weird thing about this topic"
│    5. "Compete with yourself: beat yesterday's score"
│
└─ ALTERNATIVE: Pair with reward
   "Study for 25 minutes → guilt-free [activity student enjoys] for 10 minutes"

SUB-PATH B2: Too hard
│
├─ INTERVENTION: Difficulty Stepping
│  STEPS:
│    1. "Go back to last thing that made sense"
│    2. "Master that completely (can explain it)"
│    3. "Take one small step forward"
│    4. "Test yourself"
│    5. "If >70% correct, next step. If <70%, stay here."
│
└─ REFRAME: "It's supposed to be hard. Hard = learning happening."
   "Easy = no growth. Hard = your brain building new connections."

SUB-PATH B3: Confidence problem
│
├─ INTERVENTION: Evidence-Based Confidence Building
│  STEPS:
│    1. "List 3 things you CAN do in this subject"
│    2. "Pick the easiest next topic"
│    3. "Master it completely using active recall"
│    4. "Prove to yourself you can do it"
│    5. "Celebrate that win"
│    6. "Move to next topic from position of success"
│
└─ REFRAME: "You're not bad at it, you're early in learning it."
   "Everyone sucks at everything before they practice."

SUB-PATH B4: Takes too long
│
├─ INTERVENTION: Efficiency Upgrade
│  "You're right that it takes too long—because current methods are inefficient."
│
│  STEPS:
│    1. Audit current methods (usually passive)
│    2. Switch to active recall (faster mastery)
│    3. Use Pomodoro (makes time visible and finite)
│    4. Track: "What can I master in 25 minutes?"
│    5. Optimize based on data
│
└─ REFRAME: "Work smarter = more free time, not more study time"

PATH C: Shame Spiral (Guilt about not starting)
│
├─ DIAGNOSIS: Past procrastination causing guilt, which causes more procrastination
│
├─ INTERVENTION: Clean Slate Protocol
│  COACH: "The past is done. You can't change that you didn't start Monday.
│          But you CAN start now. This moment is what counts."
│
│  STEPS:
│    1. "Acknowledge: Yes, I wish I'd started earlier"
│    2. "Release: That's in the past, can't change it"
│    3. "Redirect: What's the smallest thing I can do RIGHT NOW?"
│    4. "Action: Do that thing"
│    5. "Celebrate: I just started. Progress from here."
│
├─ REFRAME: Progress > perfection
│  "Imperfect action beats perfect inaction"
│  "10 minutes today > 0 minutes waiting for 'ideal' time"
│
└─ TIME PERSPECTIVE: "You have more time than you think"
   "If exam is Friday and it's Wednesday, you have 48 hours.
    Even 6 hours of focused study can make massive difference.
    But each hour you delay = one less hour available."

PATH D: Habit/System Issue
│
├─ DIAGNOSIS: No triggers, no routine, no system
│
├─ INTERVENTION: Implementation Intentions
│  FORMAT: "When [trigger], I will [action] in [location]"
│
│  EXAMPLES:
│    "When I finish breakfast, I will study biology for 25 minutes at kitchen table"
│    "When I get home from class, I will do active recall for 15 minutes at desk"
│    "When alarm goes off at 7pm, I will start first Pomodoro in library"
│
├─ STEPS:
│  1. "Choose specific trigger (time, location, or preceding action)"
│  2. "Choose specific action (not 'study' but 'do 10 flashcards')"
│  3. "Choose specific location"
│  4. "Write it down"
│  5. "Follow through for 3 days minimum"
│
└─ PRINCIPLE: Remove decision fatigue
   "When the time comes, you don't think, you just do.
    Decision was made in advance."

UNIVERSAL ANTI-PROCRASTINATION TOOLS:

1. THE 5-MINUTE RULE
   "Commit to just 5 minutes. Set timer. Do one tiny task. Re-evaluate after."

2. TEMPTATION BUNDLING
   "Pair unpleasant task with pleasant experience"
   "Study at favorite coffee shop, nice music, good lighting"

3. ACCOUNTABILITY
   "Tell someone: 'I'm going to study for 30 minutes starting now. Check in with me.'"

4. REMOVE FRICTION
   "Make starting easier: materials already out, space prepared, phone away"

5. ADD FRICTION TO DISTRACTIONS
   "Make procrastination harder: logout of socials, block websites, phone in other room"

6. VISUAL PROGRESS
   "Check off completed sessions. Seeing streak builds momentum."

TERMINATION SEQUENCE:

"Right now, let's do this:
 1. Pick the tiniest possible study task (5 minutes max)
 2. Tell me what it is
 3. Set a timer
 4. Do it while we're talking
 5. Report back how it felt

Usually starting is 80% of the battle. Once you start, continuing is easier."

FOLLOW-UP: "What made you procrastinate this time? Let's address that root cause so it doesn't happen again."
```

---

## Decision Tree 6: Student Doesn't Know What to Study

```
START: Student says "I don't know what to study" or "Where should I focus?"

QUESTION 1: "Do you have a syllabus, topic list, or exam outline?"
├─ NO → ACTION: "Get that first. Ask instructor/check course materials. Can't plan without it."
└─ YES → Continue

QUESTION 2: "Do you know what format the assessment will be?"
├─ Multiple choice → STRATEGY: Recognition + application
├─ Short answer → STRATEGY: Recall + concise explanation
├─ Essay/long answer → STRATEGY: Deep understanding + argumentation
├─ Problem solving → STRATEGY: Application + methodology
└─ Mixed → STRATEGY: Flexible preparation

QUESTION 3: "Have you had any assessments in this course yet?"
│
├─ YES → "What did they test? What did you get wrong?"
│  ACTION: Past Exam Analysis
│  STEPS:
│    1. Review previous tests/quizzes
│    2. Identify patterns: what types of questions, which topics, what depth
│    3. Note what you got wrong (these are current gaps)
│    4. Predict: "What topics haven't been tested yet but are likely to be?"
│    5. Prioritize: Untested topics + topics you got wrong
│
└─ NO → "What has the instructor emphasized? What did they spend most time on?"
   ACTION: Signal Detection
   STEPS:
     1. Instructor spent >1 lecture → High importance
     2. Mentioned "this is important" / "this will be on test" → Obvious signal
     3. Assigned multiple problems on topic → High importance
     4. Topic in multiple contexts → Core concept
     5. Start with these high-signal topics

DECISION POINT: "Can you recall main concepts from each topic?"
│
├─ YES (or "mostly") → PATH A: Selective Optimization
├─ NO → PATH B: Comprehensive Foundation Building
└─ SOME topics yes, some no → PATH C: Gap-Based Prioritization

PATH A: Selective Optimization
│
├─ ACTION: Pareto Analysis
│  STEPS:
│    1. "List all topics (from syllabus/outline)"
│    2. "Rate your current mastery: 1 (can't recall) to 5 (can teach it)"
│    3. "Rate importance/likelihood on exam: 1 (minor) to 5 (critical)"
│    4. "Calculate priority score: (Importance) × (6 - Mastery)"
│       - Example: Important topic (5) you're weak at (2) = 5 × 4 = 20
│       - Example: Minor topic (2) you know well (5) = 2 × 1 = 2
│    5. "Study in descending priority order"
│
├─ FOCUS AREAS:
│  - High importance, low mastery (biggest ROI)
│  - High importance, medium mastery (securing core points)
│  - Medium importance, low mastery (if time allows)
│
└─ SKIP:
   - Low importance, high mastery (diminishing returns)
   - Very low importance, any mastery (not worth time)

PATH B: Comprehensive Foundation Building
│
├─ DIAGNOSIS: Need to build base-level familiarity with all material
│
├─ ACTION: Survey-and-Prioritize
│  STEPS:
│    1. "Skim all material once (quickly)"
│    2. "For each topic, do 5-minute active recall: What do I remember?"
│    3. "This reveals what stuck vs what didn't"
│    4. "Topics where you remember nothing = highest priority"
│    5. "Start with those, build foundation"
│
├─ STUDY SEQUENCE:
│  For each priority topic:
│    1. Read/watch material (20 min)
│    2. Active recall session (15 min)
│    3. Practice questions (25 min)
│    4. Move to next topic
│    5. Review first topic next day (spaced repetition)
│
└─ GOAL: Baseline familiarity with all topics, then deepen high-priority ones

PATH C: Gap-Based Prioritization (Most Common)
│
├─ ACTION: Two-Pass System
│
├─ PASS 1: Fill Critical Gaps
│  STEPS:
│    1. "List topics you can't recall or explain"
│    2. "Cross-reference with high-importance topics"
│    3. "Study these FIRST using active recall + practice"
│    4. "Goal: Get from 1-2 mastery to 3-4 mastery"
│
└─ PASS 2: Optimize Strong Areas
   STEPS:
     1. "For topics you already know reasonably well"
     2. "Do practice problems to identify specific weak spots"
     3. "Polish these to high mastery"
     4. "These become your 'sure points' on exam"

DECISION POINT: "How much time until assessment?"
│
├─ <3 days → EMERGENCY: Top 20% only (Pareto principle)
├─ 3-7 days → INTENSIVE: Critical gaps + high-importance topics
├─ 1-2 weeks → STANDARD: Gaps, high-importance, then comprehensive
└─ >2 weeks → OPTIMAL: Comprehensive with spaced repetition

IMPLEMENTATION: Create Specific Study Plan

STEP 1: Make topic inventory
"List every topic/chapter/concept that could be tested"

STEP 2: Assess each topic
"Rate mastery (1-5) and importance (1-5)"

STEP 3: Calculate study order
"Priority = Importance × (6 - Mastery)"
"Sort descending"

STEP 4: Allocate time
"If you have 10 hours of study time:
 - Top 3 priorities: 5 hours (50%)
 - Next 5 priorities: 3 hours (30%)
 - Remaining topics: 2 hours (20%)"

STEP 5: Schedule specific sessions
"Don't just say 'study biology'
 Say: 'Tuesday 2-3pm: Active recall on cell respiration + 10 practice problems'"

EXAMPLE OUTPUT:

PRIORITY STUDY PLAN
Total time available: 12 hours
Exam date: Friday

HIGH PRIORITY (6 hours):
1. Cell Respiration (Importance: 5, Mastery: 2, Priority: 20)
   - Tuesday 2-4pm: Active recall + Feynman explanation + practice problems
   - Thursday 10-12pm: Review + additional practice

2. Protein Synthesis (Importance: 5, Mastery: 3, Priority: 15)
   - Tuesday 7-8:30pm: Active recall + create diagram from memory
   - Thursday 2-3:30pm: Practice questions

3. Mitosis/Meiosis (Importance: 4, Mastery: 2, Priority: 16)
   - Wednesday 9-11am: Visual diagram practice + comparison tables

MEDIUM PRIORITY (4 hours):
4. DNA Structure (Importance: 4, Mastery: 3, Priority: 12)
   - Wednesday 2-3pm: Quick review + practice questions

5. Enzymes (Importance: 3, Mastery: 2, Priority: 12)
   - Wednesday 7-8pm: Active recall + problem solving

6. Cell Structure (Importance: 3, Mastery: 3, Priority: 9)
   - Thursday 4-5pm: Quick review + self-testing

LOW PRIORITY (2 hours):
7-10. Remaining topics: Thursday evening, quick review only

TERMINATION:
"You now have a clear roadmap. You know exactly what to study, when, and why.
 Start with Priority #1 right now. Check it off when done.
 This is how you convert confusion into action."
```

---

## Decision Tree 7: Student Overwhelmed by Material Volume

```
START: Student says "There's too much material" or "I can't possibly learn all this"

QUESTION 1: "Is this feeling based on actual assessment of material or general anxiety?"
├─ "I haven't looked through it all" → PATH A: Perception vs Reality
├─ "I've seen it, it's genuinely massive" → PATH B: Volume Management
└─ "I've tried to learn it all and can't" → PATH C: Efficiency Problem

PATH A: Perception vs Reality (Fear of Unknown)
│
├─ INTERVENTION: Reconnaissance Mission
│  "Let's look at it together and see what we're actually dealing with"
│
├─ STEPS:
│  1. "List all topics that could be tested"
│  2. "Count them"
│  3. "How much time until exam?"
│  4. "Calculate: Hours available ÷ Number of topics = Hours per topic"
│
│  EXAMPLE:
│    - 20 topics to cover
│    - 14 days until exam
│    - 2 hours study time per day = 28 hours total
│    - 28 hours ÷ 20 topics = 1.4 hours per topic
│    - PLUS review time
│
│  REFRAME: "See? You have over an hour per topic. That's doable."
│
├─ FOLLOW-UP: "Does this still feel overwhelming?"
│  ├─ YES → Move to PATH B (actually is a lot)
│  └─ NO → "Great. Let's create a schedule so you can see it laid out"

PATH B: Volume Management (Genuinely Large Amount)
│
├─ PRINCIPLE: "You can't learn everything. You need to be strategic."
│
├─ STEP 1: Triage (Medical approach)
│  "In emergency medicine, you treat critical patients first. Same here."
│
│  CATEGORIES:
│    RED (Critical): Must know, high-value, likely tested
│    YELLOW (Important): Should know, medium-value
│    GREEN (Nice-to-have): Could know, low-value or unlikely tested
│
│  ACTION: "Go through syllabus/topics and categorize each one"
│
├─ STEP 2: Pareto Principle
│  "20% of material yields 80% of the value"
│  "Let's identify that 20%"
│
│  IDENTIFICATION SIGNALS:
│    - Instructor spent most time on it
│    - Appears in multiple contexts
│    - Foundational concept (other topics build on it)
│    - Explicitly mentioned as "important"
│    - Previous exams emphasized it
│
│  ACTION: "Mark these as your core focus"
│
├─ STEP 3: Satisficing vs Maximizing
│  EXPLAIN: "Satisficing = good enough to meet goal"
│           "Maximizing = perfect understanding of everything"
│           "In volume situations, satisficing is smart strategy"
│
│  TARGET: "Aim for 70-80% mastery on critical topics
│           Rather than 100% mastery on fewer topics"
│
│  PRACTICAL: "You can get a good grade without knowing everything perfectly.
│              Focus on knowing critical things well."
│
├─ STEP 4: Create Tiered Study Plan
│
│  TIER 1 (60% of time): Red topics
│    - Deep study
│    - Active recall
│    - Multiple practice problems
│    - Spaced repetition
│
│  TIER 2 (30% of time): Yellow topics
│    - Solid understanding
│    - Some practice
│    - One review session
│
│  TIER 3 (10% of time): Green topics
│    - Survey/skim
│    - Familiarity only
│    - Maybe skip if time limited
│
└─ PSYCHOLOGICAL SUPPORT:
   "It's okay to not know everything. That's not failure, that's strategy.
    You're optimizing for best outcome with available time."

PATH C: Efficiency Problem (Time invested, not learning fast enough)
│
├─ DIAGNOSIS: Methods are too slow/inefficient
│
├─ QUESTION 2: "What's your current study method?"
│  └─ LISTEN FOR: Passive methods (reading, highlighting, note-taking)
│
├─ INTERVENTION: Efficiency Upgrade
│
│  CURRENT STATE: "Reading everything carefully, making detailed notes"
│  TIME COST: Very high
│  RETENTION: Low (passive methods)
│
│  NEW STATE: "Strategic reading + active recall"
│  TIME COST: Lower
│  RETENTION: High (active methods)
│
├─ SPECIFIC TECHNIQUES:
│
│  1. FIRST-PASS READING
│     OLD: "Read every word carefully, take notes on everything"
│     NEW: "Skim to identify key concepts, deep read only those sections"
│     TIME SAVED: 40-50%
│
│  2. ACTIVE RECALL IMMEDIATELY
│     OLD: "Read chapter, then read again, then maybe do questions"
│     NEW: "Read section, close book, write what you remember, move on"
│     TIME SAVED: 30-40% (no re-reading)
│     RETENTION: 2x better
│
│  3. PRACTICE-FIRST LEARNING
│     OLD: "Study material, then practice"
│     NEW: "Try practice problems first, study to fill gaps revealed"
│     TIME SAVED: Only study what you actually need
│
│  4. INTERLEAVING
│     OLD: "Master Chapter 1 completely, then Chapter 2, then Chapter 3"
│     NEW: "Rotate through chapters, building all simultaneously"
│     TIME SAVED: Reduces re-learning time
│
│  5. ELIMINATE LOW-VALUE ACTIVITIES
│     OLD: Making elaborate notes, perfect summaries, highlighting
│     NEW: Minimal notes, active recall, practice problems
│     TIME SAVED: 50%+
│
└─ REFRAME: "You don't have a volume problem, you have a speed problem.
            Speed up learning = volume becomes manageable"

UNIVERSAL STRATEGIES FOR VOLUME:

1. CHUNKING
   "Don't see 200 pages. See 10 chunks of 20 pages."
   "Don't see 50 concepts. See 5 categories with 10 concepts each."

2. PROGRESSIVE DISCLOSURE
   "You don't need to learn everything at once."
   "Build foundation, then add layers."
   "Week 1: Basics of all topics (breadth)"
   "Week 2: Depth on critical topics"

3. PATTERN RECOGNITION
   "Many concepts are variations on patterns"
   "Learn the pattern once, apply to multiple contexts"
   "Example: Problem-solving approaches often transfer across topics"

4. RUTHLESS PRIORITIZATION
   "Not all topics are equal"
   "Be willing to sacrifice low-value topics for high-value ones"
   "Better to know critical things well than everything poorly"

5. COMPOUND LEARNING
   "Look for topics that help you understand other topics"
   "Study these first—they're force multipliers"

TACTICAL EXERCISE: Break down one topic right now

"Pick one topic that feels overwhelming. Let's break it down:
 1. What's the core concept?
 2. What are 3-5 key facts/principles?
 3. What's one practice question?
 4. Can you answer that question?

See? One topic down. Now you have a template for the rest."

TERMINATION:
"Volume is manageable when you:
 1. Prioritize strategically (not everything is equal)
 2. Use efficient methods (active recall, not passive reading)
 3. Break into chunks (one topic at a time)
 4. Track progress (seeing progress reduces overwhelm)

Let's create a realistic plan that covers critical material well,
rather than trying to cover everything perfectly. You've got this."
```

---

## Decision Tree 8: Student Forgot Material They Studied

```
START: Student says "I studied this but I forgot it" or "I blank out during tests"

QUESTION 1: "When did you study this material?"
├─ "Last night/yesterday" → PATH A: Encoding Problem
├─ "A few days ago" → PATH B: No Spacing/Review
├─ "Weeks ago" → PATH C: Normal Forgetting Curve
└─ "I've studied it multiple times" → PATH D: Retrieval Practice Issue

PATH A: Encoding Problem (Studied recently but can't recall)
│
├─ DIAGNOSIS: Information never properly encoded into memory
│
├─ QUESTION 2: "How did you study it?"
│  ├─ "Read it" / "Looked over notes" → DIAGNOSIS: Passive exposure only
│  ├─ "Highlighted" / "Made flashcards" → DIAGNOSIS: Minimal processing
│  └─ "Tried to recall it" → Move to PATH D
│
├─ EXPLAIN PROBLEM:
│  "Your brain didn't encode this because you didn't force it to.
│   Reading creates familiarity, not memory.
│   Recognition (seeing it and thinking 'I know this') ≠ Recall (producing it from memory)"
│
├─ INTERVENTION: Proper Encoding Protocol
│
│  STEPS:
│    1. INITIAL EXPOSURE (20 min)
│       - Read material actively (asking questions as you go)
│       - Not passive consumption
│
│    2. IMMEDIATE ACTIVE RECALL (15 min)
│       - Close materials
│       - Write everything you remember
│       - Don't peek!
│
│    3. GAP ANALYSIS (10 min)
│       - Open materials
│       - Check what you missed
│       - Focus on these gaps
│
│    4. SECOND ACTIVE RECALL (10 min)
│       - Close materials again
│       - Recall, focusing on previously missed items
│
│    5. ELABORATION (15 min)
│       - Explain concepts in your own words
│       - Create examples
│       - Connect to what you already know
│
└─ KEY PRINCIPLE: "Struggle = encoding. If it feels easy, you're not encoding."

PATH B: No Spacing/Review (Studied but only once)
│
├─ EXPLAIN: The Forgetting Curve
│  "Without review:
│   - After 20 min: Forget 40%
│   - After 24 hours: Forget 70%
│   - After 1 week: Forget 90%
│
│   This is normal! Not a personal failing.
│   But it means one-time studying = guaranteed forgetting"
│
├─ INTERVENTION: Spaced Repetition System
│
│  STANDARD SCHEDULE:
│    1. Initial learning: Day 0
│    2. First review: Day 1 (24 hours later)
│    3. Second review: Day 3
│    4. Third review: Day 7
│    5. Fourth review: Day 14
│    6. Fifth review: Day 30 (or before exam)
│
│  WHAT HAPPENS:
│    - Each review reinforces memory
│    - Intervals get longer as memory strengthens
│    - Eventually becomes long-term memory
│
├─ PRACTICAL IMPLEMENTATION:
│  "For material you just studied today:
│   - Put reminder in calendar for tomorrow: 'Review [topic]'
│   - 15-minute active recall session
│   - Repeat at 3 days, 7 days
│   - This prevents forgetting"
│
└─ ADDRESS RESISTANCE:
   Student: "I don't have time to review"
   Coach: "You'll spend MORE time re-learning from scratch before exam.
           15 min review now saves hours of re-learning later."

PATH C: Normal Forgetting Curve (Studied weeks ago, no review)
│
├─ RESPONSE: "This is completely expected. You're not broken, you're human."
│
├─ EXPLAIN: "Without review, forgetting is guaranteed by neuroscience.
│           The solution isn't to be harder on yourself.
│           The solution is to build review into your system."
│
├─ IMMEDIATE ACTION:
│  "Right now, can you recall ANYTHING about this topic?"
│  ├─ YES → "Good! That's your anchor. Build from there."
│  │  STEPS:
│  │    1. Write what you remember (even if fragmentary)
│  │    2. Fill gaps with targeted re-learning
│  │    3. This is faster than learning from scratch
│  │
│  └─ NO → "Okay, you need to re-learn this. But now we'll do it right."
│     STEPS:
│       1. Re-learn with active recall (not just re-reading)
│       2. Immediately schedule reviews (don't let this happen again)
│       3. Set up spacing system
│
└─ PREVENTION:
   "Going forward, use spaced repetition from Day 1.
    Then this doesn't happen."

PATH D: Retrieval Practice Issue (Studied multiple times, still forgetting)
│
├─ QUESTION 3: "When you reviewed, how did you do it?"
│  ├─ "Re-read notes" / "Looked over material" → DIAGNOSIS: Passive review
│  ├─ "Did flashcards but they felt easy" → DIAGNOSIS: Recognition vs recall
│  └─ "Tested myself and did well" → QUESTION 4

DIAGNOSIS: Passive Review (Ineffective)
│
├─ EXPLAIN: "Re-reading creates fluency illusion.
│           Material feels familiar, so you think you know it.
│           But recognition ≠ recall under test conditions."
│
├─ INTERVENTION: Active Review Protocol
│
│  INSTEAD OF: "Looking over notes"
│  DO THIS:
│    1. Close all materials
│    2. Write/say everything you know about topic
│    3. Check against materials
│    4. Identify what you couldn't recall
│    5. Study those gaps specifically
│    6. Test recall again
│
└─ KEY: "Review must be as hard as test will be.
        If test requires recall, review must require recall."

DIAGNOSIS: Recognition vs Recall Gap
│
├─ EXPLAIN: "Flashcards where you see question and immediately see answer
│           = recognition practice.
│           Tests where you see question and must produce answer
│           = recall requirement.
│           You practiced wrong skill."
│
├─ INTERVENTION: Proper Flashcard Usage
│
│  WRONG WAY:
│    - Flip card quickly
│    - "Oh yeah, I knew that"
│    - Move to next card
│
│  RIGHT WAY:
│    1. Read question
│    2. Say/write complete answer (don't peek!)
│    3. Flip to check
│    4. Grade yourself honestly:
│       - Correct + confident → Extended interval
│       - Correct but struggled → Normal interval
│       - Incorrect → Back to beginning
│
└─ ADDITIONAL: Free Recall Practice
   "Beyond flashcards, do blank-page testing:
    - What are all the concepts from this chapter?
    - Explain each one
    - Check comprehensiveness"

QUESTION 4: "Tested yourself and did well in review, but forgot during actual test?"
│
├─ DIAGNOSIS: Context-Dependent Memory / Test Anxiety
│
├─ QUESTION 5: "Was test environment very different from study environment?"
│  └─ Potentially context-dependent memory issue
│
├─ QUESTION 6: "Did you feel anxious during test?"
│  ├─ YES → Anxiety interfering with retrieval
│  │  INTERVENTION: Test Simulation
│  │    - Practice under test conditions
│  │    - Time pressure
│  │    - No notes
│  │    - Quiet environment
│  │    - Desensitizes anxiety
│  │
│  └─ NO → DIAGNOSIS: Retrieval strength vs storage strength
│
├─ EXPLAIN: Retrieval Strength vs Storage Strength
│  "You stored the info (it's in your brain somewhere)
│   But retrieval pathway is weak (can't access it under pressure)
│   Solution: More retrieval practice, less storage practice"
│
└─ INTERVENTION: Harder Retrieval Practice

   STEPS:
     1. Practice without any cues
     2. Practice in different contexts
     3. Practice while tired/distracted (builds robustness)
     4. Practice with time pressure
     5. Practice explaining in different ways

   GOAL: Make retrieval pathway so strong that even under stress, it works

UNIVERSAL MEMORY PRINCIPLES:

1. ACTIVE RECALL > RE-READING
   "Every single time"

2. SPACING > MASSING
   "3 sessions of 20 min (spaced) > 1 session of 60 min (massed)"

3. TESTING > STUDYING
   "Testing is studying. It's the most effective form."

4. DIFFICULTY IS DESIRABLE
   "If recall feels easy, you're not strengthening the memory"

5. SLEEP MATTERS
   "Memory consolidation happens during sleep"
   "Studying before sleep = bonus consolidation"

DIAGNOSTIC QUESTION FOR STUDENT:
"On a scale of 1-10, how hard was it to recall material during study/review?"
├─ 1-3 (Easy) → "Too easy. Won't stick. Need harder retrieval practice."
├─ 4-7 (Moderate) → "Perfect. Desirable difficulty zone."
└─ 8-10 (Impossible) → "Too hard. Need to build foundation first."

TERMINATION:
"Forgetting is normal. But repeated forgetting means method is wrong.

 To remember long-term:
 1. Encode actively (active recall, not passive reading)
 2. Review with spacing (1, 3, 7, 14, 30 days)
 3. Practice retrieval, not recognition
 4. Make recall difficult (that's what strengthens memory)

 Let's set up a review schedule for material you need to remember.
 I'll help you build a system so this doesn't keep happening."
```

---

## Meta-Decision Tree: Choosing Which Tree to Use

```
START: Student presents a problem

STEP 1: Identify primary concern
│
├─ Keywords about performance → Tree 1 (Struggling with Course)
├─ Keywords about time pressure → Tree 2 (Cramming for Exam)
├─ Keywords about effort vs results → Tree 3 (Hours But Not Improving)
├─ Keywords about attention → Tree 4 (Can't Focus)
├─ Keywords about avoidance → Tree 5 (Procrastinating)
├─ Keywords about direction → Tree 6 (Doesn't Know What to Study)
├─ Keywords about scope → Tree 7 (Overwhelmed by Volume)
└─ Keywords about retention → Tree 8 (Forgot Material)

STEP 2: If unclear, ask clarifying question
"What's your main challenge right now:
 - Understanding/performance?
 - Time management?
 - Motivation/getting started?
 - Knowing what to focus on?
 - Remembering what you studied?"

STEP 3: Follow appropriate tree, but remain flexible
"Trees are starting points, not rigid scripts.
 Often students have multiple issues (e.g., procrastinating AND don't know what to study).
 Address most urgent first, then cascade to others."

STEP 4: After solving primary issue, check for secondary issues
"Great! We've addressed [primary issue].
 Are there any other challenges you're facing?"

PRINCIPLE: Systematic diagnosis, human delivery
"Use trees for logic, but respond with empathy and adaptation to individual context."
```

---

## Usage Notes for LLM Agents

1. **Start with questions**: Don't assume the diagnosis. Ask to confirm before prescribing.

2. **Follow the logic**: Trees provide branching logic. Actually use the if-then structure.

3. **Be specific**: When prescribing actions, give concrete steps, not vague advice.

4. **Explain why**: Students adopt techniques better when they understand the reasoning.

5. **One change at a time**: Don't overwhelm with entire framework. Fix one thing, then build.

6. **Adapt to context**: Trees are templates. Modify based on student's specific situation.

7. **Check for comprehension**: After explaining, ask: "Does this make sense? Any questions?"

8. **Set success criteria**: "You'll know this is working when..."

9. **Schedule follow-up**: "Try this for X days, then let's discuss results"

10. **Celebrate progress**: Acknowledge when student tries something new or shows improvement

---

**Document version**: 1.0
**Last updated**: 2025-12-19
**Integration**: Use with key-concepts-summary.md for definitions, implementation-patterns.md for detailed protocols
