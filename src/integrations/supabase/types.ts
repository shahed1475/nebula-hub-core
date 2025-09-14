export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_updates: {
        Row: {
          admin_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          preferred_contact: string | null
          priority: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          preferred_contact?: string | null
          priority?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          preferred_contact?: string | null
          priority?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          file_url: string
          id: string
          name: string
          project_id: string | null
          type: string
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          name: string
          project_id?: string | null
          type?: string
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          name?: string
          project_id?: string | null
          type?: string
          updated_at?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          client_company: string | null
          client_email: string
          client_id: string | null
          client_name: string
          created_at: string
          deleted_at: string | null
          featured: boolean
          id: string
          project_id: string | null
          rating: number
          status: string
          testimonial: string
          updated_at: string
        }
        Insert: {
          client_company?: string | null
          client_email: string
          client_id?: string | null
          client_name: string
          created_at?: string
          deleted_at?: string | null
          featured?: boolean
          id?: string
          project_id?: string | null
          rating: number
          status?: string
          testimonial: string
          updated_at?: string
        }
        Update: {
          client_company?: string | null
          client_email?: string
          client_id?: string | null
          client_name?: string
          created_at?: string
          deleted_at?: string | null
          featured?: boolean
          id?: string
          project_id?: string | null
          rating?: number
          status?: string
          testimonial?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_content: {
        Row: {
          about_description: string
          about_title: string
          clients_count: number
          created_at: string
          hero_cta_primary: string
          hero_cta_secondary: string
          hero_subtitle: string
          hero_title: string
          id: string
          projects_count: number
          satisfaction_rate: number
          team_size: number
          updated_at: string
        }
        Insert: {
          about_description?: string
          about_title?: string
          clients_count?: number
          created_at?: string
          hero_cta_primary?: string
          hero_cta_secondary?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          projects_count?: number
          satisfaction_rate?: number
          team_size?: number
          updated_at?: string
        }
        Update: {
          about_description?: string
          about_title?: string
          clients_count?: number
          created_at?: string
          hero_cta_primary?: string
          hero_cta_secondary?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          projects_count?: number
          satisfaction_rate?: number
          team_size?: number
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          active: boolean
          category: string
          client_name: string | null
          client_user_id: string | null
          completion_percentage: number
          created_at: string
          description: string
          eta_date: string | null
          featured: boolean
          id: string
          image_url: string | null
          next_milestone: string | null
          project_url: string | null
          status: string
          technologies: string[]
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          client_name?: string | null
          client_user_id?: string | null
          completion_percentage?: number
          created_at?: string
          description: string
          eta_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          next_milestone?: string | null
          project_url?: string | null
          status?: string
          technologies?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          client_name?: string | null
          client_user_id?: string | null
          completion_percentage?: number
          created_at?: string
          description?: string
          eta_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          next_milestone?: string | null
          project_url?: string | null
          status?: string
          technologies?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          additional_requirements: string | null
          budget_range: string
          company: string | null
          created_at: string
          email: string
          estimated_cost: number | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          project_description: string
          project_type: string
          status: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          additional_requirements?: string | null
          budget_range: string
          company?: string | null
          created_at?: string
          email: string
          estimated_cost?: number | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          project_description: string
          project_type: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          additional_requirements?: string | null
          budget_range?: string
          company?: string | null
          created_at?: string
          email?: string
          estimated_cost?: number | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          project_description?: string
          project_type?: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string
          features: string[]
          icon: string
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          features?: string[]
          icon?: string
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          features?: string[]
          icon?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_testimonials: {
        Args: Record<PropertyKey, never>
        Returns: {
          client_company: string
          client_name: string
          created_at: string
          featured: boolean
          id: string
          rating: number
          testimonial: string
        }[]
      }
      has_any_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      promote_to_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
