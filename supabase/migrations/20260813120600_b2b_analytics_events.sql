-- B2B Growth Engine: analytics_events (generic append-only event log)

CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  subject_type TEXT,
  subject_id UUID,
  strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_event_type ON public.analytics_events (event_type);
CREATE INDEX idx_analytics_events_occurred_at ON public.analytics_events (occurred_at DESC);
CREATE INDEX idx_analytics_events_subject ON public.analytics_events (subject_type, subject_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage analytics_events"
ON public.analytics_events
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
