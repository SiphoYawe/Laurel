-- Migration: Create user_preferences table
-- One-to-one relationship with profiles

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_enabled BOOLEAN DEFAULT TRUE,
  email_digest_frequency TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'never'
  theme TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
  coaching_style TEXT DEFAULT 'balanced', -- 'encouraging', 'challenging', 'balanced'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraints for valid enum values
ALTER TABLE public.user_preferences
  ADD CONSTRAINT chk_email_digest_frequency
  CHECK (email_digest_frequency IN ('daily', 'weekly', 'never'));

ALTER TABLE public.user_preferences
  ADD CONSTRAINT chk_theme
  CHECK (theme IN ('light', 'dark', 'system'));

ALTER TABLE public.user_preferences
  ADD CONSTRAINT chk_coaching_style
  CHECK (coaching_style IN ('encouraging', 'challenging', 'balanced'));

-- Auto-update updated_at on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
