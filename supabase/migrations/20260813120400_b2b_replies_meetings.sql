-- B2B Growth Engine: replies, meetings

CREATE TABLE public.replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  in_reply_to_message_id UUID REFERENCES public.outreach_messages(id) ON DELETE SET NULL,
  raw_content TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  intent TEXT,
  sentiment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_replies_lead_id ON public.replies (lead_id);
CREATE INDEX idx_replies_in_reply_to_message_id ON public.replies (in_reply_to_message_id);

ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage replies"
ON public.replies
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'confirmed', 'completed', 'no_show', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  meeting_link TEXT,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'booking_agent')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_meetings_lead_id ON public.meetings (lead_id);

CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage meetings"
ON public.meetings
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
