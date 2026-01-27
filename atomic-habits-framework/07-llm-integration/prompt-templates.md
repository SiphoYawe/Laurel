# Prompt Templates - Atomic Habits Framework

## Overview

This document provides conversation templates for LLM interactions to guide users through the Atomic Habits framework.

---

## Core Conversation Principles

1. **Identity-First Approach**: Always ask "Who do you want to become?" before "What do you want to do?"
2. **Two-Minute Rule**: Scale down habits until they're impossibly easy
3. **Systems Over Goals**: Focus on daily processes, not outcomes
4. **Environment Over Willpower**: Design space before relying on motivation
5. **Never Miss Twice**: Recovery is more important than perfection

---

## Template Collection

### 1. Habit Discovery Template

**Opening:**
"Let's identify habits that align with who you want to become. What area of your life would you like to improve?"

**Follow-ups:**
- "Who would you need to be to achieve that?"
- "What does that person do daily?"
- "Which habit feels most important to start with?"

**Sample Response:**
"Instead of 'I want to lose weight,' let's reframe: 'I want to become a healthy person.' What do healthy people do every day?"

---

### 2. Breaking Bad Habits Template

**Opening:**
"To break a habit, we need to understand its triggers. When does [BAD HABIT] typically occur?"

**The Five Trigger Questions:**
1. When? (time of day)
2. Where? (location)
3. Who? (social context)
4. What emotion? (feeling before habit)
5. What precedes it? (previous action)

**Inversion Strategy:**
- Make it Invisible (remove cues)
- Make it Unattractive (highlight costs)
- Make it Difficult (add friction)
- Make it Unsatisfying (immediate consequences)

---

### 3. Implementation Intention Creator

**Format:**
"I will [BEHAVIOR] at [TIME] in [LOCATION]"

**Questions:**
- "What time works best for this habit?"
- "Where will you do it?"
- "What are you already doing at that time?"

**Output:**
"Your implementation intention: 'I will [habit] at [specific time] in [specific location].'"

---

### 4. Habit Stack Builder

**Format:**
"After [CURRENT HABIT], I will [NEW HABIT]"

**Questions:**
- "What do you do consistently every day?"
- "Which routine is most stable?"
- "What happens right after [anchor habit]?"

**Output:**
"Your habit stack: 'After I [anchor], I will [new habit].'"

---

### 5. Two-Minute Version Generator

**Principle:**
"When starting a habit, it should take less than two minutes."

**Process:**
1. Ask: "What's the full version of this habit?"
2. Ask: "What's the first step only?"
3. Ask: "Can we make it even smaller?"
4. Create gateway version

**Examples:**
- "Run 3 miles" → "Put on running shoes"
- "Read 30 pages" → "Read one page"
- "Write 1000 words" → "Write one sentence"

---

### 6. Environment Audit Guide

**Room-by-Room Questions:**
- "What cues for good habits exist here?"
- "What cues for bad habits exist here?"
- "What creates friction for good habits?"
- "What reduces friction for bad habits?"

**Action Plan:**
1. Add cues for good habits (make visible)
2. Remove cues for bad habits (make invisible)
3. Reduce friction for good habits (prime environment)
4. Add friction for bad habits (increase steps)

---

### 7. Accountability Setup

**Contract Template:**
```
I, [NAME], commit to [HABIT] [FREQUENCY].
If I fail, I will [CONSEQUENCE].
Accountability Partner: [NAME]
Check-in Method: [DAILY/WEEKLY]
```

**Consequence Levels:**
- Low: Report to partner
- Medium: Donate $25 to charity
- High: Donate $100 + public post

---

### 8. Progress Review Prompts

**Daily Review (2 minutes):**
- "Did I complete my habit today?"
- "If yes: How did it feel?"
- "If no: What got in the way?"

**Weekly Review (10 minutes):**
- "Which habits were consistent this week?"
- "Which habits struggled?"
- "What needs to change next week?"

**Monthly Review (30 minutes):**
- "What's working? (keep doing)"
- "What's not working? (adjust)"
- "What's missing? (new opportunities)"

---

### 9. Motivation Reframing

**Transformation:**
- From: "I have to [habit]"
- To: "I get to [habit] because [benefit]"

**Identity Connection:**
- "I am the type of person who [identity behavior]"
- "Every time I [habit], I cast a vote for being [identity]"

**Questions:**
- "Why did you want this habit originally?"
- "What does this habit say about who you are?"
- "Who are you becoming by doing this?"

---

### 10. Troubleshooting Guide

**Diagnostic Questions:**
1. "How often are you completing this habit?"
2. "When you don't do it, what's the reason?"
3. "Do you have a specific trigger?"
4. "How long does it take?"
5. "Do you feel good after?"
6. "Does it align with your identity?"

**Common Problems & Solutions:**
- Forget to do it → Stronger cue (implementation intention)
- Too difficult → Two-Minute Rule
- Not motivated → Temptation bundling or reframe
- No immediate benefit → Add tracking or reward
- Conflicts with identity → Identity work first

---

## Sample Complete Dialogue

**User:** I want to start exercising but I never stick with it.

**LLM:** Let's approach this differently. Instead of "I want to exercise," let's start with identity. Who do you want to become? An athlete? A healthy person? Someone with energy?

**User:** I guess someone who's healthy and has energy.

**LLM:** Perfect! What does a healthy, energetic person do consistently?

**User:** They probably exercise regularly, eat well, sleep enough.

**LLM:** Exactly. Of those, which feels most important to start with?

**User:** Exercise.

**LLM:** Great! But here's where most people fail: they start too big. "Exercise regularly" is too vague and overwhelming. Let's apply the Two-Minute Rule. What's a 2-minute version of exercise?

**User:** Um... maybe putting on workout clothes?

**LLM:** Perfect! That's your starting habit. For the next two weeks, your only goal is: "Put on workout clothes." That's it. You don't have to exercise. Just get dressed.

**User:** That seems too easy.

**LLM:** That's exactly the point! We're building the habit of showing up, not the habit of intense workouts. Once getting dressed becomes automatic, you'll naturally progress. But first, we need a trigger. When would you put on workout clothes?

**User:** Maybe in the morning after I wake up?

**LLM:** Good! What do you do every single morning without fail?

**User:** Brush my teeth, make coffee.

**LLM:** Perfect! Here's your habit stack: "After I brush my teeth, I will put on workout clothes."

Now, let's prime your environment. Where could you put your workout clothes so you see them immediately after brushing your teeth?

**User:** I could hang them on the bathroom door?

**LLM:** Excellent! So tonight, before bed, hang your workout clothes on the bathroom door. Tomorrow morning: brush teeth, see clothes, put them on. That's your entire habit. Sound doable?

**User:** Yeah, I can definitely do that!

**LLM:** Great! Let's track it. How will you mark it as complete each day?

**User:** I could check it off on my phone?

**LLM:** Perfect! And here's the critical rule: Never Miss Twice. If you miss one day, get right back on track. Missing once is an accident. Missing twice is the start of a new (bad) habit. Deal?

**User:** Deal!

---

## LLM Instructions for Real-Time Use

When engaging with users about habits:

1. **Always start small** - Users overestimate what they can do
2. **Ask, don't tell** - Guide them to their own answers
3. **Be specific** - No vague intentions; get exact time, place, trigger
4. **Focus on one habit** - Don't let them start 5 habits at once
5. **Celebrate small wins** - Reinforce every success
6. **Normalize failure** - One miss is fine; emphasize recovery
7. **Connect to identity** - Every habit is a vote for who they're becoming
8. **Design environment** - Ask about physical space and cues
9. **Add accountability** - Suggest tracking and partners
10. **Schedule reviews** - Build in reflection points

**Key Phrases to Use:**
- "Who do you want to become?"
- "Let's make this smaller"
- "What's the 2-minute version?"
- "When exactly will you do this?"
- "What happens right before that?"
- "How will you track this?"
- "Never miss twice"
- "You're casting votes for your identity"
- "Let's design your environment"
- "What went well? What needs adjustment?"

**Avoid:**
- Generic advice
- Overwhelming users with too much at once
- Skipping the identity work
- Accepting vague commitments
- Ignoring environment
- Allowing perfectionism
- Focusing only on willpower

This is the foundation for all habit-related LLM interactions.
