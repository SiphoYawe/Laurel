-- Story 6-1: Create SRS Database Schema
-- Spaced Repetition System for flashcard learning

-- SRS Decks (flashcard collections)
CREATE TABLE IF NOT EXISTS public.srs_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  color TEXT DEFAULT '#4CAF50',
  is_active BOOLEAN DEFAULT true,
  cards_count INTEGER DEFAULT 0,
  new_cards_per_day INTEGER DEFAULT 20,
  review_cards_per_day INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SRS Cards (flashcards)
CREATE TABLE IF NOT EXISTS public.srs_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.srs_decks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  hint TEXT,
  tags TEXT[] DEFAULT '{}',
  -- SM-2 algorithm fields
  ease_factor DECIMAL(4,2) DEFAULT 2.50,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  -- Card states: new, learning, review, relearning
  card_state TEXT DEFAULT 'new' CHECK (card_state IN ('new', 'learning', 'review', 'relearning')),
  -- Learning step (for new/learning cards)
  learning_step INTEGER DEFAULT 0,
  is_suspended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SRS Reviews (review history)
CREATE TABLE IF NOT EXISTS public.srs_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.srs_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deck_id UUID NOT NULL REFERENCES public.srs_decks(id) ON DELETE CASCADE,
  -- Review metrics
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  -- 0: complete blackout, 1: incorrect but remembered, 2: incorrect but easy to recall
  -- 3: correct with serious difficulty, 4: correct with hesitation, 5: perfect response
  time_taken_ms INTEGER, -- milliseconds to answer
  -- State before review
  previous_ease DECIMAL(4,2),
  previous_interval INTEGER,
  previous_state TEXT,
  -- State after review
  new_ease DECIMAL(4,2),
  new_interval INTEGER,
  new_state TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- SRS Daily Stats (aggregate daily learning stats)
CREATE TABLE IF NOT EXISTS public.srs_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  cards_reviewed INTEGER DEFAULT 0,
  cards_new INTEGER DEFAULT 0,
  cards_relearned INTEGER DEFAULT 0,
  time_spent_ms BIGINT DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  streak_continued BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_srs_decks_user ON public.srs_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_srs_decks_active ON public.srs_decks(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_srs_cards_deck ON public.srs_cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_srs_cards_user ON public.srs_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_srs_cards_due ON public.srs_cards(user_id, next_review_at) WHERE NOT is_suspended;
CREATE INDEX IF NOT EXISTS idx_srs_cards_state ON public.srs_cards(card_state);
CREATE INDEX IF NOT EXISTS idx_srs_reviews_card ON public.srs_reviews(card_id);
CREATE INDEX IF NOT EXISTS idx_srs_reviews_user ON public.srs_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_srs_reviews_date ON public.srs_reviews(reviewed_at);
CREATE INDEX IF NOT EXISTS idx_srs_daily_stats_user_date ON public.srs_daily_stats(user_id, date DESC);

-- Row Level Security
ALTER TABLE public.srs_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for srs_decks
CREATE POLICY "Users can view their own decks"
  ON public.srs_decks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own decks"
  ON public.srs_decks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks"
  ON public.srs_decks FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own decks"
  ON public.srs_decks FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for srs_cards
CREATE POLICY "Users can view their own cards"
  ON public.srs_cards FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own cards"
  ON public.srs_cards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON public.srs_cards FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own cards"
  ON public.srs_cards FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for srs_reviews
CREATE POLICY "Users can view their own reviews"
  ON public.srs_reviews FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own reviews"
  ON public.srs_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for srs_daily_stats
CREATE POLICY "Users can view their own daily stats"
  ON public.srs_daily_stats FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own daily stats"
  ON public.srs_daily_stats FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Triggers

-- Update deck updated_at timestamp
CREATE OR REPLACE FUNCTION update_srs_deck_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_srs_deck_timestamp
  BEFORE UPDATE ON public.srs_decks
  FOR EACH ROW
  EXECUTE FUNCTION update_srs_deck_timestamp();

-- Update card updated_at timestamp
CREATE OR REPLACE FUNCTION update_srs_card_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_srs_card_timestamp
  BEFORE UPDATE ON public.srs_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_srs_card_timestamp();

-- Update deck cards_count on card insert/delete
CREATE OR REPLACE FUNCTION update_deck_cards_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.srs_decks SET cards_count = cards_count + 1 WHERE id = NEW.deck_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.srs_decks SET cards_count = cards_count - 1 WHERE id = OLD.deck_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deck_cards_count_insert
  AFTER INSERT ON public.srs_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_deck_cards_count();

CREATE TRIGGER update_deck_cards_count_delete
  AFTER DELETE ON public.srs_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_deck_cards_count();

-- Function to get due cards count for a user
CREATE OR REPLACE FUNCTION get_due_cards_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*) INTO count
  FROM public.srs_cards
  WHERE user_id = p_user_id
    AND NOT is_suspended
    AND next_review_at <= NOW();
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Function to update daily stats
CREATE OR REPLACE FUNCTION update_srs_daily_stats(
  p_user_id UUID,
  p_cards_reviewed INTEGER DEFAULT 0,
  p_cards_new INTEGER DEFAULT 0,
  p_cards_relearned INTEGER DEFAULT 0,
  p_time_spent_ms BIGINT DEFAULT 0,
  p_correct_answers INTEGER DEFAULT 0,
  p_wrong_answers INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.srs_daily_stats (
    user_id, date, cards_reviewed, cards_new, cards_relearned,
    time_spent_ms, correct_answers, wrong_answers
  )
  VALUES (
    p_user_id, CURRENT_DATE, p_cards_reviewed, p_cards_new, p_cards_relearned,
    p_time_spent_ms, p_correct_answers, p_wrong_answers
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    cards_reviewed = srs_daily_stats.cards_reviewed + p_cards_reviewed,
    cards_new = srs_daily_stats.cards_new + p_cards_new,
    cards_relearned = srs_daily_stats.cards_relearned + p_cards_relearned,
    time_spent_ms = srs_daily_stats.time_spent_ms + p_time_spent_ms,
    correct_answers = srs_daily_stats.correct_answers + p_correct_answers,
    wrong_answers = srs_daily_stats.wrong_answers + p_wrong_answers;
END;
$$ LANGUAGE plpgsql;
