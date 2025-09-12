import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  budget_range: string | null;
  message: string;
  status: string;
  priority: string;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("id, created_at, name, email, budget_range, message, status, priority")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
      toast({
        title: "Failed to load messages",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Client Messages</h1>
        <p className="text-gray-300">View contact form submissions from your website visitors.</p>
      </div>

      <Card className="bg-midnight-light/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-purple"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No messages yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Budget</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Priority</TableHead>
                    <TableHead className="text-gray-300">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((m) => (
                    <TableRow key={m.id} className="hover:bg-white/5">
                      <TableCell className="text-gray-200">
                        {new Date(m.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-200">{m.name}</TableCell>
                      <TableCell>
                        <a href={`mailto:${m.email}`} className="text-neon-blue hover:underline">
                          {m.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-gray-200">{m.budget_range || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-white/10 text-white border border-white/20">
                          {m.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-white/10 text-white border border-white/20">
                          {m.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[400px] text-gray-200">
                        <div className="line-clamp-3 leading-relaxed">{m.message}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
