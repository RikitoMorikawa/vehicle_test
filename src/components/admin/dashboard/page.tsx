import React from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import Button from '../../ui/Button';
import { User } from '../../../types/auth';
import { UserCog, CheckCircle, XCircle, Pencil } from 'lucide-react';

interface AdminDashboardComponentProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onApproval: (userId: string, approve: boolean) => Promise<void>;
  onEditUser: (userId: string) => void;
}

const AdminDashboardComponent: React.FC<AdminDashboardComponentProps> = ({
  users,
  loading,
  error,
  onApproval,
  onEditUser
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <UserCog className="h-6 w-6 text-teal-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">ユーザー管理</h2>
                </div>
              </div>

              {error ? (
                <div className="p-6 text-red-600">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          会社名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          担当者名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          メールアドレス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          電話番号
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ロール
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          承認状態
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.company_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.user_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.is_approved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.is_approved ? '承認済み' : '承認待ち'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {user.role !== 'admin' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEditUser(user.id)}
                                    className="flex items-center"
                                  >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    編集
                                  </Button>
                                  {!user.is_approved && (
                                    <Button
                                      size="sm"
                                      onClick={() => onApproval(user.id, true)}
                                      className="flex items-center"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      承認
                                    </Button>
                                  )}
                                  {user.is_approved && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => onApproval(user.id, false)}
                                      className="flex items-center"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      承認取消
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardComponent;