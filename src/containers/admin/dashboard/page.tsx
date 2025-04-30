import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { User } from '../../../types/auth';
import AdminDashboardComponent from '../../../components/admin/dashboard/page';

const AdminDashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('role', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const sortedUsers = (data || []).sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return 0;
      });

      setUsers(sortedUsers);
    } catch (err) {
      setError('ユーザー情報の取得に失敗しました');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproval = async (userId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_approved: approve })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
    } catch (err) {
      setError('ユーザーの承認状態の更新に失敗しました');
      console.error('Error updating user approval:', err);
    }
  };

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  return (
    <AdminDashboardComponent
      users={users}
      loading={loading}
      error={error}
      onApproval={handleApproval}
      onEditUser={handleEditUser}
    />
  );
};

export default AdminDashboardContainer;