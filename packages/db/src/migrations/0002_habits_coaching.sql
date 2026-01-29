-- Migration: 0002_habits_coaching
-- Description: Create habits and coaching tables with RLS policies
-- Date: 2026-01-29

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE habit_category AS ENUM (
  'study',
  'exercise',
  'health',
  'productivity',
  'mindfulness',
  'social',
  'creative',
  'other'
);

CREATE TYPE habit_frequency AS ENUM (
  'daily',
  'weekdays',
  'weekends',
  'weekly',
  'custom'
);

CREATE TYPE session_type AS ENUM (
  'habit_creation',
  'habit_review',
  'motivation',
  'technique_learning',
  'streak_recovery',
  'general_chat'
);

CREATE TYPE message_role AS ENUM (
  'user',
  'assistant',
  'system'
);

-- ============================================================================
-- HABITS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cue_trigger TEXT,
  routine TEXT NOT NULL,
  reward TEXT,
  two_minute_version TEXT,
  category habit_category NOT NULL,
  frequency habit_frequency NOT NULL DEFAULT 'daily',
  frequency_days INTEGER[],
  duration_minutes INTEGER DEFAULT 15,
  target_time TIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits: Index on user_id for fast user lookups
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id);

-- ============================================================================
-- HABIT COMPLETIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  notes TEXT,
  quality_rating INTEGER CHECK (quality_rating IS NULL OR (quality_rating >= 1 AND quality_rating <= 5)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit completions: Indexes
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS habit_completions_completed_at_idx ON public.habit_completions(completed_at);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_idx ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_completed_at_idx ON public.habit_completions(habit_id, completed_at);

-- ============================================================================
-- HABIT STREAKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.habit_streaks (
  habit_id UUID PRIMARY KEY REFERENCES public.habits(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COACHING SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  session_type session_type NOT NULL,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching sessions: Index on user_id
CREATE INDEX IF NOT EXISTS coaching_sessions_user_id_idx ON public.coaching_sessions(user_id);

-- ============================================================================
-- COACHING MESSAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coaching_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.coaching_sessions(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching messages: Index on session_id
CREATE INDEX IF NOT EXISTS coaching_messages_session_id_idx ON public.coaching_messages(session_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HABITS RLS POLICIES
-- Users can only access their own habits
-- ============================================================================

CREATE POLICY "Users can view their own habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- HABIT COMPLETIONS RLS POLICIES
-- Users can only insert and view their own completions
-- ============================================================================

CREATE POLICY "Users can view their own habit completions"
  ON public.habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions"
  ON public.habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- HABIT STREAKS RLS POLICIES
-- Users can view and system updates streaks
-- ============================================================================

CREATE POLICY "Users can view their own habit streaks"
  ON public.habit_streaks FOR SELECT
  USING (
    habit_id IN (
      SELECT id FROM public.habits WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own habit streaks"
  ON public.habit_streaks FOR UPDATE
  USING (
    habit_id IN (
      SELECT id FROM public.habits WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own habit streaks"
  ON public.habit_streaks FOR INSERT
  WITH CHECK (
    habit_id IN (
      SELECT id FROM public.habits WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- COACHING SESSIONS RLS POLICIES
-- Users can only access their own coaching sessions
-- ============================================================================

CREATE POLICY "Users can view their own coaching sessions"
  ON public.coaching_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching sessions"
  ON public.coaching_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- COACHING MESSAGES RLS POLICIES
-- Users can view messages for their sessions
-- ============================================================================

CREATE POLICY "Users can view their own coaching messages"
  ON public.coaching_messages FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM public.coaching_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own coaching messages"
  ON public.coaching_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.coaching_sessions WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for habits
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for habit_streaks
CREATE TRIGGER update_habit_streaks_updated_at
  BEFORE UPDATE ON public.habit_streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
