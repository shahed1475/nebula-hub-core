-- B2B Growth Engine: agent_tasks (job queue), agent_runs (execution history)

CREATE TABLE public.agent_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL CHECK (task_type IN (
    'strategy','lead_finder','research','qualification','outreach',
    'reply','booking','notification','analytics'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','claimed','in_progress','succeeded','failed','cancelled'
  )),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  subject_type TEXT,
  subject_id UUID,
  priority INTEGER NOT NULL DEFAULT 0,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed_at TIMESTAMP WITH TIME ZONE,
  claimed_by TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_tasks_status ON public.agent_tasks (status);
CREATE INDEX idx_agent_tasks_scheduled_for ON public.agent_tasks (scheduled_for);
CREATE INDEX idx_agent_tasks_subject ON public.agent_tasks (subject_type, subject_id);

CREATE TRIGGER update_agent_tasks_updated_at
BEFORE UPDATE ON public.agent_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage agent_tasks"
ON public.agent_tasks
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.agent_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.agent_tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed')),
  provider TEXT CHECK (provider IS NULL OR provider IN ('mock', 'claude')),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  output JSONB,
  error TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_runs_task_id ON public.agent_runs (task_id);

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage agent_runs"
ON public.agent_runs
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
