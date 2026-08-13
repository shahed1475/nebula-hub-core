-- B2B Growth Engine: campaigns, campaign_leads, outreach_messages, outreach_message_events
-- Named outreach_messages (not messages) because public.messages already exists as an
-- unrelated client-portal table.

CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage campaigns"
ON public.campaigns
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.campaign_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'paused', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT campaign_leads_campaign_lead_unique UNIQUE (campaign_id, lead_id)
);

CREATE INDEX idx_campaign_leads_campaign_id ON public.campaign_leads (campaign_id);
CREATE INDEX idx_campaign_leads_lead_id ON public.campaign_leads (lead_id);

CREATE TRIGGER update_campaign_leads_updated_at
BEFORE UPDATE ON public.campaign_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage campaign_leads"
ON public.campaign_leads
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.outreach_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_lead_id UUID NOT NULL REFERENCES public.campaign_leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction = 'outbound'),
  subject TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'queued', 'sent', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_messages_campaign_lead_id ON public.outreach_messages (campaign_lead_id);

CREATE TRIGGER update_outreach_messages_updated_at
BEFORE UPDATE ON public.outreach_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.outreach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage outreach_messages"
ON public.outreach_messages
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.outreach_message_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.outreach_messages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'queued','sent','delivered','opened','clicked','bounced','failed','unsubscribed'
  )),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_message_events_message_id ON public.outreach_message_events (message_id);

ALTER TABLE public.outreach_message_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage outreach_message_events"
ON public.outreach_message_events
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
