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
      class_bookings: {
        Row: {
          id: string
          user_id: string
          class_id: string
          booking_date: string
          booking_time: string
          location: string
          status: string
          waitlist_position: number | null
          membership_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          class_id: string
          booking_date: string
          booking_time: string
          location?: string
          status?: string
          waitlist_position?: number | null
          membership_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          class_id?: string
          booking_date?: string
          booking_time?: string
          location?: string
          status?: string
          waitlist_position?: number | null
          membership_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          }
        ]
      },
      class_pack_usage: {
        Row: {
          class_date: string
          created_at: string
          id: string
          membership_id: string
          user_id: string
        }
        Insert: {
          class_date: string
          created_at?: string
          id?: string
          membership_id: string
          user_id: string
        }
        Update: {
          class_date?: string
          created_at?: string
          id?: string
          membership_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_pack_usage_membership_id_fkey"
            columns: ["membership_id"]
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_pack_usage_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      classes: {
        Row: {
          id: string
          title: string
          description: string | null
          instructor_id: string | null
          duration_minutes: number
          capacity: number
          price: number
          level: string
          category: string
          start_time: string
          end_time: string
          recurring: boolean
          recurring_pattern: string | null
          location: string
          status: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          instructor_id?: string | null
          duration_minutes: number
          capacity: number
          price: number
          level: string
          category: string
          start_time: string
          end_time: string
          recurring?: boolean
          recurring_pattern?: string | null
          location: string
          status?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          instructor_id?: string | null
          duration_minutes?: number
          capacity?: number
          price?: number
          level?: string
          category?: string
          start_time?: string
          end_time?: string
          recurring?: boolean
          recurring_pattern?: string | null
          location?: string
          status?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          }
        ]
      }
      instructors: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string | null
          bio: string | null
          specialties: string[]
          certifications: string[]
          image_url: string | null
          status: string
          social_media: Json
          classes_count: number
          joined_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          phone?: string | null
          bio?: string | null
          specialties?: string[]
          certifications?: string[]
          image_url?: string | null
          status?: string
          social_media?: Json
          classes_count?: number
          joined_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          bio?: string | null
          specialties?: string[]
          certifications?: string[]
          image_url?: string | null
          status?: string
          social_media?: Json
          classes_count?: number
          joined_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructors_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      memberships: {
        Row: {
          classes_remaining: number | null
          created_at: string
          end_date: string | null
          id: string
          membership_type: string
          start_date: string
          status: string
          total_classes: number | null
          unlimited: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          classes_remaining?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          membership_type: string
          start_date?: string
          status?: string
          total_classes?: number | null
          unlimited?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          classes_remaining?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          membership_type?: string
          start_date?: string
          status?: string
          total_classes?: number | null
          unlimited?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updateables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Relationships<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Relationships']
