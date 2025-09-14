import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FolderOpen, 
  MessageSquare, 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface DashboardStats {
  totalClients: number;
  activeProjects: number;
  pendingTestimonials: number;
  totalServices: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeProjects: 0,
    pendingTestimonials: 0,
    totalServices: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load various stats in parallel
      const [
        clientsData,
        projectsData,
        testimonialsData,
        servicesData,
        activityData
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('feedback').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('services').select('id', { count: 'exact' }).eq('active', true),
        supabase.from('feedback').select('testimonial, created_at, status').is('deleted_at', null).order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        totalClients: clientsData.count || 0,
        activeProjects: projectsData.count || 0,
        pendingTestimonials: testimonialsData.count || 0,
        totalServices: servicesData.count || 0,
        recentActivity: activityData.data || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/20"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: FolderOpen,
      color: "text-neon-blue",
      bgColor: "bg-neon-blue/10",
      borderColor: "border-neon-blue/20"
    },
    {
      title: "Pending Reviews",
      value: stats.pendingTestimonials,
      icon: MessageSquare,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20"
    },
    {
      title: "Active Services",
      value: stats.totalServices,
      icon: BarChart3,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">Overview of your PopupGenix business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`${stat.bgColor} ${stat.borderColor} border`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-neon-purple" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-midnight/30 rounded-lg">
                    <div className={`mt-1 ${
                      activity.status === 'approved' ? 'text-green-400' :
                      activity.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {activity.status === 'approved' ? <CheckCircle className="h-4 w-4" /> :
                       activity.status === 'pending' ? <Clock className="h-4 w-4" /> :
                       <AlertCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        New feedback: "{activity.testimonial.substring(0, 50)}..."
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-neon-blue" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <a 
                href="/admin/homepage" 
                className="p-4 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/20 rounded-lg hover:border-neon-purple/40 transition-all"
              >
                <h3 className="text-white font-medium">Update Homepage</h3>
                <p className="text-gray-300 text-sm mt-1">Modify hero content and stats</p>
              </a>
              
              <a 
                href="/admin/testimonials" 
                className="p-4 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 rounded-lg hover:border-yellow-400/40 transition-all"
              >
                <h3 className="text-white font-medium">Review Testimonials</h3>
                <p className="text-gray-300 text-sm mt-1">
                  {stats.pendingTestimonials} testimonials awaiting approval
                </p>
              </a>
              
              <a 
                href="/admin/services" 
                className="p-4 bg-gradient-to-r from-green-400/10 to-blue-400/10 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all"
              >
                <h3 className="text-white font-medium">Manage Services</h3>
                <p className="text-gray-300 text-sm mt-1">Add or edit service offerings</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 border-neon-purple/20">
        <CardHeader>
          <CardTitle className="text-white">Business Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-neon-purple mb-2">
                {stats.activeProjects > 0 ? Math.round((stats.activeProjects / stats.totalClients) * 100) : 0}%
              </div>
              <div className="text-gray-300 text-sm">Project to Client Ratio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-blue mb-2">
                {stats.pendingTestimonials}
              </div>
              <div className="text-gray-300 text-sm">Testimonials to Review</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {stats.totalServices}
              </div>
              <div className="text-gray-300 text-sm">Active Services</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}