import { supabase } from '../../../lib/supabase';
import type { User } from '../../../types/auth';

export const adminDashboardHandler = {
  async fetchUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('role', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      return 0;
    });
  },

  async updateUserApproval(userId: string, approve: boolean): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ is_approved: approve })
      .eq('id', userId);

    if (error) throw error;
  }
};