# Prompt Templates - Coaching Prompt Library

## Purpose
This document provides ready-to-use prompt templates for common coaching scenarios. Fill in the placeholders with student-specific information to generate personalized coaching responses.

---

## Template 1: Initial Study Habits Assessment

### Purpose
First interaction with student to understand current methods and challenges

### Template

```
I'd like to help you improve your learning, but first I need to understand your current approach. Please answer these questions as specifically as possible:

**Current Study Methods:**
1. Describe a typical study session for [SUBJECT]. What exactly do you do?
2. After you read/watch/attend class on new material, what's your next step?
3. How do you review material you've previously studied?
4. When preparing for a test, what does your study routine look like?

**Performance & Challenges:**
5. How are your current grades/performance in [SUBJECT]? (Specific scores if possible)
6. What's your biggest challenge with learning this material?
7. How much time do you currently spend studying [SUBJECT] per week?
8. How would you rate your confidence in this subject (1-10)?

**Goals:**
9. What grade/level of understanding are you aiming for?
10. When is your next exam/assessment?

Based on your answers, I'll identify what's working, what's not, and give you a specific plan to improve.
```

### Follow-up Analysis Template

```
Based on what you've described, here's what I'm seeing:

**What's Working:**
[List any effective methods student is already using]

**What's Not Working:**
[Identify passive methods, lack of spacing, etc.]

**Root Cause:**
[Primary issue: passive methods / no review system / ineffective time use / etc.]

**Primary Recommendation:**
[One high-impact change to start with]

**Why This Will Help:**
[Evidence-based explanation]

**How to Implement:**
[Step-by-step specific instructions]

Would you like me to create a detailed study plan for [SUBJECT]?
```

---

## Template 2: Course-Specific Study Plan Creation

### Purpose
Generate customized study plan for a specific course

### Template

```
Let's create a study plan for [SUBJECT]. I need some information:

**Course Details:**
- What topics are covered? (List major units/chapters)
- What's the assessment format? (Exams, essays, problem sets, etc.)
- How often are assessments? (Weekly, monthly, end of semester?)
- Are there practice materials available? (Past exams, problem sets, etc.)

**Your Current State:**
- Which topics have you already covered?
- For each topic, rate your current mastery (1-5 scale):
  * 1 = Haven't seen it yet
  * 2 = Seen it but can't explain it
  * 3 = Understand basics, struggle with details
  * 4 = Pretty solid, just need practice
  * 5 = Could teach it to someone else

**Your Schedule:**
- How many hours per week can you dedicate to [SUBJECT]?
- What are your peak energy times? (Morning person / night owl / consistent)
- Any time constraints? (Work, other classes, commitments)

I'll create a study plan that:
1. Prioritizes topics based on your mastery gaps
2. Uses evidence-based techniques (active recall, spaced repetition)
3. Fits your available time
4. Matches your energy patterns
```

### Output Template

```
# [SUBJECT] Study Plan

## Overview
- Duration: [X weeks until next assessment]
- Weekly time commitment: [Y hours]
- Primary focus: [Highest priority topics]
- Methods: [Active recall, spaced repetition, practice problems, etc.]

## Topic Priority List
[Listed in descending priority based on: Importance × (6 - Current Mastery)]

1. [Topic] - Priority Score: [X] - Time allocation: [Y hours]
2. [Topic] - Priority Score: [X] - Time allocation: [Y hours]
...

## Weekly Schedule

### Week 1: [Focus areas]
**Monday** ([X hours]):
- 09:00-09:30: [Specific activity]
- 09:30-10:00: [Specific activity]
...

**Tuesday** ([X hours]):
...

[Continue for full week]

### Week 2: [Focus areas]
[Repeat structure]

## Daily Session Structure
Each study session follows this format:
1. [X min]: [Activity type]
2. [X min]: Break
3. [X min]: [Activity type]
...

## Review Schedule (Spaced Repetition)
Material studied on Day X gets reviewed on:
- Day X+1: [Type of review]
- Day X+3: [Type of review]
- Day X+7: [Type of review]

## Success Metrics
Track these weekly:
- Recall accuracy (% of material you can recall without looking)
- Problems solved correctly (track by topic)
- Self-assessed confidence (1-10 scale by topic)

## Adjustments
- If recall <70%: Extend time on that topic, break down further
- If recall >90%: Reduce time, move to next topic
- If consistently behind: Focus on top 3 priorities only

Start with Week 1, Monday's first session. Let me know how it goes!
```

---

## Template 3: Active Recall Question Generation

### Purpose
Create practice questions from source material

### Template

```
I'll generate active recall questions for [TOPIC]. First, provide:

1. The source material (paste text, or summarize key concepts)
2. Difficulty level you want (easy / medium / hard)
3. Question types you prefer:
   - Factual (What is X? Define Y)
   - Conceptual (Explain how X works. Why is Y important?)
   - Application (How would you use X in scenario Y?)
   - Analysis (Compare X and Y. What's the relationship between X and Z?)
4. How many questions? ([X] questions)
5. Format (flashcards / short-answer / problem-solving)

I'll create questions that test retrieval, not just recognition.
```

### Output Template

```
# Active Recall Questions: [TOPIC]

## How to Use These Questions
1. Close all materials
2. Try to answer each question completely from memory
3. Write or say your answer out loud
4. Only then check the answer provided
5. Grade honestly: ✓ correct, ~ partial, ✗ incorrect
6. Review incorrect answers, then retry tomorrow

---

## Questions

### Question 1 [Difficulty: Easy | Type: Factual]
**Q:** [Question text]

**A:** [Full answer]

**Key points to include:**
- [Point 1]
- [Point 2]
- [Point 3]

---

### Question 2 [Difficulty: Medium | Type: Conceptual]
**Q:** [Question text]

**A:** [Full answer]

**Evaluation criteria:**
- Did you explain the core mechanism?
- Did you provide an example?
- Did you connect to related concepts?

---

### Question 3 [Difficulty: Hard | Type: Application]
**Q:** [Scenario + question]

**A:** [Solution with reasoning]

**Common mistakes to avoid:**
- [Mistake 1]
- [Mistake 2]

---

[Continue for all questions]

## Practice Schedule
- Day 1: All questions (first attempt)
- Day 2: Questions you got wrong
- Day 4: All questions (should see improvement)
- Day 7: All questions (should be mostly correct)

## Self-Assessment
After completing all questions, rate your mastery:
- 80-100% correct: Strong understanding, ready to move on
- 60-79% correct: Good progress, review weak areas
- <60% correct: Need more study on fundamentals
```

---

## Template 4: Spaced Repetition Schedule Creation

### Purpose
Build a review schedule for exam preparation

### Template

```
Let's create a spaced repetition schedule for [SUBJECT/TOPIC].

**Information needed:**
1. Exam/assessment date: [DATE]
2. Today's date: [DATE]
3. Topics to review: [List all topics]
4. Current mastery for each topic (1-5 scale):
   - [Topic 1]: [Rating]
   - [Topic 2]: [Rating]
   ...
5. Time available per day for reviews: [X minutes]

I'll create a schedule that ensures you review each topic multiple times before the exam, with spacing optimized for retention.
```

### Output Template

```
# Spaced Repetition Schedule for [SUBJECT]
**Exam Date:** [DATE]
**Days until exam:** [X]
**Topics:** [Y]

## Review Calendar

### [DATE - Week 1]

**Monday:**
- 10:00-10:15: Review [Topic A] (Initial learning - Day 0)
- 14:00-14:15: Review [Topic B] (Initial learning - Day 0)

**Tuesday:**
- 10:00-10:15: Review [Topic A] (Day 1 review)
- 14:00-14:15: Review [Topic C] (Initial learning - Day 0)

**Wednesday:**
- 10:00-10:15: Review [Topic B] (Day 1 review)
- 14:00-14:20: Review [Topic D] (Initial learning - Day 0)

**Thursday:**
- 10:00-10:15: Review [Topic A] (Day 3 review)
- 14:00-14:15: Review [Topic C] (Day 1 review)

[Continue through exam date]

## Review Method for Each Session

**Initial Learning (Day 0):**
- Active recall: Write everything you know about topic
- Check against materials
- Study gaps
- Practice problems if applicable
- Duration: 15-20 minutes

**Day 1 Review:**
- Active recall (close materials, retrieve)
- Check what you forgot
- Quick re-study of forgotten items only
- Duration: 10-15 minutes

**Day 3+ Reviews:**
- Active recall test
- If recall >80%: Quick review, done
- If recall <80%: Extended review, may need to reset interval
- Duration: 10-15 minutes

## Adjustment Rules

**If review feels EASY (>90% recall):**
- Extend next interval by 50%
- Example: Next review in 10 days instead of 7

**If review feels HARD (<60% recall):**
- Shorten next interval by 50%
- Example: Next review in 1 day instead of 3
- May need deeper study, not just review

**If you miss a scheduled review:**
- Do it as soon as possible
- Reset interval: next review in 1 day

## Progress Tracking

Track each review:
```
Topic: [X]
Date: [Y]
Recall success: [%]
Difficult items: [List]
Confidence: [1-10]
Next review: [Date]
```

## Expected Outcome
By exam date, you should have reviewed each topic [X] times, with increasing retention each time. Final review should feel very comfortable.

Start with today's scheduled reviews. Set calendar reminders for all future reviews.
```

---

## Template 5: Practice Test Design

### Purpose
Create a practice exam for self-assessment

### Template

```
I'll create a practice test for [SUBJECT] covering [TOPICS].

**Specify:**
1. Test format (multiple choice / short answer / problems / essay / mixed)
2. Number of questions: [X]
3. Time limit: [X minutes] (should match actual exam)
4. Topics to cover: [List with weight if known]
5. Difficulty distribution:
   - Easy (basic recall): [%]
   - Medium (application): [%]
   - Hard (synthesis/analysis): [%]

I'll create a practice test that simulates the real exam as closely as possible.
```

### Output Template

```
# Practice Test: [SUBJECT]
**Topics:** [List]
**Time Limit:** [X minutes]
**Total Points:** [X]
**Passing Score:** [Y points]

## Instructions
1. Set timer for [X] minutes
2. Close all materials (closed-book test)
3. Answer all questions
4. Do not check answers until timer ends
5. Show all work for partial credit practice

---

## Section 1: [Question Type] ([X] points)

**Question 1** ([X] points)
[Question text]

[Space for answer]

---

**Question 2** ([X] points)
[Question text]

[Space for answer]

---

## Section 2: [Question Type] ([X] points)

[Continue through all sections]

---

## STOP: Do not look beyond this point until you've completed the test

---

## Answer Key

### Section 1

**Question 1** ([X] points)
**Answer:** [Full answer]

**Grading rubric:**
- [Criterion 1]: [X points]
- [Criterion 2]: [X points]
- [Criterion 3]: [X points]

**Common mistakes:**
- [Mistake 1]
- [Mistake 2]

---

**Question 2** ([X] points)
**Answer:** [Full answer]

[Continue for all questions]

---

## Self-Scoring Guide

1. Grade each question using the rubric
2. Be honest with yourself
3. Total your score: _____ / [Total points]
4. Percentage: ____%

## Score Interpretation

- 90-100%: Excellent. You're ready. Light review only.
- 80-89%: Good. Review questions you missed.
- 70-79%: Fair. Identify weak topics, study those specifically.
- <70%: Need more preparation. Focus on fundamentals.

## Error Analysis

**Topics I struggled with:**
1. [Topic]
2. [Topic]
3. [Topic]

**Type of errors:**
- Conceptual misunderstanding: [Count]
- Calculation mistakes: [Count]
- Time pressure: [Count]
- Careless errors: [Count]

## Action Plan Based on Results

**If conceptual misunderstandings:**
- Review those specific concepts
- Use Feynman Technique to explain them
- Do more practice problems on those topics

**If calculation mistakes:**
- Practice similar problems
- Work more carefully
- Double-check calculations

**If time pressure:**
- Practice under timed conditions
- Skip hard questions, come back later
- Improve speed on routine problems

**If careless errors:**
- Read questions more carefully
- Check work before moving on
- Slow down slightly

## Next Steps
1. Study your identified weak areas
2. Retake this practice test in [X] days
3. Goal: Improve score by [Y] points
4. Track improvement across multiple attempts
```

---

## Template 6: Weekly Planning

### Purpose
Create a structured weekly study plan

### Template

```
Let's plan your study week for [WEEK OF DATE].

**Courses/Subjects:**
List each subject with:
- Hours needed this week: [X]
- Priorities: [What needs focus?]
- Deadlines: [Any assignments/exams?]

**Your Schedule:**
- Available study hours per day:
  - Monday: [X]
  - Tuesday: [X]
  - Wednesday: [X]
  - Thursday: [X]
  - Friday: [X]
  - Saturday: [X]
  - Sunday: [X]
- Fixed commitments (classes, work): [Times]
- Peak energy times: [When are you most alert?]

I'll create a time-blocked schedule that maximizes your effectiveness.
```

### Output Template

```
# Weekly Study Plan: [WEEK OF DATE]

## Overview
- Total study hours: [X]
- Subjects: [Y]
- Priority focus: [Topic/subject needing most attention]
- Key deadlines: [List]

## Time-Blocked Schedule

### Monday [Total: X hours study]

**07:00-08:00:** Morning routine
**08:00-09:00:** [CLASS]
**09:00-10:00:** Free
**10:00-11:00:** [CLASS]
**11:00-12:00:** Study Block 1: [Subject] - [Specific activity]
  - 11:00-11:25: [Activity]
  - 11:25-11:30: Break
  - 11:30-11:55: [Activity]
  - 11:55-12:00: Break
**12:00-13:00:** Lunch
**13:00-14:00:** [CLASS]
**14:00-15:00:** Free
**15:00-16:30:** Study Block 2: [Subject] - [Specific activity]
  - 15:00-15:25: [Activity]
  - 15:25-15:30: Break
  - 15:30-15:55: [Activity]
  - 15:55-16:00: Break
  - 16:00-16:25: [Activity]
  - 16:25-16:30: Break
**16:30-18:00:** Free time / Exercise
**18:00-19:00:** Dinner
**19:00-20:00:** Study Block 3: [Subject] - [Specific activity]
**20:00-22:00:** Personal time
**22:00:** Wind down for bed

### Tuesday [Total: X hours study]
[Similar structure]

### Wednesday [Total: X hours study]
[Similar structure]

### Thursday [Total: X hours study]
[Similar structure]

### Friday [Total: X hours study]
[Similar structure]

### Saturday [Total: X hours study]
[Similar structure, lighter load]

### Sunday [Total: X hours study]
[Similar structure, focus on review and planning]

## Study Block Details

### Study Block Types:

**Deep Work Blocks** (High energy times):
- New material learning
- Difficult problems
- Conceptual understanding
- Duration: 50-90 minutes

**Practice Blocks** (Medium energy):
- Practice problems
- Active recall sessions
- Application exercises
- Duration: 50-75 minutes

**Review Blocks** (Lower energy):
- Spaced repetition reviews
- Light practice
- Organization
- Duration: 25-50 minutes

## Subject Allocation This Week

**[Subject 1]:** [X hours]
- New topics: [Topics]
- Review: [Topics]
- Practice: [Types of problems]

**[Subject 2]:** [X hours]
- New topics: [Topics]
- Review: [Topics]
- Practice: [Types of problems]

[Continue for all subjects]

## Daily Checklist

Each day, complete:
- [ ] All scheduled study blocks
- [ ] Active recall for today's material
- [ ] Schedule tomorrow's reviews (spaced repetition)
- [ ] Log what was accomplished
- [ ] Identify any struggles for tomorrow's focus

## Weekly Checklist

By end of week, complete:
- [ ] All priority topics studied
- [ ] Reviews completed on schedule
- [ ] Practice problems for each subject
- [ ] Prepare for next week's priorities
- [ ] Self-assessment of all topics (1-5 scale)

## Flexibility Rules

**If you get behind:**
- Skip lowest-priority items
- Don't sacrifice sleep or breaks to catch up
- Focus on quality over quantity

**If you're ahead:**
- Use extra time on weak areas
- Get ahead on next week's material
- Take guilt-free rest

**If something feels wrong:**
- Adjust on Sunday during weekly planning
- Don't follow a plan that isn't working

## Next Week Preview

**Upcoming deadlines:**
- [Date]: [Assignment/exam]
- [Date]: [Assignment/exam]

**Preparation needed:**
- Start [X] this week to prepare for next week's deadline
- Build in buffer time for [Y]

Print this schedule, put it somewhere visible. Set reminders for study blocks. Track completion daily.
```

---

## Template 7: Troubleshooting Poor Results

### Purpose
Diagnose why student isn't getting desired results

### Template

```
Let's figure out why you're not getting the results you want in [SUBJECT].

**Performance Data:**
1. What results are you getting? (Specific grades/scores)
2. What results do you want?
3. How long have you been struggling? (Weeks, months, entire semester?)

**Current Methods:**
4. Describe your exact study routine for this subject
5. How many hours per week do you study?
6. What techniques do you use? (Reading, practice problems, flashcards, etc.)
7. Do you review old material or just keep moving forward?
8. Do you test yourself? If so, how?

**Context:**
9. Are you struggling with this subject only, or others too?
10. Have you sought help? (Office hours, tutoring, study groups?)
11. How's your sleep, stress level, overall health?

I'll analyze this and identify what's likely causing the poor results, plus give you a specific improvement plan.
```

### Output Template

```
# Diagnostic Analysis: [SUBJECT] Performance

## Current State Summary
- Performance: [Current grade/score]
- Goal: [Desired grade/score]
- Gap: [Difference]
- Study time: [X hours/week]

## Problem Diagnosis

### Primary Issue: [IDENTIFIED PROBLEM]
**Evidence:** [What in their description indicates this]
**Impact:** [How this causes poor performance]

### Secondary Issues:
1. [Issue]: [Brief explanation]
2. [Issue]: [Brief explanation]

## Root Cause Analysis

**Why current methods aren't working:**
[Detailed explanation of the disconnect between their methods and effective learning]

**Specific problems identified:**
- **Passive vs Active:** [Analysis]
- **Spacing:** [Analysis]
- **Practice:** [Analysis]
- **Feedback loops:** [Analysis]
- **Time efficiency:** [Analysis]

## Improvement Plan

### Phase 1: Immediate Changes (This Week)

**Stop doing:**
1. [Ineffective habit] → Why: [Reason]
2. [Ineffective habit] → Why: [Reason]

**Start doing:**
1. [Effective technique] → How: [Specific steps]
2. [Effective technique] → How: [Specific steps]

**Expected immediate result:**
[What should improve within days]

### Phase 2: System Building (Weeks 2-4)

**Implement:**
1. [System/habit] → How: [Implementation steps]
2. [System/habit] → How: [Implementation steps]

**Track:**
- [Metric 1]
- [Metric 2]

**Expected result:**
[What should improve over weeks]

### Phase 3: Optimization (Ongoing)

**Monitor:**
- Are results improving?
- Which techniques work best for you?
- What still needs adjustment?

**Adjust:**
- Double down on what works
- Modify what doesn't
- Continuously refine

## Specific Action Plan for Next 7 Days

**Day 1 (Today):**
- [ ] [Specific task]
- [ ] [Specific task]
- [ ] Track: [What to measure]

**Day 2:**
- [ ] [Specific task]
- [ ] [Specific task]
- [ ] Track: [What to measure]

**Day 3:**
- [ ] [Specific task - likely includes first review]
- [ ] Track: [What to measure]

[Continue through Day 7]

**Day 7:**
- [ ] Self-assessment: Has anything improved?
- [ ] Decide: Continue this plan or adjust?

## Success Metrics

**Leading indicators** (should improve within days):
- Recall accuracy when self-testing
- Ability to explain concepts without notes
- Speed on practice problems
- Confidence in material (self-rated 1-10)

**Lagging indicators** (will improve over weeks):
- Quiz/test scores
- Homework accuracy
- Overall grade

**Track weekly:**
```
Week | Recall % | Problems Correct | Confidence | Test Score
1    | ____%    | ____/____        | ___/10     | ____
2    | ____%    | ____/____        | ___/10     | ____
3    | ____%    | ____/____        | ___/10     | ____
4    | ____%    | ____/____        | ___/10     | ____
```

## If This Plan Doesn't Work

**After 2 weeks, if no improvement:**

**Check these:**
1. Are you actually doing the new techniques, or falling back to old habits?
2. Are you doing them correctly? (Active recall = closing book, not just thinking you could recall)
3. Do you need external help? (Tutor, study group, office hours)
4. Is there a prerequisite gap? (Missing foundational knowledge)
5. Are external factors interfering? (Sleep, stress, health, time management)

**Adjustments to try:**
- [Alternative approach 1]
- [Alternative approach 2]
- [When to seek additional help]

## Encouragement

You're studying [X] hours per week but getting [Y] results. This isn't about effort—you're putting in the time. It's about method efficiency.

By switching to evidence-based techniques, you should see:
- Same or less study time
- Significantly better results
- More confidence
- Less stress

The fact that you're seeking help shows you're committed to improving. That's the hardest part. Now let's get your methods working for you.

Start with Day 1 action items. Track your progress. Check in after one week.
```

---

## Template 8: Motivation and Accountability

### Purpose
Build motivation through structure and tracking

### Template

```
Let's build a motivation and accountability system for [SUBJECT/GOAL].

**Current Situation:**
1. What's making you feel unmotivated?
2. Have you felt motivated to study this before? When? What changed?
3. What would make you feel more motivated?

**Goals:**
4. What do you want to achieve? (Be specific: grade, mastery level, etc.)
5. Why does this matter to you?
6. What happens if you achieve it? (Positive outcomes)
7. What happens if you don't? (Consequences)

**Support Structure:**
8. Who could help keep you accountable? (Friend, family, study partner)
9. What rewards motivate you?
10. How do you prefer to track progress? (App, journal, spreadsheet)

I'll create a motivation system with built-in accountability and progress visibility.
```

### Output Template

```
# Motivation & Accountability System for [SUBJECT/GOAL]

## Your "Why" (Reference this when motivation dips)

**Goal:** [Specific goal]

**Why it matters:**
[Student's reasons]

**Positive outcomes if achieved:**
- [Outcome 1]
- [Outcome 2]
- [Outcome 3]

**Consequences if not achieved:**
- [Consequence 1]
- [Consequence 2]

**Reminder:** This is about [core value/reason], not just a grade.

## Motivation System

### 1. Progress Visibility (Daily)

**Daily Win Log**
Each study day, check off:
```
Date: ______

Today's Wins:
□ Showed up (studied at all, even if short)
□ Completed planned session
□ Used active recall
□ Learned something new
□ Improved on something
□ Stayed focused for planned time
□ Asked for help when needed
□ Other: __________

Biggest win today: __________
Challenge overcome: __________
Tomorrow's goal: __________
```

**Why this works:** Seeing daily progress combats demotivation. You're building evidence that you CAN do this.

### 2. Streak Tracking (Visual)

**Study Streak Calendar**
```
Week 1:  □ □ □ □ □ □ □  (Days studied: ___/7)
Week 2:  □ □ □ □ □ □ □  (Days studied: ___/7)
Week 3:  □ □ □ □ □ □ □  (Days studied: ___/7)
Week 4:  □ □ □ □ □ □ □  (Days studied: ___/7)
```

**Rule:** Check box for any day you studied (even 15 minutes counts)

**Why this works:** Visual streaks create motivation to "not break the chain." Missing one day is okay, missing two in a row is not.

### 3. Micro-Rewards (Immediate)

**After each study session:**
- 25 min study → 5 min [enjoyable activity]
- Completed difficult topic → [small reward]
- Finished weekly goal → [medium reward]

**Suggested rewards:**
- Short: Favorite snack, short walk, social media check, music break
- Medium: Favorite show episode, gaming session, time with friends
- Large: [Student-specific meaningful reward]

**Why this works:** Immediate rewards strengthen habit formation.

### 4. Accountability Partner

**Who:** [Name of accountability partner]

**System:**
- Daily check-in: Did you study today?
- Weekly check-in: How did this week go?
- Share your Daily Win Log
- They can celebrate wins with you

**Commitment:**
"I commit to studying [X hours/week]. If I don't, I'll [consequence, like donating $10 or doing a favor for accountability partner]."

**Why this works:** External accountability increases follow-through.

### 5. Progress Metrics (Weekly)

**Track these numbers weekly:**
```
Week | Study Hours | Recall % | Problems Solved | Confidence (1-10) | Overall Feeling
1    | ____        | ____     | ____            | ____              | ____________
2    | ____        | ____     | ____            | ____              | ____________
3    | ____        | ____     | ____            | ____              | ____________
4    | ____        | ____     | ____            | ____              | ____________
```

**Why this works:** Data shows progress even when you don't "feel" it.

### 6. Weekly Reflection

**Every Sunday, answer:**
1. What went well this week?
2. What was challenging?
3. What did I learn about my learning?
4. What will I do differently next week?
5. Am I closer to my goal than last week?

**Why this works:** Reflection builds metacognition and course-correction ability.

## Motivation Maintenance

### When motivation dips (it will):

**1. Review your "Why"**
Go back to the top of this document. Remember why you started.

**2. Look at your progress data**
Even small progress is still progress. You're not where you started.

**3. Adjust the plan, don't abandon it**
If something isn't working, change the approach, but don't quit.

**4. Start with 5 minutes**
Can't make yourself study? Just 5 minutes. Usually you'll continue.

**5. Talk to your accountability partner**
Tell them you're struggling. Let them remind you of your commitment.

**6. Remember: Action creates motivation**
You're waiting to feel motivated. But it works backwards: study → see progress → feel motivated.

## Emergency Protocols

**If you miss a day:**
- Don't shame yourself
- Just start again tomorrow
- One missed day ≠ failure

**If you miss a week:**
- Something external is probably interfering (stress, health, crisis)
- Address root cause first
- Start fresh with reduced commitment (half the hours)
- Build back up

**If nothing is working:**
- Reassess: Is this method right for you?
- Seek help: Tutor, counselor, study coach
- Check health: Sleep, stress, nutrition, mental health

## Celebration Milestones

**Pre-define celebrations:**
- After 1 week of consistency: [Reward]
- After 2 weeks: [Reward]
- After 4 weeks: [Reward]
- After first improved test score: [Reward]
- After achieving goal: [Major celebration]

**Why this works:** Having something to look forward to maintains motivation through hard work.

## Get Started

**Right now:**
1. Set up your tracking system (calendar, journal, app)
2. Tell your accountability partner about this plan
3. Complete today's first entry in Daily Win Log
4. Plan tomorrow's first study session

**Tomorrow:**
5. Start your study streak
6. Check in with accountability partner after session

**This week:**
7. Complete all daily logs
8. Fill in weekly metrics on Sunday
9. Do weekly reflection

You've got a system now. Trust the process. Track the data. Stay accountable. The motivation will follow the action.
```

---

## Meta-Template: Adapting Prompts for Individual Students

### Variables to Customize

**Student Context:**
- `[SUBJECT]` - Specific course or subject
- `[TOPIC]` - Specific topic within course
- `[DATE]` - Current date or deadline date
- `[X]`, `[Y]` - Numerical values (hours, questions, etc.)
- `[DIFFICULTY]` - Easy, medium, hard
- `[GOAL]` - Student's specific goal

**Learning Profile:**
- `[LEARNING_STYLE]` - Visual, auditory, kinesthetic, reading/writing
- `[ENERGY_PATTERN]` - Morning person, night owl, consistent
- `[CURRENT_METHODS]` - What student is currently doing
- `[MAIN_CHALLENGE]` - Primary obstacle student faces

**Assessment Context:**
- `[EXAM_FORMAT]` - Multiple choice, essays, problems, etc.
- `[TIME_UNTIL_EXAM]` - Days/weeks until assessment
- `[TOPICS_COVERED]` - List of relevant topics
- `[MASTERY_LEVELS]` - Current understanding ratings

### Tone Adjustments

**For discouraged students:**
- More encouragement and validation
- Emphasize quick wins
- Smaller initial commitments

**For confident students:**
- Challenge them appropriately
- Offer advanced optimization
- Higher expectations

**For overwhelmed students:**
- Break down into smallest possible steps
- Heavy focus on prioritization
- Permission to not do everything

**For analytical students:**
- Include more data and research
- Explain mechanisms thoroughly
- Provide metrics and tracking

---

## Usage Guidelines for LLM Agents

1. **Select appropriate template** based on student's current need
2. **Fill in all placeholders** with student-specific information
3. **Adapt tone** to match student's emotional state and personality
4. **Customize examples** to student's actual subject matter
5. **Add or remove sections** based on relevance
6. **Follow up** with accountability and adjustment

These templates are starting points, not rigid scripts. Use judgment to adapt to individual student contexts.

---

**Document version**: 1.0
**Last updated**: 2025-12-19
**Usage**: These templates standardize coaching interventions while allowing for personalization. Use them as frameworks, not verbatim scripts.
