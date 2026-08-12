-- B2B Growth Engine: strategies + strategy_versions
-- strategy_versions references strategies; strategies.current_version_id references
-- strategy_versions and is added as a constraint after strategy_versions exists to
-- avoid a circular table creation.

CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  current_version_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER update_strategies_updated_at
BEFORE UPDATE ON public.strategies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage strategies"
ON public.strategies
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.strategy_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  performance_snapshot JSONB,
  notes TEXT,
  created_by TEXT NOT NULL DEFAULT 'manual' CHECK (created_by IN ('system', 'agent', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT strategy_versions_strategy_version_unique UNIQUE (strategy_id, version_number)
);

CREATE INDEX idx_strategy_versions_strategy_id ON public.strategy_versions (strategy_id);

ALTER TABLE public.strategies
  ADD CONSTRAINT strategies_current_version_id_fkey
  FOREIGN KEY (current_version_id) REFERENCES public.strategy_versions(id) ON DELETE SET NULL;

ALTER TABLE public.strategy_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage strategy_versions"
ON public.strategy_versions
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
