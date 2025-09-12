import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  project_id: string;
  client_name?: string;
  project_name?: string;
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          projects:project_id (
            name,
            profiles:client_id (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        client_name: item.projects?.profiles?.full_name || 'Unknown Client',
        project_name: item.projects?.name || 'Unknown Project'
      })) || [];

      setTestimonials(formattedData);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      await loadTestimonials();
      toast({
        title: "Success",
        description: `Testimonial ${status} successfully!`,
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const filteredTestimonials = testimonials.filter(testimonial => 
    filter === 'all' || testimonial.status === filter
  );

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
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
        <h1 className="text-3xl font-bold text-white">Testimonial Manager</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
            <div className="text-gray-300">Total Reviews</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.pending}</div>
            <div className="text-gray-300">Pending Review</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.approved}</div>
            <div className="text-gray-300">Approved</div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-red-400 mb-2">{stats.rejected}</div>
            <div className="text-gray-300">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status as any)}
            className={`capitalize ${
              filter === status 
                ? 'bg-neon-purple text-white' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-midnight-light/50 border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold">{testimonial.client_name}</h3>
                      <Badge className={getStatusColor(testimonial.status)}>
                        {getStatusIcon(testimonial.status)}
                        <span className="ml-1 capitalize">{testimonial.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Project: {testimonial.project_name}</span>
                      <span>•</span>
                      <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
                    </div>
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">{testimonial.content}</p>
                
                {testimonial.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {testimonial.status === 'approved' && (
                  <div className="text-sm text-green-400 bg-green-500/10 p-2 rounded">
                    ✓ This testimonial is featured on the homepage
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-midnight-light/50 border-gray-700">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Testimonials Found</h3>
              <p className="text-gray-300">
                {filter === 'all' 
                  ? 'No testimonials have been submitted yet.' 
                  : `No ${filter} testimonials found.`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}