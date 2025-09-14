import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Send, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: string;
  created_at: string;
  projects: { id: string; title: string }[];
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // First get clients from profiles table
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .eq('is_admin', false);

      if (profiles) {
        // Get projects for each client
        const clientsWithProjects = await Promise.all(
          profiles.map(async (profile) => {
            const { data: projects } = await supabase
              .from('projects')
              .select('id, title')
              .eq('client_user_id', profile.user_id);

            return {
              id: profile.user_id,
              name: profile.full_name || profile.email,
              email: profile.email,
              status: 'active',
              created_at: new Date().toISOString(),
              projects: projects || []
            };
          })
        );

        setClients(clientsWithProjects);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendUpdate = async () => {
    if (!selectedClient || !updateTitle.trim() || !updateContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedClient.projects.length === 0) {
      toast({
        title: "Error",
        description: "Client has no projects to send updates to",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Send update to the client's first project (you could allow selecting which project)
      const { error } = await supabase
        .from('client_updates')
        .insert({
          project_id: selectedClient.projects[0].id,
          title: updateTitle,
          content: updateContent,
          admin_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Update sent to client successfully!",
      });

      setUpdateTitle("");
      setUpdateContent("");
      setIsDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error sending update:', error);
      toast({
        title: "Error",
        description: "Failed to send update",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Client Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-neon-purple mb-2">{clients.length}</div>
            <div className="text-gray-300">Total Clients</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <div className="text-gray-300">Active Clients</div>
          </CardContent>
        </Card>
        <Card className="bg-neon-blue/10 border-neon-blue/20">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-neon-blue mb-2">
              {clients.reduce((total, client) => total + client.projects.length, 0)}
            </div>
            <div className="text-gray-300">Total Projects</div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {clients.length > 0 ? (
          clients.map((client) => (
            <Card key={client.id} className="bg-midnight-light/50 border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold text-lg">{client.name}</h3>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                        {client.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Email: {client.email}</p>
                      <p>Projects: {client.projects.length}</p>
                    </div>
                  </div>
                  <Dialog open={isDialogOpen && selectedClient?.id === client.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                      setSelectedClient(null);
                      setUpdateTitle("");
                      setUpdateContent("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                        className="bg-neon-purple hover:bg-neon-purple/80"
                        disabled={client.projects.length === 0}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-midnight-light border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Send Update to {client.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="text-gray-300">Update Title</Label>
                          <Input
                            id="title"
                            value={updateTitle}
                            onChange={(e) => setUpdateTitle(e.target.value)}
                            placeholder="Project Update: New Features Released"
                            className="bg-midnight/50 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="content" className="text-gray-300">Update Content</Label>
                          <Textarea
                            id="content"
                            value={updateContent}
                            onChange={(e) => setUpdateContent(e.target.value)}
                            placeholder="Tell your client about project progress, new features, next steps..."
                            className="bg-midnight/50 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                          />
                        </div>
                        <Button
                          onClick={sendUpdate}
                          disabled={submitting}
                          className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple/80 hover:to-neon-blue/80"
                        >
                          {submitting ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Sending...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Send className="h-4 w-4" />
                              Send Update
                            </div>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Projects:</h4>
                  {client.projects.length > 0 ? (
                    <div className="space-y-2">
                      {client.projects.map((project) => (
                        <div 
                          key={project.id}
                          className="bg-midnight/30 p-3 rounded-lg"
                        >
                          <p className="text-gray-300">{project.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No projects assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-midnight-light/50 border-gray-700">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Clients Found</h3>
              <p className="text-gray-300">
                Clients will appear here once they register and are assigned projects.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}