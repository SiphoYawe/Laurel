# Data Models - Atomic Habits Framework

## Overview

This document defines the data structures needed to build a habit-forming ecosystem. These models support all components described in ecosystem-components.md and enable comprehensive habit tracking, analysis, and optimization.

---

## Core Data Models

### 1. User Model

The central entity representing the individual building habits.

```typescript
interface User {
  // Identity
  id: string;                          // UUID
  email: string;                        // Unique
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;

  // Profile
  timezone: string;                     // e.g., "America/New_York"
  locale: string;                       // e.g., "en-US"
  dateOfBirth?: Date;

  // Identity & Goals
  currentIdentity: IdentityStatement[];
  desiredIdentity: IdentityStatement[];
  identityScore: number;                // 0-100, calculated
  goals: Goal[];

  // Context
  dailyRoutine: RoutineActivity[];
  locations: Location[];
  schedule: Schedule;

  // Preferences
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  displayPreferences: DisplayPreferences;

  // Relationships
  accountabilityPartners: string[];     // User IDs
  activeContracts: string[];            // Contract IDs
  following: string[];                  // User IDs (optional social feature)
  followers: string[];                  // User IDs (optional social feature)

  // Metrics (cached, calculated periodically)
  stats: {
    totalHabits: number;
    activeHabits: number;
    archivedHabits: number;
    totalCompletions: number;
    longestStreak: number;
    currentLevel: number;
    totalBadges: number;
    averageSuccessRate: number;         // 0-100
  };

  // Subscription & Payments (if applicable)
  subscriptionTier?: 'free' | 'premium' | 'pro';
  subscriptionExpiry?: Date;
}
```

```typescript
interface IdentityStatement {
  id: string;
  statement: string;                     // "I am the type of person who..."
  createdAt: Date;
  confidence: number;                    // 0-100, self-reported
  evidence: string[];                    // Habit IDs that support this identity
}
```

```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;                      // health, career, relationships, etc.
  targetDate?: Date;
  status: 'active' | 'completed' | 'abandoned';
  relatedHabits: string[];               // Habit IDs
  progress: number;                      // 0-100
  createdAt: Date;
  completedAt?: Date;
}
```

```typescript
interface Location {
  id: string;
  name: string;                          // "Home", "Office", "Gym"
  type: 'home' | 'work' | 'gym' | 'outdoors' | 'other';
  address?: string;
  coordinates?: {latitude: number; longitude: number};
  frequencyVisited: 'daily' | 'weekly' | 'occasional';
  habitIds: string[];                    // Habits performed here
}
```

### 2. Habit Model

The core entity representing a habit.

```typescript
interface Habit {
  // Identity
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Description
  name: string;                          // "Meditate for 10 minutes"
  description?: string;
  category: string;                      // health, productivity, social, etc.
  type: 'build' | 'break' | 'maintain'; // Build good, break bad, or maintain existing

  // Identity Connection
  linkedIdentityId?: string;
  identityStatement?: string;            // "I am a person who..."
  why: string;                           // Why this habit matters

  // Scheduling
  frequency: FrequencyConfig;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
  specificTime?: string;                 // "07:00" (24-hour format)
  daysOfWeek?: number[];                 // 0-6 (Sunday=0)

  // Triggers (1st Law: Make it Obvious)
  triggerType: 'time' | 'location' | 'action' | 'emotion' | 'notification';
  triggerDetails: TriggerDetails;
  implementationIntention?: string;      // "I will [X] at [Y] in [Z]"
  habitStack?: HabitStack;

  // Attractiveness (2nd Law: Make it Attractive)
  attractiveness: number;                // 0-10, self-rated
  temptationBundle?: TemptationBundle;
  motivationScript?: string;
  socialComponent?: string;              // Group/community aspect

  // Ease (3rd Law: Make it Easy)
  difficulty: number;                    // 1-10, self-rated
  currentVersion: string;                // Current implementation
  twoMinuteVersion: string;              // Gateway version
  targetVersion: string;                 // Ultimate goal
  estimatedDuration: number;             // minutes
  frictionLevel: number;                 // 0-10 (0=no friction)

  // Reward (4th Law: Make it Satisfying)
  immediateReward?: string;
  milestoneRewards: MilestoneReward[];
  trackingMethod: string;                // How user tracks completion
  rewardId?: string;                     // Link to Reward system

  // Environment
  location?: string;                     // Location ID
  environmentCues: Cue[];
  requiredResources: string[];           // Equipment, apps, etc. needed

  // Tracking & Progress
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'paused' | 'completed' | 'archived';

  // Metrics (cached, calculated from entries)
  metrics: {
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    successRate: number;                 // 0-100
    averageCompletionTime?: string;      // "07:15"
    lastCompletedAt?: Date;
    consecutiveMisses: number;           // For tracking failures
  };

  // Accountability
  requiresAccountability: boolean;
  accountabilityPartners: string[];      // User IDs
  contractId?: string;
  checkInFrequency?: 'daily' | 'weekly' | 'monthly';

  // Advanced
  tags: string[];
  notes?: string;
  parentHabitId?: string;                // For habit chains/stacks
  childHabitIds: string[];               // Habits that depend on this one
  relatedGoalIds: string[];
}
```

```typescript
interface FrequencyConfig {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;                        // e.g., 7 for daily, 3 for "3x per week"
  period: 'day' | 'week' | 'month';
  minimumSuccess: number;                // Minimum completions to consider period successful
}
```

```typescript
interface TriggerDetails {
  // For time-based
  time?: string;                         // "07:00"

  // For location-based
  locationId?: string;
  arrivalOrDeparture?: 'arrival' | 'departure';

  // For action-based (habit stacking)
  anchorHabitId?: string;
  anchorAction?: string;

  // For emotion-based
  emotion?: string;                      // "stress", "boredom", "energy"

  // For notification-based
  notificationConfig?: NotificationConfig;
}
```

```typescript
interface HabitStack {
  anchorHabitId: string;
  position: 'before' | 'after' | 'during';
  formula: string;                       // "After [X], I will [Y]"
  stackId?: string;                      // If part of larger stack
}
```

```typescript
interface TemptationBundle {
  needHabit: string;                     // This habit (the need)
  wantActivity: string;                  // Enjoyable activity (the want)
  formula: string;                       // "After [need], I will [want]"
  concurrent: boolean;                   // Can they be done simultaneously?
}
```

```typescript
interface MilestoneReward {
  milestone: number;                     // e.g., 7 for "7-day streak"
  milestoneType: 'streak' | 'completions' | 'success_rate';
  reward: string;
  unlocked: boolean;
  unlockedAt?: Date;
}
```

```typescript
interface Cue {
  id: string;
  type: 'visual' | 'auditory' | 'tactile' | 'digital';
  description: string;
  location: string;
  visibility: number;                    // 0-10
  effectiveness?: number;                // 0-10, based on data
}
```

### 3. Entry Model

Represents a single instance of habit completion or skip.

```typescript
interface Entry {
  // Identity
  id: string;
  habitId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Completion
  date: Date;                            // Date of the habit (not timestamp)
  completed: boolean;
  skipped: boolean;

  // Details
  timestamp?: Date;                      // Exact time completed
  duration?: number;                     // Actual duration in minutes
  quantity?: number;                     // For countable habits
  quality?: number;                      // 1-10 self-rating

  // Context
  locationId?: string;
  mood?: string;                         // "happy", "stressed", "tired", etc.
  energy?: number;                       // 1-10
  weatherCondition?: string;             // Optional: weather at time

  // Enrichment
  notes?: string;
  tags?: string[];
  photos?: string[];                     // Photo URLs or file paths

  // Skip details (if skipped)
  skipReason?: string;
  plannedCompletion?: Date;              // When planning to make up

  // Tracking
  manualEntry: boolean;                  // True if user manually logged, false if auto-detected
  verifiedByPartner: boolean;            // For accountability
  verifierId?: string;                   // Partner who verified

  // Metadata
  source: 'app' | 'web' | 'api' | 'integration' | 'voice';
  deviceType?: string;
  editHistory?: Edit[];
}
```

```typescript
interface Edit {
  timestamp: Date;
  field: string;
  oldValue: any;
  newValue: any;
  reason?: string;
}
```

### 4. Environment Model

Represents a physical or digital space optimized for habits.

```typescript
interface Environment {
  // Identity
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Description
  spaceType: 'bedroom' | 'kitchen' | 'office' | 'living_room' | 'gym' | 'car' | 'digital' | 'other';
  name: string;
  description?: string;

  // Physical Space
  photos: Photo[];
  layout?: LayoutData;
  dimensions?: {length: number; width: number; unit: string};

  // Habits
  supportedHabits: string[];             // Habit IDs this space supports
  problematicHabits: string[];           // Habit IDs triggered negatively here

  // Cues
  cues: EnvironmentCue[];

  // Friction Points
  frictionPoints: FrictionPoint[];

  // Changes
  plannedChanges: EnvironmentChange[];
  implementedChanges: EnvironmentChange[];

  // Zones (dedicated areas within space)
  zones: Zone[];

  // Effectiveness
  overallScore: number;                  // 0-100, calculated
  lastAuditDate: Date;
  nextAuditDate?: Date;

  // Digital Environment (if spaceType === 'digital')
  digitalDetails?: DigitalEnvironment;
}
```

```typescript
interface EnvironmentCue {
  id: string;
  habitId: string;
  cueType: 'visual' | 'auditory' | 'tactile' | 'olfactory';
  description: string;
  placement: string;
  visibility: number;                    // 0-10
  effectiveness?: number;                // 0-10, calculated from data
  addedAt: Date;
  photoId?: string;
}
```

```typescript
interface FrictionPoint {
  id: string;
  habitId: string;
  habitType: 'good' | 'bad';
  frictionType: 'steps' | 'distance' | 'time' | 'decision' | 'obstacle';
  description: string;
  currentFrictionLevel: number;          // 0-10
  targetFrictionLevel: number;           // 0-10
  impact: 'high' | 'medium' | 'low';
}
```

```typescript
interface EnvironmentChange {
  id: string;
  changeType: 'add_cue' | 'remove_cue' | 'add_friction' | 'remove_friction' | 'rearrange' | 'declutter';
  description: string;
  habitIds: string[];                    // Affected habits
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  priority: number;                      // 1-5
  status: 'planned' | 'in_progress' | 'completed' | 'abandoned';
  plannedDate?: Date;
  completedDate?: Date;
  effectiveness?: number;                // 0-10, rated after implementation
  beforePhoto?: string;
  afterPhoto?: string;
  notes?: string;
}
```

```typescript
interface Zone {
  id: string;
  name: string;
  purpose: string;                       // "Reading zone", "Workout area"
  dedicatedTo: string[];                 // Habit IDs
  boundaries: string;                    // Description of zone boundaries
  rules: string[];                       // "Only reading in this chair", etc.
}
```

```typescript
interface DigitalEnvironment {
  platform: 'phone' | 'computer' | 'tablet';
  homeScreenApps: string[];
  blockedApps: string[];
  blockerTools: BlockerConfig[];
  notificationSettings: NotificationConfig[];
  defaultBrowser?: string;
  defaultStartPage?: string;
  screenTimeLimit?: number;              // minutes per day
}
```

### 5. Stack Model

Represents a chain of habits performed in sequence.

```typescript
interface Stack {
  // Identity
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Configuration
  type: 'morning' | 'evening' | 'work' | 'custom';
  habits: StackHabit[];                  // Ordered list

  // Triggering
  stackTrigger: string;                  // What initiates the entire stack
  triggerTime?: string;                  // "07:00"

  // Performance
  status: 'active' | 'testing' | 'paused' | 'archived';
  trialStartDate?: Date;
  trialEndDate?: Date;

  // Metrics
  metrics: {
    totalRuns: number;
    completeRuns: number;                // All habits completed
    partialRuns: number;                 // Some habits completed
    averageCompletion: number;           // 0-100%
    successRate: number;                 // 0-100
    weakLinks: string[];                 // Habit IDs that break the chain most often
  };

  // Notes
  notes?: string;
}
```

```typescript
interface StackHabit {
  habitId: string;
  position: number;                      // Order in stack (1, 2, 3...)
  formula: string;                       // "After [previous], I will [this]"
  required: boolean;                     // Is this habit required for stack success?
  estimatedDuration: number;             // minutes
}
```

### 6. Contract Model

Represents a habit contract with accountability and consequences.

```typescript
interface Contract {
  // Identity
  id: string;
  userId: string;
  createdAt: Date;
  startDate: Date;
  endDate?: Date;

  // Commitment
  habitId: string;
  commitmentStatement: string;           // "I will [X] [frequency]"
  frequency: FrequencyConfig;
  minimumSuccessRate: number;            // 0-100

  // Accountability
  partners: ContractPartner[];
  checkInFrequency: 'daily' | 'weekly';
  checkInMethod: string;                 // "text", "app", "call"

  // Consequences
  consequences: {
    missOne: Consequence;
    missTwo: Consequence;
    missThree: Consequence;
    breakStreak: Consequence;
  };

  // Rewards
  rewards: {
    milestone: number;                   // Days/completions
    reward: string;
    unlocked: boolean;
  }[];

  // Enforcement
  autoEnforce: boolean;                  // Automatically trigger consequences?
  gracePeriod: number;                   // Hours before consequence enforced

  // Status
  status: 'active' | 'completed' | 'terminated' | 'renewed';
  performanceHistory: ContractPerformance[];

  // Review
  reviewFrequency: 'weekly' | 'monthly' | 'quarterly';
  lastReviewDate?: Date;
  nextReviewDate?: Date;

  // Signatures
  userSignature: Signature;
  partnerSignatures: Signature[];
}
```

```typescript
interface ContractPartner {
  userId: string;
  role: 'enforcer' | 'supporter' | 'peer';
  responsibilities: string[];
  contactMethod: string;
  acceptedAt?: Date;
}
```

```typescript
interface Consequence {
  type: 'financial' | 'social' | 'task' | 'notification';
  description: string;
  amount?: number;                       // For financial
  recipient?: string;                    // For financial or social
  task?: string;                         // For task-based
  severity: 'low' | 'medium' | 'high';
}
```

```typescript
interface Signature {
  userId: string;
  signedAt: Date;
  ipAddress?: string;
  agreement: string;                     // What they agreed to
}
```

```typescript
interface ContractPerformance {
  date: Date;
  completed: boolean;
  missCount: number;
  consequenceTriggered?: string;
  consequenceEnforced?: boolean;
  notes?: string;
}
```

### 7. Partnership Model

Represents accountability partnership between users.

```typescript
interface Partnership {
  // Identity
  id: string;
  createdAt: Date;
  startDate: Date;
  endDate?: Date;

  // Participants
  user1Id: string;
  user2Id: string;
  roles: {
    [userId: string]: 'peer' | 'coach' | 'checker';
  };

  // Configuration
  agreementTerms: string[];
  checkInSchedule: CheckInSchedule;
  communicationMethod: 'app' | 'text' | 'email' | 'call';

  // Linked Habits
  sharedHabits: string[];                // Habit IDs both are working on
  watchedHabits: {
    [userId: string]: string[];          // Habit IDs partner is watching
  };

  // Status
  status: 'pending' | 'active' | 'paused' | 'terminated';
  healthScore: number;                   // 0-100, calculated

  // Communication
  lastCheckIn: Date;
  checkInHistory: CheckIn[];
  messageHistory: Message[];

  // Ratings
  ratings: {
    userId: string;
    rating: number;                      // 1-5
    feedback: string;
    ratedAt: Date;
  }[];
}
```

```typescript
interface CheckInSchedule {
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[];                 // For weekly
  time?: string;                         // "19:00"
  required: boolean;
}
```

```typescript
interface CheckIn {
  id: string;
  from: string;                          // User ID
  to: string;                            // User ID
  timestamp: Date;
  habitIds: string[];
  message: string;
  statusReport: {
    habitId: string;
    completed: boolean;
    notes?: string;
  }[];
  responseRequired: boolean;
  respondedAt?: Date;
}
```

### 8. Review Model

Represents a reflection/review session.

```typescript
interface Review {
  // Identity
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  createdAt: Date;

  // Timing
  scheduledDate: Date;
  completedDate?: Date;
  duration?: number;                     // minutes spent on review
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';

  // Content
  questions: ReviewQuestion[];
  responses: ReviewResponse[];

  // Insights (generated by LLM or analytics)
  insights: Insight[];
  successFactors: Factor[];
  failurePatterns: Pattern[];
  recommendations: Recommendation[];

  // Actions Taken
  actionItems: ActionItem[];
  habitModifications: HabitModification[];
  newHabitsPlanned: string[];            // Habit IDs
  habitsRetired: string[];               // Habit IDs
  habitsAdjusted: string[];              // Habit IDs

  // Metrics Snapshot (at time of review)
  metricsSnapshot: {
    activeHabits: number;
    totalCompletions: number;
    averageSuccessRate: number;
    longestStreak: number;
    identityProgress: number;
    habitsByCategory: {[category: string]: number};
  };

  // Comparison (to previous review)
  previousReviewId?: string;
  changesSinceLastReview?: {
    habitsAdded: number;
    habitsCompleted: number;
    habitsAbandoned: number;
    successRateChange: number;           // +/- percentage points
  };
}
```

```typescript
interface ReviewQuestion {
  id: string;
  question: string;
  category: string;
  required: boolean;
  responseType: 'text' | 'scale' | 'multiple_choice' | 'yes_no';
  options?: string[];                    // For multiple choice
  scaleMin?: number;                     // For scale
  scaleMax?: number;
}
```

```typescript
interface ReviewResponse {
  questionId: string;
  response: string | number | boolean;
  responseText?: string;                 // Elaboration
  timestamp: Date;
}
```

```typescript
interface Insight {
  type: 'success' | 'warning' | 'opportunity' | 'pattern';
  title: string;
  description: string;
  evidence: string[];                    // Supporting data points
  confidence: number;                    // 0-100
  habitIds: string[];                    // Related habits
}
```

```typescript
interface Factor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  habitIds: string[];
}
```

```typescript
interface Pattern {
  pattern: string;
  occurrences: number;
  examples: string[];
  suggestion: string;
}
```

```typescript
interface ActionItem {
  id: string;
  action: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
}
```

```typescript
interface HabitModification {
  habitId: string;
  modificationType: 'make_easier' | 'make_harder' | 'change_time' | 'change_trigger' | 'add_reward' | 'other';
  description: string;
  implemented: boolean;
  implementedAt?: Date;
}
```

### 9. Reward Model

Represents rewards for habit completion.

```typescript
interface Reward {
  // Identity
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;

  // Configuration
  type: 'digital' | 'physical' | 'social' | 'experience' | 'financial';
  value: string;                         // Description of reward value

  // Triggering
  triggerType: 'completion' | 'streak' | 'milestone' | 'random' | 'manual';
  triggerConditions: TriggerCondition[];

  // Delivery
  deliveryMethod: 'automatic' | 'manual' | 'partner';
  deliveryInstructions?: string;

  // Variability
  isVariable: boolean;
  variableSchedule?: {
    ratio: number;                       // e.g., every 3 completions on average
    minInterval: number;
    maxInterval: number;
  };

  // Status
  status: 'active' | 'paused' | 'depleted';
  timesAwarded: number;
  lastAwardedAt?: Date;

  // Effectiveness
  effectiveness?: number;                // 0-10, rated by user
  motivationBoost?: number;              // Impact on habit completion rate
}
```

```typescript
interface TriggerCondition {
  type: 'completion_count' | 'streak_length' | 'success_rate' | 'time_based' | 'custom';
  operator: 'equals' | 'greater_than' | 'less_than' | 'between';
  value: number | [number, number];
  habitId?: string;                      // Specific habit or all habits
}
```

### 10. Badge/Achievement Model

Represents gamification elements.

```typescript
interface Badge {
  // Identity
  id: string;
  name: string;
  description: string;
  icon: string;                          // Icon URL or name

  // Requirements
  category: string;
  requirements: Requirement[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Progress
  progress: number;                      // 0-100
  unlocked: boolean;
  unlockedAt?: Date;

  // Social
  sharedPublicly: boolean;
  sharedAt?: Date;
}
```

```typescript
interface Requirement {
  type: 'completion_count' | 'streak' | 'consistency' | 'variety' | 'speed' | 'custom';
  description: string;
  targetValue: number;
  currentValue: number;
  habitId?: string;
}
```

---

## Supporting Data Structures

### Notification Configuration

```typescript
interface NotificationPreferences {
  enabled: boolean;
  quietHoursStart?: string;              // "22:00"
  quietHoursEnd?: string;                // "07:00"
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  habitReminders: boolean;
  checkInReminders: boolean;
  reviewReminders: boolean;
  milestoneAlerts: boolean;
  partnerNotifications: boolean;
  marketingEmails: boolean;
}
```

```typescript
interface NotificationConfig {
  habitId: string;
  type: 'reminder' | 'encouragement' | 'celebration' | 'accountability';
  timing: 'before' | 'at' | 'after';
  offset?: number;                       // minutes before/after
  message?: string;                      // Custom message
  enabled: boolean;
  deliveryMethod: 'push' | 'email' | 'sms';
}
```

### Privacy & Display

```typescript
interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  habitVisibility: 'public' | 'friends' | 'private';
  streakVisibility: 'public' | 'friends' | 'private';
  allowPartnerRequests: boolean;
  showOnLeaderboard: boolean;
  dataSharing: {
    analytics: boolean;
    research: boolean;
    thirdParty: boolean;
  };
}
```

```typescript
interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: string;
  dateFormat: string;                    // "MM/DD/YYYY" or "DD/MM/YYYY"
  timeFormat: '12h' | '24h';
  startOfWeek: number;                   // 0-6 (Sunday=0)
  defaultView: 'list' | 'grid' | 'calendar';
  showCompletionAnimations: boolean;
  motivationalQuotes: boolean;
}
```

### Schedule & Routine

```typescript
interface Schedule {
  workDays: number[];                    // 0-6
  workHoursStart: string;                // "09:00"
  workHoursEnd: string;                  // "17:00"
  sleepSchedule: {
    bedtime: string;                     // "23:00"
    wakeTime: string;                    // "07:00"
  };
  meals: {
    breakfast?: string;                  // "08:00"
    lunch?: string;
    dinner?: string;
  };
  flexibleTime: TimeBlock[];
}
```

```typescript
interface TimeBlock {
  name: string;
  start: string;
  end: string;
  daysOfWeek: number[];
  recurring: boolean;
}
```

```typescript
interface RoutineActivity {
  name: string;
  time: string;
  duration: number;                      // minutes
  location: string;
  consistency: number;                   // 0-100, how often done
  isHabit: boolean;
  habitId?: string;
}
```

---

## Calculated/Derived Fields

These fields are computed from other data and cached for performance.

### User Stats (cached)

```typescript
interface UserStats {
  // Updated daily
  currentStreaks: {habitId: string; streak: number}[];
  todayCompletions: number;
  weekCompletions: number;
  monthCompletions: number;

  // Updated weekly
  weeklySuccessRate: number;
  topHabits: string[];                   // Habit IDs with best performance
  strugglingHabits: string[];            // Habit IDs with poor performance

  // Updated monthly
  monthlySuccessRate: number;
  habitsCompletedThisMonth: number;
  identityProgress: number;              // How well habits align with identity
  level: number;                         // Gamification level

  // All-time
  totalDaysTracking: number;
  longestStreakEver: number;
  totalBadgesEarned: number;
}
```

### Habit Analytics (cached)

```typescript
interface HabitAnalytics {
  habitId: string;

  // Performance
  last7Days: {date: Date; completed: boolean}[];
  last30Days: {date: Date; completed: boolean}[];
  successRateTrend: 'improving' | 'stable' | 'declining';

  // Patterns
  bestDayOfWeek: number;                 // 0-6
  bestTimeOfDay: string;
  averageCompletionTime: string;
  commonSkipReasons: {reason: string; count: number}[];

  // Context
  successfulContexts: {
    location?: string;
    mood?: string;
    energy?: number;
    count: number;
  }[];

  // Predictions
  nextLikelyCompletion: Date;
  riskOfMissing: number;                 // 0-100
  suggestions: string[];
}
```

---

## API Endpoint Structure

### Suggested REST API Endpoints

```typescript
// Users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/stats

// Habits
POST   /api/habits
GET    /api/habits
GET    /api/habits/:id
PATCH  /api/habits/:id
DELETE /api/habits/:id
GET    /api/habits/:id/analytics
POST   /api/habits/:id/complete
POST   /api/habits/:id/skip

// Entries
POST   /api/entries
GET    /api/entries?habitId=:id&startDate=:date&endDate=:date
GET    /api/entries/:id
PATCH  /api/entries/:id
DELETE /api/entries/:id

// Environments
POST   /api/environments
GET    /api/environments
GET    /api/environments/:id
PATCH  /api/environments/:id
POST   /api/environments/:id/audit
POST   /api/environments/:id/changes

// Stacks
POST   /api/stacks
GET    /api/stacks
GET    /api/stacks/:id
PATCH  /api/stacks/:id
DELETE /api/stacks/:id
GET    /api/stacks/:id/performance

// Contracts
POST   /api/contracts
GET    /api/contracts
GET    /api/contracts/:id
POST   /api/contracts/:id/sign
PATCH  /api/contracts/:id
POST   /api/contracts/:id/consequence

// Partnerships
GET    /api/partnerships
POST   /api/partnerships/request
POST   /api/partnerships/:id/accept
POST   /api/partnerships/:id/decline
DELETE /api/partnerships/:id
POST   /api/partnerships/:id/checkin
GET    /api/partnerships/:id/history

// Reviews
GET    /api/reviews
POST   /api/reviews/:id/start
POST   /api/reviews/:id/respond
POST   /api/reviews/:id/complete
GET    /api/reviews/:id/insights

// Rewards
POST   /api/rewards
GET    /api/rewards
GET    /api/rewards/eligible
POST   /api/rewards/:id/claim
GET    /api/rewards/history

// Analytics
GET    /api/analytics/dashboard
GET    /api/analytics/habits/:id
GET    /api/analytics/trends
GET    /api/analytics/insights
GET    /api/analytics/export
```

---

## Database Schema Recommendations

### Primary Database: PostgreSQL

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Add other fields from User model
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Add other fields from Habit model
  CONSTRAINT valid_status CHECK (status IN ('active', 'paused', 'completed', 'archived'))
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_status ON habits(status);

-- Entries table
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  skipped BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Add other fields from Entry model
  CONSTRAINT completion_check CHECK (NOT (completed AND skipped)),
  CONSTRAINT unique_habit_date UNIQUE (habit_id, date)
);

CREATE INDEX idx_entries_habit_id ON entries(habit_id);
CREATE INDEX idx_entries_date ON entries(date);
CREATE INDEX idx_entries_user_date ON entries(user_id, date);

-- Environments table
CREATE TABLE environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  space_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- Add other fields from Environment model
);

CREATE INDEX idx_environments_user_id ON environments(user_id);

-- Stacks table
CREATE TABLE stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- Add other fields from Stack model
);

-- Contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- Add other fields from Contract model
);

-- Partnerships table
CREATE TABLE partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT different_users CHECK (user1_id != user2_id),
  CONSTRAINT unique_partnership UNIQUE (user1_id, user2_id)
  -- Add other fields from Partnership model
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  review_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- Add other fields from Review model
);

-- Rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  reward_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- Add other fields from Reward model
);
```

### Cache Layer: Redis

```
# User stats cache
user:stats:{userId} → UserStats JSON

# Habit analytics cache
habit:analytics:{habitId} → HabitAnalytics JSON

# Active streaks
user:streaks:{userId} → {habitId: streakLength} hash

# Session data
session:{sessionId} → session data

# Rate limiting
ratelimit:{userId}:{endpoint} → request count

# Leaderboards (optional)
leaderboard:streaks → sorted set of users by longest streak
leaderboard:completions → sorted set of users by total completions
```

---

## Conclusion

These data models provide a comprehensive foundation for building a habit-forming ecosystem based on the Atomic Habits framework. They support:

- **Identity-based habits**: Link habits to user identity
- **Four Laws implementation**: Store all elements needed for each law
- **Environment design**: Track physical and digital spaces
- **Accountability**: Contracts, partnerships, and consequences
- **Reflection**: Regular reviews and insights
- **Gamification**: Rewards, badges, and progress tracking
- **Analytics**: Pattern recognition and performance optimization

The models are designed to be:
- **Flexible**: Support various habit types and configurations
- **Scalable**: Indexed and optimized for performance
- **Comprehensive**: Capture all data needed for insights
- **Privacy-conscious**: Include privacy settings and controls
- **Social**: Support partnerships and community features

Use these as a starting point and adapt based on specific implementation needs and technical constraints.
