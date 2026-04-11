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
      doubts: {
        Row: {
          answer: string | null
          created_at: string
          date: string
          id: string
          image_url: string | null
          question: string
          subject: string | null
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          date: string
          id?: string
          image_url?: string | null
          question: string
          subject?: string | null
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          date?: string
          id?: string
          image_url?: string | null
          question?: string
          subject?: string | null
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          correct_answers: number | null
          created_at: string
          date: string
          duration: number
          hardness: string | null
          id: string
          mistakes: string | null
          mood: string
          notes: string | null
          questions_attempted: number | null
          session_type: string
          stress_reason: string | null
          subject: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string
          date: string
          duration: number
          hardness?: string | null
          id?: string
          mistakes?: string | null
          mood: string
          notes?: string | null
          questions_attempted?: number | null
          session_type: string
          stress_reason?: string | null
          subject: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_answers?: number | null
          created_at?: string
          date?: string
          duration?: number
          hardness?: string | null
          id?: string
          mistakes?: string | null
          mood?: string
          notes?: string | null
          questions_attempted?: number | null
          session_type?: string
          stress_reason?: string | null
          subject?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mock_scores: {
        Row: {
          created_at: string
          date: string
          id: string
          score: number
          test: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          score: number
          test: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          score?: number
          test?: string
          user_id?: string
        }
        Relationships: []
      }
      planner_entries: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          end_time: string
          id: string
          session_type: string
          start_time: string
          subject: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          end_time: string
          id?: string
          session_type: string
          start_time: string
          subject: string
          topic?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          session_type?: string
          start_time?: string
          subject?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          available_hours_per_day: number | null
          created_at: string
          daily_reminder: boolean
          display_name: string
          exam_date: string | null
          id: string
          mentor_day: string
          mentor_reminder: boolean
          mentor_time: string
          monthly_review_day: string
          session_reminder: boolean
          streak_reminder: boolean
          target_exam: string
          theme: string
          updated_at: string
          week_start: string
        }
        Insert: {
          available_hours_per_day?: number | null
          created_at?: string
          daily_reminder?: boolean
          display_name?: string
          exam_date?: string | null
          id: string
          mentor_day?: string
          mentor_reminder?: boolean
          mentor_time?: string
          monthly_review_day?: string
          session_reminder?: boolean
          streak_reminder?: boolean
          target_exam?: string
          theme?: string
          updated_at?: string
          week_start?: string
        }
        Update: {
          available_hours_per_day?: number | null
          created_at?: string
          daily_reminder?: boolean
          display_name?: string
          exam_date?: string | null
          id?: string
          mentor_day?: string
          mentor_reminder?: boolean
          mentor_time?: string
          monthly_review_day?: string
          session_reminder?: boolean
          streak_reminder?: boolean
          target_exam?: string
          theme?: string
          updated_at?: string
          week_start?: string
        }
        Relationships: []
      }
      study_subjects: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
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
