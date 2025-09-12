import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, RotateCcw, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  projects_count: number;
  clients_count: number;
  years_experience: number;
  cta_primary_text: string;
  cta_secondary_text: string;
  about_description: string;
}

export default function HomepageManager() {
  const [content, setContent] = useState<HomepageContent>({
    id: '',
    hero_title: "Building Future-Ready AI & Software Solutions 🚀",
    hero_subtitle: "We create intelligent, scalable, and future-proof solutions for businesses worldwide",
    projects_count: 50,
    clients_count: 25,
    years_experience: 5,
    cta_primary_text: "Start Your Project",
    cta_secondary_text: "View Portfolio",
    about_description: "PopupGenix is a forward-thinking AI & software company creating intelligent, scalable, and future-proof solutions for businesses worldwide."
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHomepageContent();
  }, []);

  const loadHomepageContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const { error } = content.id 
        ? await supabase
            .from('homepage_content')
            .update(content)
            .eq('id', content.id)
        : await supabase
            .from('homepage_content')
            .insert([content]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Homepage content updated successfully!",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setContent({
      id: content.id,
      hero_title: "Building Future-Ready AI & Software Solutions 🚀",
      hero_subtitle: "We create intelligent, scalable, and future-proof solutions for businesses worldwide",
      projects_count: 50,
      clients_count: 25,
      years_experience: 5,
      cta_primary_text: "Start Your Project",
      cta_secondary_text: "View Portfolio",
      about_description: "PopupGenix is a forward-thinking AI & software company creating intelligent, scalable, and future-proof solutions for businesses worldwide."
    });
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
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-neon-purple" />
          <h1 className="text-3xl font-bold text-white">Homepage Manager</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={saveContent}
            disabled={saving}
            className="bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple/80 hover:to-neon-blue/80"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title" className="text-gray-300">Hero Title</Label>
              <Input
                id="hero_title"
                value={content.hero_title}
                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                className="bg-midnight/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle" className="text-gray-300">Hero Subtitle</Label>
              <Textarea
                id="hero_subtitle"
                value={content.hero_subtitle}
                onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                className="bg-midnight/50 border-gray-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Stats Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="projects_count" className="text-gray-300">Projects Delivered</Label>
              <Input
                id="projects_count"
                type="number"
                value={content.projects_count}
                onChange={(e) => setContent({ ...content, projects_count: parseInt(e.target.value) || 0 })}
                className="bg-midnight/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="clients_count" className="text-gray-300">Global Clients</Label>
              <Input
                id="clients_count"
                type="number"
                value={content.clients_count}
                onChange={(e) => setContent({ ...content, clients_count: parseInt(e.target.value) || 0 })}
                className="bg-midnight/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="years_experience" className="text-gray-300">Years in Business</Label>
              <Input
                id="years_experience"
                type="number"
                value={content.years_experience}
                onChange={(e) => setContent({ ...content, years_experience: parseInt(e.target.value) || 0 })}
                className="bg-midnight/50 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Call-to-Action Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cta_primary_text" className="text-gray-300">Primary CTA Text</Label>
              <Input
                id="cta_primary_text"
                value={content.cta_primary_text}
                onChange={(e) => setContent({ ...content, cta_primary_text: e.target.value })}
                className="bg-midnight/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="cta_secondary_text" className="text-gray-300">Secondary CTA Text</Label>
              <Input
                id="cta_secondary_text"
                value={content.cta_secondary_text}
                onChange={(e) => setContent({ ...content, cta_secondary_text: e.target.value })}
                className="bg-midnight/50 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Description */}
        <Card className="bg-midnight-light/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">About Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="about_description" className="text-gray-300">Company Description</Label>
              <Textarea
                id="about_description"
                value={content.about_description}
                onChange={(e) => setContent({ ...content, about_description: e.target.value })}
                className="bg-midnight/50 border-gray-600 text-white"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 border-neon-purple/20">
        <CardHeader>
          <CardTitle className="text-white">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">{content.hero_title}</h2>
            <p className="text-gray-300">{content.hero_subtitle}</p>
          </div>
          <div className="flex justify-center gap-4">
            <span className="px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg border border-neon-purple/30">
              {content.cta_primary_text}
            </span>
            <span className="px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg border border-neon-blue/30">
              {content.cta_secondary_text}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-neon-purple">{content.projects_count}+</div>
              <div className="text-gray-300 text-sm">Projects Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-blue">{content.clients_count}+</div>
              <div className="text-gray-300 text-sm">Global Clients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{content.years_experience}+</div>
              <div className="text-gray-300 text-sm">Years in Business</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}