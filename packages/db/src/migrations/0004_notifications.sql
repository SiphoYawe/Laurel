-- Story 3-7: Habit Reminder Notifications
-- Push notification infrastructure tables

-- User push tokens for web and mobile
CREATE TABLE IF NOT EXISTS public.user_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('web', 'ios', 'android')),
  endpoint TEXT, -- Web Push endpoint
  p256dh TEXT, -- Web Push encryption key
  auth TEXT, -- Web Push auth secret
  device_info JSONB, -- Device metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Scheduled notifications queue
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'streak_warning', 'daily_summary', 'custom')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB, -- Additional payload data
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences per user
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  reminders_enabled BOOLEAN DEFAULT true,
  streak_warnings_enabled BOOLEAN DEFAULT true,
  daily_summary_enabled BOOLEAN DEFAULT false,
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '07:00',
  streak_warning_time TIME DEFAULT '22:00',
  reminder_offset_minutes INTEGER DEFAULT 0, -- -15, -30, 0 etc
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification history for analytics
CREATE TABLE IF NOT EXISTS public.notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES public.scheduled_notifications(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  clicked_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  action_taken TEXT -- 'complete_now', 'snooze', 'dismiss'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON public.user_push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON public.user_push_tokens(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_pending ON public.scheduled_notifications(scheduled_for, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_user ON public.scheduled_notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notification_history_user ON public.notification_history(user_id, sent_at);

-- Row Level Security
ALTER TABLE public.user_push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can manage their push tokens"
  ON public.user_push_tokens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their scheduled notifications"
  ON public.scheduled_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their notification preferences"
  ON public.notification_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their notification history"
  ON public.notification_history FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_notification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_push_tokens_timestamp
  BEFORE UPDATE ON public.user_push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_timestamp();

CREATE TRIGGER update_notification_preferences_timestamp
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_timestamp();
