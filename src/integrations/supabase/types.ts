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
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json
          new_data: Json | null
          old_data: Json | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          new_data?: Json | null
          old_data?: Json | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          new_data?: Json | null
          old_data?: Json | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_code: string
          course_id: string | null
          course_title: string | null
          hours: number | null
          id: string
          issued_at: string
          issuer: string | null
          pdf_url: string | null
          revoked_at: string | null
          revoked_reason: string | null
          status: Database["public"]["Enums"]["certificate_status"]
          student_name: string | null
          trail_id: string | null
          trail_name: string | null
          user_id: string
        }
        Insert: {
          certificate_code?: string
          course_id?: string | null
          course_title?: string | null
          hours?: number | null
          id?: string
          issued_at?: string
          issuer?: string | null
          pdf_url?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          student_name?: string | null
          trail_id?: string | null
          trail_name?: string | null
          user_id: string
        }
        Update: {
          certificate_code?: string
          course_id?: string | null
          course_title?: string | null
          hours?: number | null
          id?: string
          issued_at?: string
          issuer?: string | null
          pdf_url?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          student_name?: string | null
          trail_id?: string | null
          trail_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          lessons_completed: number
          lessons_total: number
          pct_complete: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          lessons_completed?: number
          lessons_total?: number
          pct_complete?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          lessons_completed?: number
          lessons_total?: number
          pct_complete?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          duration_min: number | null
          id: string
          instructor_id: string | null
          instructor_name: string | null
          is_free: boolean
          learning_objectives: string[] | null
          level: string | null
          materials: Json | null
          order_index: number
          price_cents: number
          requirements: string[] | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          target_audience: string[] | null
          title: string
          trail_id: string
          trailer_url: string | null
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          instructor_id?: string | null
          instructor_name?: string | null
          is_free?: boolean
          learning_objectives?: string[] | null
          level?: string | null
          materials?: Json | null
          order_index?: number
          price_cents?: number
          requirements?: string[] | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          target_audience?: string[] | null
          title: string
          trail_id: string
          trailer_url?: string | null
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          instructor_id?: string | null
          instructor_name?: string | null
          is_free?: boolean
          learning_objectives?: string[] | null
          level?: string | null
          materials?: Json | null
          order_index?: number
          price_cents?: number
          requirements?: string[] | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          target_audience?: string[] | null
          title?: string
          trail_id?: string
          trailer_url?: string | null
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
      enrollments: {
        Row: {
          access_type: Database["public"]["Enums"]["access_type"]
          course_id: string | null
          created_at: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          payment_id: string | null
          scope: Database["public"]["Enums"]["enrollment_scope"]
          source: string | null
          starts_at: string
          status: Database["public"]["Enums"]["enrollment_status"]
          trail_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["access_type"]
          course_id?: string | null
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          payment_id?: string | null
          scope: Database["public"]["Enums"]["enrollment_scope"]
          source?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          trail_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_type?: Database["public"]["Enums"]["access_type"]
          course_id?: string | null
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          payment_id?: string | null
          scope?: Database["public"]["Enums"]["enrollment_scope"]
          source?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          trail_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          progress_pct: number
          status: Database["public"]["Enums"]["lesson_status"]
          updated_at: string
          user_id: string
          watch_time_sec: number
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          progress_pct?: number
          status?: Database["public"]["Enums"]["lesson_status"]
          updated_at?: string
          user_id: string
          watch_time_sec?: number
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          progress_pct?: number
          status?: Database["public"]["Enums"]["lesson_status"]
          updated_at?: string
          user_id?: string
          watch_time_sec?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
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
      payments: {
        Row: {
          amount_cents: number
          course_id: string | null
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          processed_at: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_id: string | null
          provider_payment_id: string | null
          provider_ref: string | null
          raw: Json | null
          raw_payload: Json | null
          status: Database["public"]["Enums"]["payment_status"]
          trail_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents?: number
          course_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_event_id?: string | null
          provider_payment_id?: string | null
          provider_ref?: string | null
          raw?: Json | null
          raw_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          trail_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          course_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_event_id?: string | null
          provider_payment_id?: string | null
          provider_ref?: string | null
          raw?: Json | null
          raw_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          trail_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
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
      admin_metrics: { Args: never; Returns: Json }
      grant_enrollment_from_payment: {
        Args: { _payment_id: string }
        Returns: string
      }
      list_public_certificates: {
        Args: { _limit?: number }
        Returns: {
          certificate_code: string
          course_title: string
          hours: number
          issued_at: string
          issuer: string
          student_name: string
          trail_name: string
        }[]
      }
      revoke_enrollment_from_payment: {
        Args: { _payment_id: string }
        Returns: number
      }
      verify_certificate: {
        Args: { _code: string }
        Returns: {
          certificate_code: string
          course_title: string
          hours: number
          issued_at: string
          issuer: string
          revoked_at: string
          status: Database["public"]["Enums"]["certificate_status"]
          student_name: string
          trail_name: string
        }[]
      }
    }
    Enums: {
      access_type:
        | "manual"
        | "purchase"
        | "gift"
        | "trial"
        | "scholarship"
        | "subscription"
        | "partnership"
      app_role: "admin" | "editor" | "viewer"
      certificate_status: "valid" | "revoked"
      content_status: "draft" | "published" | "archived"
      enrollment_scope: "course" | "trail"
      enrollment_status:
        | "pending"
        | "active"
        | "expired"
        | "revoked"
        | "refunded"
      lesson_content_type: "video" | "text" | "quiz" | "file"
      lesson_status: "not_started" | "in_progress" | "completed"
      payment_provider: "manual" | "stripe" | "mercadopago"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "chargeback"
        | "cancelled"
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
      access_type: [
        "manual",
        "purchase",
        "gift",
        "trial",
        "scholarship",
        "subscription",
        "partnership",
      ],
      app_role: ["admin", "editor", "viewer"],
      certificate_status: ["valid", "revoked"],
      content_status: ["draft", "published", "archived"],
      enrollment_scope: ["course", "trail"],
      enrollment_status: [
        "pending",
        "active",
        "expired",
        "revoked",
        "refunded",
      ],
      lesson_content_type: ["video", "text", "quiz", "file"],
      lesson_status: ["not_started", "in_progress", "completed"],
      payment_provider: ["manual", "stripe", "mercadopago"],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "chargeback",
        "cancelled",
      ],
      trail_role: ["instructor", "moderator", "student"],
    },
  },
} as const
