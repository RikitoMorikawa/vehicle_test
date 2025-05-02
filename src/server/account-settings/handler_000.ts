import { supabase } from "../../lib/supabase";
import { UpdatePasswordData, UpdateProfileData } from "../../types/account-settings/page";
import type { User } from "../../types/auth";

export const accountHandler = {
  async fetchAccount(userId: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

    if (error) throw error;
    return data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        company_name: data.company_name,
        user_name: data.user_name,
        phone: data.phone,
        email: data.email,
      })
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw error;
    return updatedUser;
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    const { error: verifyError } = await supabase.from("users").select("id").eq("id", data.id).eq("password", data.currentPassword).single();

    if (verifyError) {
      throw new Error("現在のパスワードが正しくありません");
    }

    const { error: updateError } = await supabase.from("users").update({ password: data.newPassword }).eq("id", data.id);

    if (updateError) throw updateError;
  },
};
