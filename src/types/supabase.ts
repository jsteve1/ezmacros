export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      macro_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          carbs: number
          protein: number
          fat: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          carbs: number
          protein: number
          fat: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          carbs?: number
          protein?: number
          fat?: number
          created_at?: string
        }
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
  }
} 