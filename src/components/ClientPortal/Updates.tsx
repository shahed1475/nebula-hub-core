import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientUpdate {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  project_id: string;
}

export default function Updates() {
  const [updates, setUpdates] = useState<ClientUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getUpdates();
  }, []);

  const getUpdates = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user's projects first
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('client_user_id', user.id);

        if (projects && projects.length > 0) {
          const projectIds = projects.map(p => p.id);
          const { data: updatesData } = await supabase
            .from('client_updates')
            .select('*')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false });

          setUpdates(updatesData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      toast({
        title: "Error",
        description: "Failed to load updates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (updateId: string) => {
    try {
      const { error } = await supabase
        .from('client_updates')
        .update({ is_read: true })
        .eq('id', updateId);

      if (error) throw error;

      setUpdates(prev => 
        prev.map(update => 
          update.id === updateId ? { ...update, is_read: true } : update
        )
      );
    } catch (error) {
      console.error('Error marking update as read:', error);
    }
  };

  const unreadCount = updates.filter(update => !update.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-dark via-midnight to-midnight-light p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            Project Updates
          </h1>
          <p className="text-gray-300 text-lg">
            Stay informed about your project progress
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-neon-purple text-white">
                {unreadCount} new
              </Badge>
            )}
          </p>
        </div>

        {/* Updates List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
            </div>
          ) : updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update) => (
                <Card 
                  key={update.id} 
                  className={`transition-all cursor-pointer ${
                    update.is_read 
                      ? 'bg-midnight-light/30 border-gray-700' 
                      : 'bg-neon-purple/10 border-neon-purple/30 shadow-lg'
                  }`}
                  onClick={() => !update.is_read && markAsRead(update.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-semibold text-lg">{update.title}</h3>
                          {!update.is_read && (
                            <Badge className="bg-neon-purple text-white text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(update.created_at).toLocaleDateString()}</span>
                          {update.is_read && (
                            <>
                              <span>•</span>
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-green-400">Read</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {update.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-midnight-light/30 border-gray-700">
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Updates Yet</h3>
                <p className="text-gray-300">
                  You'll receive project updates and notifications here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}