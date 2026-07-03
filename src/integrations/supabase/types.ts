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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          duration_min: number | null
          id: string
          instructor_id: string | null
          is_free: boolean
          level: string | null
          order_index: number
          price_cents: number
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          title: string
          trail_id: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean
          level?: string | null
          order_index?: number
          price_cents?: number
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title: string
          trail_id: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean
          level?: string | null
          order_index?: number
          price_cents?: number
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title?: string
          trail_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          attachments: Json
          content_md: string | null
          content_type: Database["public"]["Enums"]["lesson_content_type"]
          created_at: string
          duration_sec: number | null
          id: string
          is_preview: boolean
          module_id: string
          order_index: number
          slug: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          attachments?: Json
          content_md?: string | null
          content_type?: Database["public"]["Enums"]["lesson_content_type"]
          created_at?: string
          duration_sec?: number | null
          id?: string
          is_preview?: boolean
          module_id: string
          order_index?: number
          slug: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          attachments?: Json
          content_md?: string | null
          content_type?: Database["public"]["Enums"]["lesson_content_type"]
          created_at?: string
          duration_sec?: number | null
          id?: string
          is_preview?: boolean
          module_id?: string
          order_index?: number
          slug?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          display_name: string | null
          id: string
          is_public: boolean
          public_slug: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_public?: boolean
          public_slug?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_public?: boolean
          public_slug?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sheet_rows: {
        Row: {
          conflict_payload: Json | null
          conflict_status: string | null
          created_at: string
          data: Json
          error_message: string | null
          id: string
          last_synced_at: string | null
          sheet_name: string
          sheet_row_id: string
          sheet_row_number: number | null
          source: string
          sync_status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          conflict_payload?: Json | null
          conflict_status?: string | null
          created_at?: string
          data?: Json
          error_message?: string | null
          id?: string
          last_synced_at?: string | null
          sheet_name: string
          sheet_row_id: string
          sheet_row_number?: number | null
          source?: string
          sync_status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          conflict_payload?: Json | null
          conflict_status?: string | null
          created_at?: string
          data?: Json
          error_message?: string | null
          id?: string
          last_synced_at?: string | null
          sheet_name?: string
          sheet_row_id?: string
          sheet_row_number?: number | null
          source?: string
          sync_status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      sync_conflicts: {
        Row: {
          app_updated_at: string | null
          app_version: Json
          created_at: string
          id: string
          resolution: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          sheet_row_id: string
          sheet_updated_at: string | null
          sheet_version: Json
        }
        Insert: {
          app_updated_at?: string | null
          app_version: Json
          created_at?: string
          id?: string
          resolution?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          sheet_row_id: string
          sheet_updated_at?: string | null
          sheet_version: Json
        }
        Update: {
          app_updated_at?: string | null
          app_version?: Json
          created_at?: string
          id?: string
          resolution?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          sheet_row_id?: string
          sheet_updated_at?: string | null
          sheet_version?: Json
        }
        Relationships: [
          {
            foreignKeyName: "sync_conflicts_sheet_row_id_fkey"
            columns: ["sheet_row_id"]
            isOneToOne: false
            referencedRelation: "sheet_rows"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_runs: {
        Row: {
          conflicts: number
          direction: string
          duration_ms: number | null
          errors: Json | null
          finished_at: string | null
          id: string
          rows_pulled: number
          rows_pushed: number
          sheet_name: string | null
          started_at: string
          status: string
          trigger: string
          triggered_by: string | null
        }
        Insert: {
          conflicts?: number
          direction: string
          duration_ms?: number | null
          errors?: Json | null
          finished_at?: string | null
          id?: string
          rows_pulled?: number
          rows_pushed?: number
          sheet_name?: string | null
          started_at?: string
          status?: string
          trigger: string
          triggered_by?: string | null
        }
        Update: {
          conflicts?: number
          direction?: string
          duration_ms?: number | null
          errors?: Json | null
          finished_at?: string | null
          id?: string
          rows_pulled?: number
          rows_pushed?: number
          sheet_name?: string | null
          started_at?: string
          status?: string
          trigger?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      trail_memberships: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["trail_role"]
          trail_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["trail_role"]
          trail_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["trail_role"]
          trail_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_memberships_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
        ]
      }
      trails: {
        Row: {
          color: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          is_free: boolean
          name: string
          order_index: number
          price_cents: number
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          color?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean
          name: string
          order_index?: number
          price_cents?: number
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          color?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean
          name?: string
          order_index?: number
          price_cents?: number
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
      content_status: "draft" | "published" | "archived"
      lesson_content_type: "video" | "text" | "quiz" | "file"
      trail_role: "instructor" | "moderator" | "student"
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
    Enums: {
      app_role: ["admin", "editor", "viewer"],
      content_status: ["draft", "published", "archived"],
      lesson_content_type: ["video", "text", "quiz", "file"],
      trail_role: ["instructor", "moderator", "student"],
    },
  },
} as const
