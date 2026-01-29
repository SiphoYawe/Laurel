-- Story 5-1: Create Pods Database Schema
-- Accountability pods for study groups

-- Pods table (study groups)
CREATE TABLE IF NOT EXISTS public.pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  max_members INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pod members
CREATE TABLE IF NOT EXISTS public.pod_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id UUID NOT NULL REFERENCES public.pods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pod_id, user_id)
);

-- Pod habits (habits shared with the pod)
CREATE TABLE IF NOT EXISTS public.pod_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id UUID NOT NULL REFERENCES public.pods(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pod_id, habit_id)
);

-- Pod activity feed events
CREATE TABLE IF NOT EXISTS public.pod_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id UUID NOT NULL REFERENCES public.pods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'habit_completed',
    'streak_milestone',
    'badge_earned',
    'member_joined',
    'member_left',
    'habit_shared'
  )),
  reference_id UUID, -- habit_id, badge_id, etc.
  reference_type TEXT, -- 'habit', 'badge', etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pods_invite_code ON public.pods(invite_code);
CREATE INDEX IF NOT EXISTS idx_pods_created_by ON public.pods(created_by);
CREATE INDEX IF NOT EXISTS idx_pod_members_pod_id ON public.pod_members(pod_id);
CREATE INDEX IF NOT EXISTS idx_pod_members_user_id ON public.pod_members(user_id);
CREATE INDEX IF NOT EXISTS idx_pod_habits_pod_id ON public.pod_habits(pod_id);
CREATE INDEX IF NOT EXISTS idx_pod_habits_habit_id ON public.pod_habits(habit_id);
CREATE INDEX IF NOT EXISTS idx_pod_activities_pod_id ON public.pod_activities(pod_id);
CREATE INDEX IF NOT EXISTS idx_pod_activities_created_at ON public.pod_activities(created_at DESC);

-- Row Level Security
ALTER TABLE public.pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pods
-- Users can view pods they are members of
CREATE POLICY "Members can view their pods"
  ON public.pods FOR SELECT
  USING (
    id IN (
      SELECT pod_id FROM public.pod_members WHERE user_id = auth.uid()
    )
    OR created_by = auth.uid()
  );

-- Only pod creators can update/delete their pods
CREATE POLICY "Owners can update their pods"
  ON public.pods FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Owners can delete their pods"
  ON public.pods FOR DELETE
  USING (created_by = auth.uid());

-- Any authenticated user can create a pod
CREATE POLICY "Authenticated users can create pods"
  ON public.pods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for pod_members
-- Members can view other members of their pods
CREATE POLICY "Members can view pod members"
  ON public.pod_members FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM public.pod_members WHERE user_id = auth.uid()
    )
  );

-- Users can join pods (insert themselves)
CREATE POLICY "Users can join pods"
  ON public.pod_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can leave pods (delete themselves) or owners can remove members
CREATE POLICY "Users can leave or owners can remove"
  ON public.pod_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR pod_id IN (
      SELECT id FROM public.pods WHERE created_by = auth.uid()
    )
  );

-- RLS Policies for pod_habits
-- Members can view habits shared in their pods
CREATE POLICY "Members can view pod habits"
  ON public.pod_habits FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM public.pod_members WHERE user_id = auth.uid()
    )
  );

-- Members can share their own habits
CREATE POLICY "Members can share habits"
  ON public.pod_habits FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = shared_by
    AND pod_id IN (
      SELECT pod_id FROM public.pod_members WHERE user_id = auth.uid()
    )
  );

-- Users can unshare their own habits
CREATE POLICY "Users can unshare their habits"
  ON public.pod_habits FOR DELETE
  USING (shared_by = auth.uid());

-- RLS Policies for pod_activities
-- Members can view activities in their pods
CREATE POLICY "Members can view pod activities"
  ON public.pod_activities FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM public.pod_members WHERE user_id = auth.uid()
    )
  );

-- System inserts activities (via service role or trigger)
CREATE POLICY "Service role can insert activities"
  ON public.pod_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    pod_id IN (
      SELECT pod_id FROM public.pod_members WHERE user_id = auth.uid()
    )
  );

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update pod timestamp
CREATE OR REPLACE FUNCTION update_pod_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_pod_timestamp
  BEFORE UPDATE ON public.pods
  FOR EACH ROW
  EXECUTE FUNCTION update_pod_timestamp();

-- Function to auto-add creator as owner member
CREATE OR REPLACE FUNCTION auto_add_pod_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pod_members (pod_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to add creator as owner
CREATE TRIGGER add_pod_owner_on_create
  AFTER INSERT ON public.pods
  FOR EACH ROW
  EXECUTE FUNCTION auto_add_pod_owner();

-- Function to log pod activity on habit completion
CREATE OR REPLACE FUNCTION log_habit_completion_to_pods()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert activity for each pod the habit is shared with
  INSERT INTO public.pod_activities (pod_id, user_id, activity_type, reference_id, reference_type, metadata)
  SELECT
    ph.pod_id,
    NEW.user_id,
    'habit_completed',
    NEW.habit_id,
    'habit',
    jsonb_build_object(
      'completion_id', NEW.id,
      'completed_at', NEW.completed_at
    )
  FROM public.pod_habits ph
  WHERE ph.habit_id = NEW.habit_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log habit completions to pods
CREATE TRIGGER log_completion_to_pods
  AFTER INSERT ON public.habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION log_habit_completion_to_pods();
