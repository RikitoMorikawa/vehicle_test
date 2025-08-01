// src/server/admin/edit-user/handler_000.ts
import { supabase } from "../../../lib/supabase";
import { UpdateUserData } from "../../../types/admin/edit-user/page";
import type { User } from "../../../types/auth/page";

export const editUserHandler = {
  async fetchUser(userId: string): Promise<User> {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const updateData: UpdateUserData = {
      company_name: data.company_name,
      user_name: data.user_name,
      phone: data.phone,
      email: data.email,
      password: data.password, 
      is_approved: data.is_approved,
    };

    if (data.password) {
      updateData.password = data.password;
    }

    const { data: updatedUser, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single();

    if (error) throw error;
    return updatedUser;
  },

  async updateUserApproval(userId: string, approve: boolean): Promise<void> {
    const { error } = await supabase.from("users").update({ is_approved: approve }).eq("id", userId);

    if (error) throw error;
  },
};