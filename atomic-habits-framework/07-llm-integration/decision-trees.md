# Decision Trees - Atomic Habits Framework

## Decision Tree 1: User Wants to Build a New Habit

```
START: User wants to build a new habit
│
├─→ Step 1: IDENTIFY THE DESIRED OUTCOME
│   │
│   ├─→ Q: "What result do you want to achieve?"
│   │   └─→ Store: OUTCOME
│   │
│   └─→ Step 2: IDENTIFY THE IDENTITY
│       │
│       ├─→ Q: "What type of person achieves this outcome?"
│       │   └─→ Store: TARGET_IDENTITY
│       │
│       └─→ Step 3: IDENTIFY THE HABIT
│           │
│           ├─→ Q: "What small habit would this type of person do regularly?"
│           │   └─→ Store: HABIT_BEHAVIOR
│           │
│           └─→ Step 4: APPLY 1ST LAW (Make it Obvious)
│               │
│               ├─→ Does user have a specific time/place in mind?
│               │   │
│               │   ├─→ YES → Create Implementation Intention
│               │   │   │     "I will [BEHAVIOR] at [TIME] in [LOCATION]"
│               │   │   └─→ Go to Step 5
│               │   │
│               │   └─→ NO → Does user have an existing habit to stack on?
│               │       │
│               │       ├─→ YES → Create Habit Stack
│               │       │   │     "After [CURRENT HABIT], I will [NEW HABIT]"
│               │       │   └─→ Go to Step 5
│               │       │
│               │       └─→ NO → Help identify anchor point
│               │           │   Q: "What do you do consistently every day?"
│               │           │   └─→ Create stack from that
│               │           └─→ Go to Step 5
│               │
│               └─→ Step 5: ENVIRONMENT DESIGN
│                   │
│                   ├─→ Q: "How can you make the cue for this habit visible?"
│                   │   └─→ Suggestions:
│                   │       - Place objects in sight
│                   │       - Set up space night before
│                   │       - Use visual reminders
│                   │       - Create dedicated space
│                   │   └─→ Store: ENVIRONMENT_CUES
│                   │
│                   └─→ Step 6: APPLY 2ND LAW (Make it Attractive)
│                       │
│                       ├─→ Q: "Do you naturally enjoy this habit?"
│                       │   │
│                       │   ├─→ YES → Proceed to Step 7
│                       │   │
│                       │   └─→ NO → Apply Temptation Bundling
│                       │       │   Q: "What do you enjoy doing that you could pair with this?"
│                       │       │   └─→ Create: "After [HABIT I NEED], I will [HABIT I WANT]"
│                       │       └─→ Store: TEMPTATION_BUNDLE
│                       │
│                       └─→ Step 7: MOTIVATION REFRAME
│                           │
│                           ├─→ Q: "What benefits will you gain from this habit?"
│                           │   └─→ Store: BENEFITS_LIST
│                           │
│                           ├─→ Create motivational statement
│                           │   └─→ "I get to [HABIT] because it helps me [BENEFIT]"
│                           │
│                           └─→ Step 8: APPLY 3RD LAW (Make it Easy)
│                               │
│                               ├─→ Is this habit currently too difficult?
│                               │   │
│                               │   ├─→ YES → Apply Two-Minute Rule
│                               │   │   │   Q: "What's the 2-minute version of this habit?"
│                               │   │   │   Examples:
│                               │   │   │   - "Exercise 30 min" → "Put on workout clothes"
│                               │   │   │   - "Read book" → "Read one page"
│                               │   │   │   - "Meditate 20 min" → "Sit on meditation cushion"
│                               │   │   └─→ Store: TWO_MINUTE_VERSION
│                               │   │
│                               │   └─→ NO → Keep as is
│                               │
│                               └─→ Step 9: REDUCE FRICTION
│                                   │
│                                   ├─→ Q: "What steps must you take to do this habit?"
│                                   │   └─→ Store: CURRENT_STEPS (list)
│                                   │
│                                   ├─→ Q: "How can we reduce these steps?"
│                                   │   └─→ Suggestions:
│                                   │       - Prepare environment ahead
│                                   │       - Remove obstacles
│                                   │       - Combine steps
│                                   │       - Automate parts
│                                   │   └─→ Store: OPTIMIZED_STEPS
│                                   │
│                                   └─→ Step 10: APPLY 4TH LAW (Make it Satisfying)
│                                       │
│                                       ├─→ Set up tracking method
│                                       │   │
│                                       │   ├─→ Q: "How will you track this habit?"
│                                       │   │   Options:
│                                       │   │   - Paper tracker
│                                       │   │   - Digital app
│                                       │   │   - Calendar marks
│                                       │   │   - Physical tokens
│                                       │   └─→ Store: TRACKING_METHOD
│                                       │
│                                       ├─→ Add immediate reward
│                                       │   │
│                                       │   ├─→ Q: "What small reward can you give yourself immediately after?"
│                                       │   │   Examples:
│                                       │   │   - Checkmark on calendar
│                                       │   │   - Move paperclip to jar
│                                       │   │   - Small treat
│                                       │   │   - Positive self-talk
│                                       │   └─→ Store: IMMEDIATE_REWARD
│                                       │
│                                       └─→ Step 11: ACCOUNTABILITY (Optional but Recommended)
│                                           │
│                                           ├─→ Q: "Would you like accountability?"
│                                           │   │
│                                           │   ├─→ YES → Set up accountability
│                                           │   │   │
│                                           │   │   ├─→ Find accountability partner
│                                           │   │   │   Q: "Who can you report to daily/weekly?"
│                                           │   │   │   └─→ Store: PARTNER_NAME
│                                           │   │   │
│                                           │   │   └─→ Create habit contract (optional)
│                                           │   │       Q: "What consequence for failure?"
│                                           │   │       └─→ Store: CONSEQUENCE
│                                           │   │
│                                           │   └─→ NO → Proceed to completion
│                                           │
│                                           └─→ COMPLETE: Habit Design Finalized
│                                               │
│                                               └─→ OUTPUT HABIT PLAN:
│                                                   {
│                                                     identity: TARGET_IDENTITY,
│                                                     behavior: HABIT_BEHAVIOR,
│                                                     trigger: IMPLEMENTATION_INTENTION or HABIT_STACK,
│                                                     environment: ENVIRONMENT_CUES,
│                                                     difficulty: TWO_MINUTE_VERSION or ORIGINAL,
│                                                     friction_reduction: OPTIMIZED_STEPS,
│                                                     motivation: TEMPTATION_BUNDLE or BENEFITS_LIST,
│                                                     tracking: TRACKING_METHOD,
│                                                     reward: IMMEDIATE_REWARD,
│                                                     accountability: PARTNER_NAME + CONSEQUENCE (if applicable)
│                                                   }
```

---

## Decision Tree 2: User Wants to Break a Bad Habit

```
START: User wants to break a bad habit
│
├─→ Step 1: IDENTIFY THE BAD HABIT
│   │
│   ├─→ Q: "What habit do you want to stop?"
│   │   └─→ Store: BAD_HABIT
│   │
│   └─→ Step 2: UNDERSTAND THE CUE
│       │
│       ├─→ Q: "When does this habit occur?"
│       │   └─→ Store: TIMING
│       │
│       ├─→ Q: "Where are you when it happens?"
│       │   └─→ Store: LOCATION
│       │
│       ├─→ Q: "Who are you with?"
│       │   └─→ Store: SOCIAL_CONTEXT
│       │
│       ├─→ Q: "What emotion precedes it?"
│       │   └─→ Store: EMOTIONAL_STATE
│       │
│       ├─→ Q: "What action happens right before?"
│       │   └─→ Store: PRECEDING_ACTION
│       │
│       └─→ Step 3: IDENTIFY THE CRAVING
│           │
│           ├─→ Q: "What do you actually want from this habit?"
│           │   Examples:
│           │   - Stress relief
│           │   - Entertainment
│           │   - Social connection
│           │   - Energy boost
│           │   └─→ Store: UNDERLYING_NEED
│           │
│           └─→ Step 4: FIND REPLACEMENT HABIT
│               │
│               ├─→ Q: "What healthier habit could satisfy this same need?"
│               │   Matching:
│               │   - Stress relief → Deep breathing, walk, exercise
│               │   - Entertainment → Reading, podcast, hobby
│               │   - Social connection → Call friend, join group
│               │   - Energy boost → Water, healthy snack, quick walk
│               │   └─→ Store: REPLACEMENT_HABIT
│               │
│               └─→ Step 5: APPLY 1ST LAW INVERSION (Make it Invisible)
│                   │
│                   ├─→ Remove cues from environment
│                   │   │
│                   │   ├─→ Q: "What triggers this habit in your environment?"
│                   │   │   └─→ Store: VISIBLE_CUES
│                   │   │
│                   │   ├─→ For each cue, decide:
│                   │   │   ├─→ Can you remove it completely? → DO IT
│                   │   │   ├─→ Can you hide it? → HIDE IT
│                   │   │   ├─→ Can you move to less convenient location? → MOVE IT
│                   │   │   └─→ Can you replace with cue for good habit? → REPLACE IT
│                   │   │
│                   │   └─→ Store: CUE_REMOVAL_PLAN
│                   │
│                   └─→ Step 6: REDUCE EXPOSURE
│                       │
│                       ├─→ Q: "Can you avoid the location where this habit occurs?"
│                       │   │
│                       │   ├─→ YES → Create avoidance plan
│                       │   │   └─→ Store: AVOIDANCE_STRATEGY
│                       │   │
│                       │   └─→ NO → Proceed to next step
│                       │
│                       └─→ Step 7: APPLY 2ND LAW INVERSION (Make it Unattractive)
│                           │
│                           ├─→ Highlight costs/downsides
│                           │   │
│                           │   ├─→ Q: "What negative consequences does this habit cause?"
│                           │   │   Categories:
│                           │   │   - Health costs
│                           │   │   - Financial costs
│                           │   │   - Time costs
│                           │   │   - Relationship costs
│                           │   │   - Identity costs ("not who I want to be")
│                           │   └─→ Store: COSTS_LIST
│                           │
│                           ├─→ Create negative association
│                           │   │
│                           │   ├─→ Reframe the habit
│                           │   │   Before: "I need a cigarette"
│                           │   │   After: "I'm poisoning my lungs"
│                           │   │
│                           │   │   Before: "I want to check social media"
│                           │   │   After: "I'm wasting my limited time on earth"
│                           │   └─→ Store: NEGATIVE_REFRAME
│                           │
│                           └─→ Step 8: APPLY 3RD LAW INVERSION (Make it Difficult)
│                               │
│                               ├─→ Increase friction
│                               │   │
│                               │   ├─→ Q: "How many steps does it take to do this habit now?"
│                               │   │   └─→ Store: CURRENT_STEPS
│                               │   │
│                               │   ├─→ Q: "How can we add more steps?"
│                               │   │   Strategies:
│                               │   │   - Add password protection
│                               │   │   - Physical barriers
│                               │   │   - Distance (put in hard-to-reach place)
│                               │   │   - Time locks
│                               │   │   - Enlist helpers to block access
│                               │   │   - Delete apps/accounts
│                               │   │   - Cancel subscriptions
│                               │   └─→ Store: FRICTION_ADDITIONS
│                               │
│                               └─→ Step 9: USE COMMITMENT DEVICES
│                                   │
│                                   ├─→ Q: "What commitment can you make to restrict future behavior?"
│                                   │   Options:
│                                   │   - Give item to friend to hold
│                                   │   - Use website blockers
│                                   │   - Schedule-based restrictions
│                                   │   - Financial locks (give money away if fail)
│                                   │   - Public commitment
│                                   └─→ Store: COMMITMENT_DEVICE
│                                   │
│                                   └─→ Step 10: APPLY 4TH LAW INVERSION (Make it Unsatisfying)
│                                       │
│                                       ├─→ Add immediate cost
│                                       │   │
│                                       │   ├─→ Q: "What immediate penalty can you create?"
│                                       │   │   Options:
│                                       │   │   - Donate money for each occurrence
│                                       │   │   - Do unpleasant task
│                                       │   │   - Report to accountability partner
│                                       │   │   - Public shame (post about failure)
│                                       │   └─→ Store: IMMEDIATE_COST
│                                       │
│                                       └─→ Step 11: ACCOUNTABILITY
│                                           │
│                                           ├─→ Create habit contract
│                                           │   │
│                                           │   ├─→ Q: "Who will hold you accountable?"
│                                           │   │   └─→ Store: ACCOUNTABILITY_PARTNER
│                                           │   │
│                                           │   ├─→ Q: "What's the penalty for engaging in bad habit?"
│                                           │   │   └─→ Store: PENALTY
│                                           │   │
│                                           │   └─→ Generate contract
│                                           │
│                                           └─→ Step 12: TRACK ABSENCE
│                                               │
│                                               ├─→ Q: "How will you track your progress?"
│                                               │   └─→ Track days WITHOUT habit
│                                               │   └─→ Store: TRACKING_METHOD
│                                               │
│                                               └─→ COMPLETE: Bad Habit Break Plan Finalized
│                                                   │
│                                                   └─→ OUTPUT BREAK PLAN:
│                                                       {
│                                                         bad_habit: BAD_HABIT,
│                                                         cues: {timing, location, emotion, action},
│                                                         underlying_need: UNDERLYING_NEED,
│                                                         replacement: REPLACEMENT_HABIT,
│                                                         make_invisible: CUE_REMOVAL_PLAN,
│                                                         make_unattractive: COSTS_LIST + NEGATIVE_REFRAME,
│                                                         make_difficult: FRICTION_ADDITIONS + COMMITMENT_DEVICE,
│                                                         make_unsatisfying: IMMEDIATE_COST + PENALTY,
│                                                         accountability: ACCOUNTABILITY_PARTNER,
│                                                         tracking: TRACKING_METHOD
│                                                       }
```

---

## Decision Tree 3: User's Habit Isn't Sticking

```
START: User reports habit isn't sticking
│
├─→ Step 1: GATHER CONTEXT
│   │
│   ├─→ Q: "How long have you been trying this habit?"
│   │   └─→ Store: DURATION
│   │
│   ├─→ Q: "How many times have you successfully completed it?"
│   │   └─→ Store: SUCCESS_COUNT
│   │
│   ├─→ Q: "What's your current success rate?"
│   │   └─→ Store: SUCCESS_RATE
│   │
│   └─→ Step 2: DIAGNOSE THE PROBLEM
│       │
│       ├─→ Is success rate < 50%?
│       │   │
│       │   ├─→ YES → PROBLEM: Habit is too difficult
│       │   │   │
│       │   │   └─→ SOLUTION PATH: Apply Two-Minute Rule
│       │   │       │
│       │   │       ├─→ Q: "What's the absolute smallest version of this habit?"
│       │   │       │   └─→ Scale it down
│       │   │       │
│       │   │       └─→ Q: "Can you make it even easier than that?"
│       │   │           └─→ Find gateway habit
│       │   │           └─→ Store: SCALED_DOWN_HABIT
│       │   │
│       │   └─→ NO → Continue diagnosis
│       │
│       ├─→ Q: "Do you forget to do the habit?"
│       │   │
│       │   ├─→ YES → PROBLEM: Cue is not obvious enough
│       │   │   │
│       │   │   └─→ SOLUTION PATH: Strengthen cue
│       │   │       │
│       │   │       ├─→ Does habit have implementation intention?
│       │   │       │   │
│       │   │       │   ├─→ NO → Create one
│       │   │       │   │   "I will [BEHAVIOR] at [TIME] in [LOCATION]"
│       │   │       │   │
│       │   │       │   └─→ YES → Make cue more visible
│       │   │       │       ├─→ Add visual reminder
│       │   │       │       ├─→ Set phone alarm
│       │   │       │       ├─→ Place objects in path
│       │   │       │       └─→ Stack on more obvious habit
│       │   │       │
│       │   │       └─→ Store: NEW_CUE_STRATEGY
│       │   │
│       │   └─→ NO → Continue diagnosis
│       │
│       ├─→ Q: "Do you remember but choose not to do it?"
│       │   │
│       │   ├─→ YES → PROBLEM: Not attractive enough or too much friction
│       │   │   │
│       │   │   └─→ SOLUTION PATH: Increase attractiveness or reduce friction
│       │   │       │
│       │   │       ├─→ Q: "Does it feel like too much work?"
│       │   │       │   │
│       │   │       │   ├─→ YES → Reduce friction
│       │   │       │   │   │
│       │   │       │   │   ├─→ Q: "What makes it feel hard?"
│       │   │       │   │   │   └─→ Store: FRICTION_POINTS
│       │   │       │   │   │
│       │   │       │   │   ├─→ For each friction point:
│       │   │       │   │   │   - Can you prepare ahead? → Prep strategy
│       │   │       │   │   │   - Can you reduce steps? → Simplify
│       │   │       │   │   │   - Can you automate? → Automate
│       │   │       │   │   │
│       │   │       │   │   └─→ Store: FRICTION_SOLUTIONS
│       │   │       │   │
│       │   │       │   └─→ NO → Increase attractiveness
│       │   │       │       │
│       │   │       │       ├─→ Apply temptation bundling
│       │   │       │       │   Q: "What do you enjoy that you could pair with this?"
│       │   │       │       │   └─→ Store: TEMPTATION_BUNDLE
│       │   │       │       │
│       │   │       │       └─→ Reframe motivation
│       │   │       │           Change "have to" → "get to"
│       │   │       │           └─→ Store: NEW_FRAME
│       │   │       │
│       │   │       └─→ Store: MOTIVATION_SOLUTION
│       │   │
│       │   └─→ NO → Continue diagnosis
│       │
│       ├─→ Q: "Do you do it but don't feel motivated to continue?"
│       │   │
│       │   ├─→ YES → PROBLEM: No immediate satisfaction
│       │   │   │
│       │   │   └─→ SOLUTION PATH: Add immediate reward
│       │   │       │
│       │   │       ├─→ Q: "Are you tracking this habit?"
│       │   │       │   │
│       │   │       │   ├─→ NO → Set up tracking
│       │   │       │   │   Options:
│       │   │       │   │   - Calendar with X marks
│       │   │       │   │   - Habit tracking app
│       │   │       │   │   - Paperclip jar
│       │   │       │   │   └─→ Store: TRACKING_METHOD
│       │   │       │   │
│       │   │       │   └─→ YES → Add additional reward
│       │   │       │       Q: "What small reward could you add immediately after?"
│       │   │       │       └─→ Store: ADDITIONAL_REWARD
│       │   │       │
│       │   │       └─→ Q: "Can you see your progress visually?"
│       │   │           │
│       │   │           ├─→ NO → Create visual progress tracker
│       │   │           │   └─→ Store: VISUAL_TRACKER
│       │   │           │
│       │   │           └─→ YES → Enhance it
│       │   │
│       │   └─→ NO → Continue diagnosis
│       │
│       └─→ Q: "Have you missed multiple days in a row?"
│           │
│           ├─→ YES → PROBLEM: Broken streak, lost momentum
│           │   │
│           │   └─→ SOLUTION PATH: Recovery protocol
│           │       │
│           │       ├─→ Apply "Never miss twice" rule
│           │       │   └─→ Get back on track TODAY
│           │       │
│           │       ├─→ Q: "Why did you miss initially?"
│           │       │   └─→ Store: MISS_REASON
│           │       │
│           │       ├─→ Create plan for that scenario
│           │       │   "If [MISS_REASON], then I will [ALTERNATIVE_PLAN]"
│           │       │   └─→ Store: CONTINGENCY_PLAN
│           │       │
│           │       └─→ Reset expectations
│           │           └─→ "We're optimizing for 80% success, not 100%"
│           │
│           └─→ NO → Edge case diagnosis
│               │
│               └─→ Step 3: EDGE CASE ANALYSIS
│                   │
│                   ├─→ Q: "Does this habit conflict with your identity?"
│                   │   │
│                   │   ├─→ YES → Work on identity shift
│                   │   │   │
│                   │   │   ├─→ Q: "Who do you believe you are?"
│                   │   │   │   └─→ Store: CURRENT_IDENTITY
│                   │   │   │
│                   │   │   ├─→ Q: "Who do you want to become?"
│                   │   │   │   └─→ Store: TARGET_IDENTITY
│                   │   │   │
│                   │   │   └─→ Reframe habit as identity evidence
│                   │   │       "This habit proves I am [TARGET_IDENTITY]"
│                   │   │       └─→ Store: IDENTITY_REFRAME
│                   │   │
│                   │   └─→ NO → Continue
│                   │
│                   ├─→ Q: "Are you trying to change too many habits at once?"
│                   │   │
│                   │   ├─→ YES → Reduce scope
│                   │   │   │
│                   │   │   ├─→ Q: "What's the ONE habit that would make the biggest difference?"
│                   │   │   │   └─→ Store: PRIORITY_HABIT
│                   │   │   │
│                   │   │   └─→ Put other habits on hold
│                   │   │       └─→ "Master one before adding more"
│                   │   │
│                   │   └─→ NO → Continue
│                   │
│                   └─→ Q: "Is your environment working against you?"
│                       │
│                       ├─→ YES → Redesign environment
│                       │   │
│                       │   └─→ Conduct environment audit
│                       │       (See Decision Tree 7)
│                       │
│                       └─→ NO → Custom solution needed
│                           └─→ Schedule 1-on-1 deep dive
│
└─→ COMPLETE: Output diagnosis and solution plan
```

---

## Decision Tree 4: User Missed Their Habit

```
START: User reports missing their habit
│
├─→ Step 1: ASSESS SITUATION
│   │
│   ├─→ Q: "How many days in a row have you missed?"
│   │   └─→ Store: CONSECUTIVE_MISSES
│   │
│   └─→ TRIAGE based on consecutive misses
│       │
│       ├─→ CONSECUTIVE_MISSES == 1
│       │   │
│       │   └─→ STATUS: Normal, recoverable
│       │       │
│       │       ├─→ Apply "Never Miss Twice" rule
│       │       │   │
│       │       │   ├─→ Message: "Missing once is an accident. Missing twice is the start of a new habit."
│       │       │   │
│       │       │   ├─→ Q: "Can you do the habit right now?"
│       │       │   │   │
│       │       │   │   ├─→ YES → Do it immediately
│       │       │   │   │   └─→ "Great! Streak recovered."
│       │       │   │   │
│       │       │   │   └─→ NO → Schedule for today
│       │       │   │       Q: "When today can you do it?"
│       │       │   │       └─→ Store: TODAY_PLAN
│       │       │   │
│       │       │   └─→ Step 2: ANALYZE WHY
│       │       │       │
│       │       │       └─→ Q: "Why did you miss?"
│       │       │           │
│       │       │           ├─→ "I forgot"
│       │       │           │   └─→ SOLUTION: Strengthen cue
│       │       │           │       - Add implementation intention if missing
│       │       │           │       - Set phone reminder
│       │       │           │       - Make cue more visible
│       │       │           │       └─→ Store: CUE_IMPROVEMENT
│       │       │           │
│       │       │           ├─→ "I didn't have time"
│       │       │           │   └─→ SOLUTION: Make it easier
│       │       │           │       Q: "What's a 2-minute version you ALWAYS have time for?"
│       │       │           │       └─→ Store: EASIER_VERSION
│       │       │           │
│       │       │           ├─→ "I was somewhere else" / "Schedule changed"
│       │       │           │   └─→ SOLUTION: Create contingency plan
│       │       │           │       Q: "If your normal routine is disrupted, what will you do instead?"
│       │       │           │       └─→ Store: BACKUP_PLAN
│       │       │           │
│       │       │           ├─→ "I wasn't motivated"
│       │       │           │   └─→ SOLUTION: Increase attractiveness
│       │       │           │       - Apply temptation bundling
│       │       │           │       - Reframe motivation
│       │       │           │       - Add immediate reward
│       │       │           │       └─→ Store: MOTIVATION_BOOST
│       │       │           │
│       │       │           ├─→ "It was too hard"
│       │       │           │   └─→ SOLUTION: Reduce difficulty
│       │       │           │       - Apply two-minute rule
│       │       │           │       - Reduce friction
│       │       │           │       - Prepare environment ahead
│       │       │           │       └─→ Store: DIFFICULTY_REDUCTION
│       │       │           │
│       │       │           └─→ "I was tired/sick/stressed"
│       │       │               └─→ SOLUTION: Create minimal viable version
│       │       │                   Q: "What's the absolute minimum version you can do on bad days?"
│       │       │                   └─→ Store: MINIMUM_VERSION
│       │       │
│       │       └─→ COMPLETE: Recovery plan created
│       │
│       ├─→ CONSECUTIVE_MISSES == 2
│       │   │
│       │   └─→ STATUS: Warning zone - pattern forming
│       │       │
│       │       ├─→ Message: "Two misses means we need to redesign this habit."
│       │       │
│       │       ├─→ Q: "What made it hard to do both times?"
│       │       │   └─→ Store: COMMON_BARRIER
│       │       │
│       │       ├─→ MANDATORY: Make habit easier
│       │       │   │
│       │       │   ├─→ Apply two-minute rule
│       │       │   │   Q: "What can you do in 2 minutes or less?"
│       │       │   │   └─→ Store: TWO_MIN_VERSION
│       │       │   │
│       │       │   └─→ Reduce friction
│       │       │       Q: "How can we remove obstacles?"
│       │       │       └─→ Store: FRICTION_REMOVAL
│       │       │
│       │       ├─→ Add accountability
│       │       │   │
│       │       │   └─→ Q: "Who can you report to daily?"
│       │       │       └─→ Store: ACCOUNTABILITY_PARTNER
│       │       │
│       │       └─→ Reset with new plan TODAY
│       │           └─→ "Do the easier version right now"
│       │
│       └─→ CONSECUTIVE_MISSES >= 3
│           │
│           └─→ STATUS: Critical - habit has failed, needs redesign
│               │
│               ├─→ Message: "This habit isn't working. Let's start fresh."
│               │
│               ├─→ Step 1: Reset expectations
│               │   │
│               │   └─→ Q: "Do you still want this habit?"
│               │       │
│               │       ├─→ NO → Abandon habit
│               │       │   └─→ "That's okay. Let's focus on what matters to you."
│               │       │   └─→ ARCHIVE habit
│               │       │
│               │       └─→ YES → Complete redesign
│               │
│               └─→ Step 2: COMPLETE REDESIGN
│                   │
│                   ├─→ Start from scratch
│                   │   └─→ Go to: Decision Tree 1 (Build New Habit)
│                   │       With modification:
│                   │       - Make it MUCH easier than before
│                   │       - Stronger cues
│                   │       - Better rewards
│                   │       - Accountability required
│                   │
│                   └─→ Alternative: Try different habit for same goal
│                       │
│                       └─→ Q: "Is there a different habit that would achieve the same outcome?"
│                           └─→ Brainstorm alternatives
│                           └─→ Store: ALTERNATIVE_HABITS
│
└─→ OUTPUT: Recovery or redesign plan
```

---

## Decision Tree 5: User is Bored with Habit

```
START: User reports being bored with habit
│
├─→ Step 1: VALIDATE FEELING
│   │
│   ├─→ Message: "Boredom is a sign of mastery. This is actually good!"
│   │
│   └─→ Step 2: ASSESS HABIT MATURITY
│       │
│       ├─→ Q: "How long have you been doing this habit?"
│       │   └─→ Store: HABIT_AGE
│       │
│       ├─→ Q: "What's your consistency rate?"
│       │   └─→ Store: CONSISTENCY_RATE
│       │
│       └─→ Step 3: DETERMINE IF HABIT IS TRULY AUTOMATIC
│           │
│           ├─→ Q: "Do you do this without thinking most days?"
│           │   │
│           │   ├─→ NO → Habit not yet automatic
│           │   │   │
│           │   │   └─→ DIAGNOSIS: Premature boredom
│           │   │       │
│           │   │       ├─→ Message: "You're in the valley of disappointment."
│           │   │       │   "This is where most people quit, right before breakthrough."
│           │   │       │
│           │   │       ├─→ SOLUTION: Add variable rewards
│           │   │       │   │
│           │   │       │   ├─→ Q: "Can we make the reward unpredictable?"
│           │   │       │   │   Examples:
│           │   │       │   │   - Random bonus rewards
│           │   │       │   │   - Surprise treats
│           │   │       │   │   - Gamification (level up at random intervals)
│           │   │       │   └─→ Store: VARIABLE_REWARD_SYSTEM
│           │   │       │   │
│           │   │       │   └─→ Add social element
│           │   │       │       Q: "Can you do this with others or share progress?"
│           │   │       │       └─→ Store: SOCIAL_COMPONENT
│           │   │       │
│           │   │       └─→ COMPLETE: Renewed engagement strategy
│           │   │
│           │   └─→ YES → Habit is automatic
│           │       │
│           │       └─→ Step 4: APPLY GOLDILOCKS RULE
│           │           │
│           │           ├─→ Message: "Boredom = habit is too easy now."
│           │           │   "We need to increase difficulty by ~4%"
│           │           │
│           │           ├─→ Q: "What would make this habit slightly harder?"
│           │           │   │
│           │           │   └─→ Progression strategies:
│           │           │       │
│           │           │       ├─→ INCREASE QUANTITY
│           │           │       │   Examples:
│           │           │       │   - 10 pushups → 12 pushups
│           │           │       │   - Read 1 page → Read 2 pages
│           │           │       │   - Meditate 5 min → Meditate 6 min
│           │           │       │   └─→ Store: INCREASED_QUANTITY
│           │           │       │
│           │           │       ├─→ INCREASE QUALITY
│           │           │       │   Examples:
│           │           │       │   - Regular pushups → Diamond pushups
│           │           │       │   - Read casually → Take notes while reading
│           │           │       │   - Basic meditation → Advanced technique
│           │           │       │   └─→ Store: INCREASED_QUALITY
│           │           │       │
│           │           │       ├─→ ADD CONSTRAINT
│           │           │       │   Examples:
│           │           │       │   - Exercise anytime → Exercise fasted
│           │           │       │   - Write 500 words → Write 500 words in 30 min
│           │           │       │   - Practice guitar → Practice new song only
│           │           │       │   └─→ Store: NEW_CONSTRAINT
│           │           │       │
│           │           │       ├─→ ADD TRACKING/MEASUREMENT
│           │           │       │   Examples:
│           │           │       │   - Exercise → Track heart rate zones
│           │           │       │   - Read → Track reading speed
│           │           │       │   - Meditate → Track with EEG device
│           │           │       │   └─→ Store: NEW_METRIC
│           │           │       │
│           │           │       └─→ CHANGE VARIATION
│           │           │           Examples:
│           │           │           - Same exercise → Different exercise
│           │           │           - Same genre → Different genre
│           │           │           - Same time → Different time
│           │           │           └─→ Store: VARIATION
│           │           │
│           │           ├─→ Step 5: TEST DIFFICULTY INCREASE
│           │           │   │
│           │           │   ├─→ Q: "Does this new version feel challenging but achievable?"
│           │           │   │   │
│           │           │   │   ├─→ YES → Perfect! (Flow state achieved)
│           │           │   │   │   └─→ Implement new version
│           │           │   │   │
│           │           │   │   ├─→ NO - Too easy → Increase more
│           │           │   │   │   └─→ Add another 4% difficulty
│           │           │   │   │
│           │           │   │   └─→ NO - Too hard → Decrease slightly
│           │           │   │       └─→ Reduce to 2% increase
│           │           │   │
│           │           │   └─→ Store: OPTIMAL_DIFFICULTY
│           │           │
│           │           └─→ Step 6: PREVENT COMPLACENCY
│           │               │
│           │               ├─→ Set up regular review system
│           │               │   │
│           │               │   ├─→ Weekly: "Is this habit still challenging?"
│           │               │   ├─→ Monthly: "Have I improved? By how much?"
│           │               │   └─→ Quarterly: "What's the next level?"
│           │               │   └─→ Store: REVIEW_SCHEDULE
│           │               │
│           │               └─→ Combine habits with deliberate practice
│           │                   │
│           │                   ├─→ Message: "Don't just repeat. Improve each time."
│           │                   │
│           │                   ├─→ Q: "What specific aspect can you focus on improving?"
│           │                   │   └─→ Store: PRACTICE_FOCUS
│           │                   │
│           │                   └─→ Create improvement metrics
│           │                       └─→ Store: IMPROVEMENT_TRACKING
│           │
│           └─→ ALTERNATIVE PATH: Consider if habit is complete
│               │
│               ├─→ Q: "Has this habit served its purpose?"
│               │   │
│               │   ├─→ YES → Graduate the habit
│               │   │   │
│               │   │   ├─→ Message: "Some habits are meant to be temporary."
│               │   │   │   "You've integrated what you needed."
│               │   │   │
│               │   │   ├─→ Archive with gratitude
│               │   │   │   └─→ Document: What you learned
│               │   │   │
│               │   │   └─→ Q: "What new habit do you want to build?"
│               │   │       └─→ Go to Decision Tree 1
│               │   │
│               │   └─→ NO → Continue with difficulty increase
│               │
│               └─→ COMPLETE: Boredom resolution strategy
│
└─→ OUTPUT: Engagement renewal plan
```

---

## Decision Tree 6: Choosing Which Law to Apply First

```
START: User has a habit goal, need to prioritize which law to apply
│
├─→ Step 1: IDENTIFY CURRENT STATE
│   │
│   ├─→ Q: "What's preventing you from doing this habit?"
│   │   └─→ Store: PRIMARY_OBSTACLE
│   │
│   └─→ Step 2: MATCH OBSTACLE TO LAW
│       │
│       ├─→ PRIMARY_OBSTACLE = "I forget to do it"
│       │   │
│       │   └─→ APPLY: 1st Law (Make it Obvious)
│       │       Priority: HIGH
│       │       │
│       │       └─→ Solutions:
│       │           - Implementation intention
│       │           - Habit stacking
│       │           - Visual cues
│       │           - Environment design
│       │
│       ├─→ PRIMARY_OBSTACLE = "I don't want to do it" / "It's not appealing"
│       │   │
│       │   └─→ APPLY: 2nd Law (Make it Attractive)
│       │       Priority: HIGH
│       │       │
│       │       └─→ Solutions:
│       │           - Temptation bundling
│       │           - Reframe mindset
│       │           - Join culture
│       │           - Motivation ritual
│       │
│       ├─→ PRIMARY_OBSTACLE = "It takes too much effort" / "It's inconvenient"
│       │   │
│       │   └─→ APPLY: 3rd Law (Make it Easy)
│       │       Priority: HIGH
│       │       │
│       │       └─→ Solutions:
│       │           - Two-minute rule
│       │           - Reduce friction
│       │           - Prime environment
│       │           - Automate
│       │
│       ├─→ PRIMARY_OBSTACLE = "I don't see results" / "No immediate benefit"
│       │   │
│       │   └─→ APPLY: 4th Law (Make it Satisfying)
│       │       Priority: HIGH
│       │       │
│       │       └─→ Solutions:
│       │           - Habit tracking
│       │           - Immediate rewards
│       │           - Visual progress
│       │           - Accountability
│       │
│       └─→ PRIMARY_OBSTACLE = "Multiple issues" / "Not sure"
│           │
│           └─→ APPLY: Default sequence (recommended order)
│               │
│               ├─→ Step 1: Make it Obvious (1st Law)
│               │   Rationale: "If you can't remember, nothing else matters"
│               │   │
│               │   └─→ Create clear trigger
│               │
│               ├─→ Step 2: Make it Easy (3rd Law)
│               │   Rationale: "Reduce friction before adding motivation"
│               │   │
│               │   └─→ Apply two-minute rule
│               │
│               ├─→ Step 3: Make it Attractive (2nd Law)
│               │   Rationale: "Make it appealing after making it simple"
│               │   │
│               │   └─→ Add temptation bundling or reframe
│               │
│               └─→ Step 4: Make it Satisfying (4th Law)
│                   Rationale: "Seal the deal with immediate rewards"
│                   │
│                   └─→ Set up tracking and rewards
│
├─→ Step 3: APPLY SECONDARY LAWS
│   │
│   ├─→ After addressing primary obstacle, apply remaining laws
│   │   │
│   │   └─→ Sequence:
│   │       1. Solve biggest problem first (from Step 2)
│   │       2. Layer in other laws
│   │       3. All four laws working together = robust habit
│   │
│   └─→ Create comprehensive habit plan
│       └─→ Store: COMPLETE_HABIT_DESIGN
│
└─→ OUTPUT: Prioritized law application sequence
```

---

## Decision Tree 7: Designing Environment Changes

```
START: User needs environment audit/redesign
│
├─→ Step 1: CHOOSE SCOPE
│   │
│   ├─→ Q: "What environment do you want to optimize?"
│   │   Options:
│   │   - Single room
│   │   - Entire home
│   │   - Workspace
│   │   - Digital environment
│   │   - All environments
│   │   └─→ Store: SCOPE
│   │
│   └─→ Step 2: IDENTIFY TARGET HABITS
│       │
│       ├─→ Q: "What good habits do you want to encourage?"
│       │   └─→ Store: GOOD_HABITS (list)
│       │
│       ├─→ Q: "What bad habits do you want to discourage?"
│       │   └─→ Store: BAD_HABITS (list)
│       │
│       └─→ Step 3: ROOM-BY-ROOM AUDIT
│           │
│           └─→ For each space in SCOPE:
│               │
│               ├─→ CURRENT STATE ANALYSIS
│               │   │
│               │   ├─→ Q: "What cues for good habits exist here?"
│               │   │   └─→ Store: POSITIVE_CUES
│               │   │
│               │   ├─→ Q: "What cues for bad habits exist here?"
│               │   │   └─→ Store: NEGATIVE_CUES
│               │   │
│               │   ├─→ Q: "What creates friction for good habits?"
│               │   │   └─→ Store: GOOD_HABIT_FRICTION
│               │   │
│               │   └─→ Q: "What reduces friction for bad habits?"
│               │       └─→ Store: BAD_HABIT_EASE
│               │
│               └─→ REDESIGN STRATEGY
│                   │
│                   ├─→ FOR GOOD HABITS:
│                   │   │
│                   │   ├─→ Add cues
│                   │   │   Q: "What objects can you place in sight?"
│                   │   │   Examples:
│                   │   │   - Running shoes by door
│                   │   │   - Book on pillow
│                   │   │   - Vitamins next to coffee maker
│                   │   │   - Water bottle on desk
│                   │   │   └─→ Store: CUES_TO_ADD
│                   │   │
│                   │   └─→ Reduce friction
│                   │       Q: "How can you prepare this space?"
│                   │       Examples:
│                   │       - Lay out workout clothes night before
│                   │       - Pre-portion healthy snacks
│                   │       - Set up meditation cushion
│                   │       - Clear desk before leaving work
│                   │       └─→ Store: FRICTION_TO_REMOVE
│                   │
│                   └─→ FOR BAD HABITS:
│                       │
│                       ├─→ Remove cues
│                       │   Q: "What triggers can you eliminate?"
│                       │   Examples:
│                       │   - Remove TV from bedroom
│                       │   - Delete apps from phone
│                       │   - Hide junk food
│                       │   - Unplug game console
│                       │   └─→ Store: CUES_TO_REMOVE
│                       │
│                       └─→ Add friction
│                           Q: "How can you make this harder?"
│                           Examples:
│                           - Put phone in another room
│                           │           - Lock up credit cards
│                           - Make junk food require preparation
│                           - Add password to streaming services
│                           └─→ Store: FRICTION_TO_ADD
│
├─→ Step 4: CREATE DEDICATED CONTEXTS
│   │
│   ├─→ Principle: "One space, one use"
│   │
│   ├─→ Q: "Can you designate specific areas for specific activities?"
│   │   │
│   │   └─→ Examples:
│   │       - Reading chair (only for reading)
│   │       - Workout corner (only for exercise)
│   │       - Desk (only for work, not leisure)
│   │       - Bed (only for sleep, not phone use)
│   │       └─→ Store: DEDICATED_SPACES
│   │
│   └─→ Implementation:
│       └─→ For each space, enforce rule: "When I'm here, I only do X"
│
├─→ Step 5: DIGITAL ENVIRONMENT
│   │
│   ├─→ Phone/Computer audit
│   │   │
│   │   ├─→ Home screen analysis
│   │   │   │
│   │   │   ├─→ Q: "What apps are most visible?"
│   │   │   │   └─→ Store: VISIBLE_APPS
│   │   │   │
│   │   │   ├─→ Redesign strategy:
│   │   │   │   - Good habit apps on home screen
│   │   │   │   - Bad habit apps buried in folders
│   │   │   │   - Delete worst offenders entirely
│   │   │   │   └─→ Store: PHONE_REDESIGN
│   │   │   │
│   │   │   └─→ Add friction to distractions
│   │   │       - Enable Screen Time limits
│   │   │       - Use website blockers
│   │   │       - Remove saved passwords
│   │   │       - Log out after each use
│   │   │       └─→ Store: DIGITAL_FRICTION
│   │   │
│   │   └─→ Notification audit
│   │       │
│   │       ├─→ Q: "What notifications interrupt you?"
│   │       │   └─→ Store: CURRENT_NOTIFICATIONS
│   │       │
│   │       └─→ Redesign:
│   │           - Disable all non-essential
│   │           - Enable only for priority people/apps
│   │           - Use Do Not Disturb modes
│   │           └─→ Store: NOTIFICATION_CHANGES
│   │
│   └─→ Default settings
│       │
│       ├─→ Q: "What are your current defaults?"
│       │   └─→ Store: CURRENT_DEFAULTS
│       │
│       └─→ Redesign to support good habits:
│           - Default browser tab → productivity site
│           - Default TV channel → educational content
│           - Default music → focus playlist
│           └─→ Store: NEW_DEFAULTS
│
├─→ Step 6: CREATE ACTION PLAN
│   │
│   ├─→ Prioritize changes
│   │   │
│   │   └─→ Sort by:
│   │       1. Highest impact
│   │       2. Easiest to implement
│   │       3. Supports most important habit
│   │       └─→ Store: PRIORITIZED_CHANGES
│   │
│   └─→ Implementation schedule
│       │
│       ├─→ Q: "When will you make each change?"
│       │   └─→ Assign dates to changes
│       │
│       └─→ Q: "What supplies/tools do you need?"
│           └─→ Store: REQUIRED_ITEMS
│
└─→ OUTPUT: Complete environment redesign plan
    │
    └─→ Format:
        {
          scope: SCOPE,
          good_habits: GOOD_HABITS,
          bad_habits: BAD_HABITS,
          changes_by_space: {
            [space_name]: {
              cues_to_add: [],
              cues_to_remove: [],
              friction_to_add: [],
              friction_to_remove: [],
              dedicated_use: string
            }
          },
          digital_changes: {
            phone_redesign: PHONE_REDESIGN,
            notification_changes: NOTIFICATION_CHANGES,
            default_changes: NEW_DEFAULTS
          },
          action_plan: PRIORITIZED_CHANGES,
          implementation_dates: {},
          required_items: REQUIRED_ITEMS
        }
```

---

## Decision Tree 8: Habit Difficulty Assessment

```
START: Assess if habit is at optimal difficulty
│
├─→ Step 1: GATHER METRICS
│   │
│   ├─→ Q: "What's your current success rate?"
│   │   └─→ Store: SUCCESS_RATE
│   │
│   ├─→ Q: "How do you feel before doing this habit?"
│   │   Options: Excited / Neutral / Reluctant / Dread
│   │   └─→ Store: PRE_HABIT_FEELING
│   │
│   ├─→ Q: "How do you feel during the habit?"
│   │   Options: Flow / Engaged / Bored / Frustrated / Overwhelmed
│   │   └─→ Store: DURING_HABIT_FEELING
│   │
│   └─→ Q: "How challenged do you feel (1-10)?"
│       1 = Way too easy
│       5 = Just right
│       10 = Way too hard
│       └─→ Store: CHALLENGE_LEVEL
│
└─→ Step 2: DIAGNOSE DIFFICULTY LEVEL
    │
    ├─→ TOO EASY (Success rate >95% AND Bored/Unchallenged)
    │   │
    │   ├─→ DIAGNOSIS: "Below optimal difficulty"
    │   │   Risk: Boredom, complacency, no growth
    │   │
    │   └─→ SOLUTION: Increase difficulty by 4%
    │       │
    │       └─→ Go to Decision Tree 5 (User is Bored)
    │
    ├─→ TOO HARD (Success rate <50% OR Overwhelmed/Frustrated)
    │   │
    │   ├─→ DIAGNOSIS: "Above optimal difficulty"
    │   │   Risk: Failure, abandonment, loss of confidence
    │   │
    │   └─→ SOLUTION: Decrease difficulty
    │       │
    │       ├─→ Apply two-minute rule
    │       │   Q: "What's the smallest version of this habit?"
    │       │   └─→ Store: EASIER_VERSION
    │       │
    │       ├─→ Reduce friction
    │       │   Q: "What obstacles can we remove?"
    │       │   └─→ Store: FRICTION_REMOVAL
    │       │
    │       └─→ Break into smaller steps
    │           Q: "What's the first step only?"
    │           └─→ Store: FIRST_STEP
    │
    └─→ JUST RIGHT (Success rate 70-90% AND Engaged/Flow state)
        │
        ├─→ DIAGNOSIS: "Optimal difficulty - Goldilocks Zone"
        │   Status: Perfect! Maintain this level.
        │
        └─→ MAINTENANCE STRATEGY:
            │
            ├─→ Monitor weekly
            │   "Is it still challenging but achievable?"
            │
            ├─→ Adjust as you improve
            │   "When it becomes easy, increase 4%"
            │
            └─→ Celebrate progress
                "You're in the flow state - this is where growth happens"
```

---

## Decision Tree 9: Identifying Root Causes of Failure

```
START: Habit has failed, need to identify why
│
├─→ Step 1: SYSTEMATIC INTERROGATION
│   │
│   └─→ Ask the Five Whys
│       │
│       ├─→ Q1: "Why didn't the habit work?"
│       │   └─→ Store: ANSWER_1
│       │
│       ├─→ Q2: "Why did [ANSWER_1] happen?"
│       │   └─→ Store: ANSWER_2
│       │
│       ├─→ Q3: "Why did [ANSWER_2] happen?"
│       │   └─→ Store: ANSWER_3
│       │
│       ├─→ Q4: "Why did [ANSWER_3] happen?"
│       │   └─→ Store: ANSWER_4
│       │
│       └─→ Q5: "Why did [ANSWER_4] happen?"
│           └─→ Store: ROOT_CAUSE
│
└─→ Step 2: CATEGORIZE ROOT CAUSE
    │
    ├─→ ROOT CAUSE CATEGORY: Awareness
    │   Symptoms:
    │   - "I forgot"
    │   - "It didn't occur to me"
    │   - "I wasn't thinking about it"
    │   │
    │   └─→ SOLUTION: 1st Law (Make it Obvious)
    │       - Add implementation intention
    │       - Create habit stack
    │       - Design environment cues
    │       - Set reminders
    │
    ├─→ ROOT CAUSE CATEGORY: Motivation
    │   Symptoms:
    │   - "I didn't feel like it"
    │   - "It seemed boring"
    │   - "I wanted to do something else instead"
    │   │
    │   └─→ SOLUTION: 2nd Law (Make it Attractive)
    │       - Temptation bundling
    │       - Join supportive culture
    │       - Reframe mindset
    │       - Create motivation ritual
    │
    ├─→ ROOT CAUSE CATEGORY: Ability
    │   Symptoms:
    │   - "It was too hard"
    │   - "I didn't have time"
    │   - "Too many obstacles"
    │   - "Too complicated"
    │   │
    │   └─→ SOLUTION: 3rd Law (Make it Easy)
    │       - Two-minute rule
    │       - Reduce friction
    │       - Prime environment
    │       - Simplify steps
    │
    ├─→ ROOT CAUSE CATEGORY: Reinforcement
    │   Symptoms:
    │   - "I didn't see results"
    │   - "No immediate benefit"
    │   - "Forgot about my streak"
    │   - "No one noticed"
    │   │
    │   └─→ SOLUTION: 4th Law (Make it Satisfying)
    │       - Add tracking
    │       - Create immediate reward
    │       - Visual progress markers
    │       - Accountability partner
    │
    ├─→ ROOT CAUSE CATEGORY: Identity
    │   Symptoms:
    │   - "It's not who I am"
    │   - "I'm not that type of person"
    │   - "It feels fake/forced"
    │   │
    │   └─→ SOLUTION: Identity work
    │       - Reframe identity
    │       - Start with "I am the type of person who..."
    │       - Focus on becoming, not achieving
    │       - Use habit as evidence of new identity
    │
    ├─→ ROOT CAUSE CATEGORY: Environment
    │   Symptoms:
    │   - "My space doesn't support it"
    │   - "Too many temptations around"
    │   - "Wrong context"
    │   │
    │   └─→ SOLUTION: Environment redesign
    │       - Go to Decision Tree 7 (Environment Design)
    │
    ├─→ ROOT CAUSE CATEGORY: Social
    │   Symptoms:
    │   - "No one else does this"
    │   - "People make fun of me"
    │   - "I feel alone in this"
    │   │
    │   └─→ SOLUTION: Social strategy
    │       - Join group/culture that does habit
    │       - Find accountability partner
    │       - Make it public commitment
    │       - Change social environment
    │
    └─→ ROOT CAUSE CATEGORY: Systemic
        Symptoms:
        - "Too many habits at once"
        - "Wrong habit for wrong goal"
        - "Life circumstances changed"
        │
        └─→ SOLUTION: System redesign
            - Reduce number of habits
            - Choose different habit
            - Adjust for new circumstances
            - Complete fresh start (Decision Tree 1)
```

---

## Usage Instructions for LLM

When a user presents a habit challenge:

1. **Identify which decision tree applies** based on user's situation
2. **Follow the tree systematically** - don't skip steps
3. **Ask questions in order** - gather all needed context
4. **Store answers** as you go (in conversation memory)
5. **Apply solutions** from the appropriate branch
6. **Output structured plan** at the end

**Key principles:**
- Decision trees are guides, not rigid scripts
- Adapt language to user's context
- Can jump between trees if needed
- Always end with actionable plan
- Store structured data for future reference

**Common flows:**
- New habit → Tree 1
- Breaking habit → Tree 2
- Troubleshooting → Tree 3, 4, 5, or 9
- Optimization → Tree 5, 6, 7, or 8

**Integration with other files:**
- Use `key-concepts-summary.md` for formulas and strategies
- Use `implementation-patterns.md` for specific techniques
- Use `prompt-templates.md` for conversation starters
- Use `data-models.md` for structuring output
