-- Story 4-1: Create Gamification Database Schema
-- XP, levels, badges, and achievement tracking

-- User gamification stats (one row per user)
CREATE TABLE IF NOT EXISTS public.user_gamification (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP transaction log (immutable history)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'habit_completion', 'streak_bonus', 'badge_earned', etc.
  reference_id UUID, -- optional reference to habit, badge, etc.
  reference_type TEXT, -- 'habit', 'badge', 'streak', etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge definitions (seeded with app badges)
CREATE TABLE IF NOT EXISTS public.badge_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- emoji or icon name
  category TEXT NOT NULL CHECK (category IN ('milestone', 'streak', 'technique', 'social', 'time', 'special')),
  requirement_type TEXT NOT NULL, -- 'completions_count', 'streak_days', etc.
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User earned badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON public.xp_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_category ON public.badge_definitions(category);

-- Row Level Security
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can view/update their own gamification data
CREATE POLICY "Users can view own gamification"
  ON public.user_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
  ON public.user_gamification FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification"
  ON public.user_gamification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- XP transactions - read only for users
CREATE POLICY "Users can view own transactions"
  ON public.xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Badge definitions - public read for all authenticated users
CREATE POLICY "Anyone can view badge definitions"
  ON public.badge_definitions FOR SELECT
  TO authenticated
  USING (true);

-- User badges - users can view their own
CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update gamification timestamp
CREATE OR REPLACE FUNCTION update_gamification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_gamification_timestamp
  BEFORE UPDATE ON public.user_gamification
  FOR EACH ROW
  EXECUTE FUNCTION update_gamification_timestamp();

-- Seed badge definitions
INSERT INTO public.badge_definitions (name, description, icon, category, requirement_type, requirement_value, xp_reward, rarity)
VALUES
  -- Milestone badges
  ('First Step', 'Complete your first habit', '🌱', 'milestone', 'completions_count', 1, 10, 'common'),
  ('Habit Builder', 'Complete 10 habits', '🏗️', 'milestone', 'completions_count', 10, 50, 'common'),
  ('Century Club', 'Complete 100 habits', '💯', 'milestone', 'completions_count', 100, 200, 'uncommon'),
  ('Habit Master', 'Complete 500 habits', '🎯', 'milestone', 'completions_count', 500, 500, 'rare'),
  ('Comeback Kid', 'Recover from a broken streak', '🔄', 'milestone', 'streak_recoveries', 1, 75, 'common'),

  -- Streak badges
  ('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak', 'streak_days', 7, 100, 'common'),
  ('Fortnight Fighter', 'Maintain a 14-day streak', '💪', 'streak', 'streak_days', 14, 250, 'uncommon'),
  ('Monthly Master', 'Maintain a 30-day streak', '👑', 'streak', 'streak_days', 30, 500, 'rare'),
  ('Quarter Champion', 'Maintain a 90-day streak', '🏆', 'streak', 'streak_days', 90, 1000, 'epic'),
  ('Year Legend', 'Maintain a 365-day streak', '⭐', 'streak', 'streak_days', 365, 5000, 'legendary'),

  -- Technique badges
  ('Technique Explorer', 'Try all 4 learning techniques', '🧠', 'technique', 'techniques_used', 4, 200, 'uncommon'),
  ('Active Recaller', 'Use active recall 10 times', '💡', 'technique', 'active_recall_count', 10, 100, 'common'),
  ('Spacing Expert', 'Use spaced repetition 10 times', '📅', 'technique', 'spaced_rep_count', 10, 100, 'common'),

  -- Social badges
  ('Pod Pioneer', 'Join or create your first pod', '👥', 'social', 'pods_joined', 1, 50, 'common'),
  ('Social Butterfly', 'Be in 3 different pods', '🦋', 'social', 'pods_joined', 3, 150, 'uncommon'),
  ('Pod Leader', 'Create a pod with 5+ members', '🎖️', 'social', 'pod_members_led', 5, 200, 'rare'),

  -- Time-based badges
  ('Early Bird', 'Complete habits before 8 AM 7 times', '🌅', 'time', 'early_completions', 7, 150, 'uncommon'),
  ('Night Owl', 'Complete habits after 9 PM 7 times', '🌙', 'time', 'late_completions', 7, 150, 'uncommon'),
  ('Weekend Warrior', 'Complete habits on 10 weekends', '📆', 'time', 'weekend_completions', 10, 100, 'common'),

  -- Special badges
  ('Laurel Founder', 'Join during the launch period', '🌿', 'special', 'founder', 1, 250, 'legendary')
ON CONFLICT (name) DO NOTHING;
