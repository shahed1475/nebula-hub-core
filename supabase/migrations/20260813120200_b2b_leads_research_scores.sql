-- B2B Growth Engine: leads, research, lead_scores

CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  source_id UUID REFERENCES public.lead_sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new','researching','qualified','disqualified','approved_for_outreach',
    'contacted','replied','meeting_booked','proposal','won','lost'
  )),
  current_score NUMERIC,
  current_strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  disqualified_reason TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_company_id ON public.leads (company_id);
CREATE INDEX idx_leads_contact_id ON public.leads (contact_id);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage leads"
ON public.leads
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.research (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('company', 'contact')),
  subject_id UUID NOT NULL,
  summary TEXT,
  findings JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence NUMERIC CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  source TEXT,
  created_by TEXT NOT NULL DEFAULT 'manual' CHECK (created_by IN ('agent', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_research_subject ON public.research (subject_type, subject_id);

ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage research"
ON public.research
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.lead_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  band TEXT,
  reasoning TEXT,
  strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  scored_by TEXT NOT NULL DEFAULT 'manual' CHECK (scored_by IN ('agent', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_scores_lead_id ON public.lead_scores (lead_id);

ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lead_scores"
ON public.lead_scores
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
