// src/components/ui-parts/vehicle-detail/AdminOrderManagement.tsx
import React, { useState } from "react";
import { Check, X, Clock, User, Calendar } from "lucide-react";
import { OrderData } from "../../../server/orders/handler_000";

interface AdminOrderManagementProps {
  vehicleId: string;
  orders: OrderData[];
  onApproveOrder: (orderId: string, adminUserId: string) => void;
  onRejectOrder: (orderId: string, adminUserId: string, rejectReason?: string) => void;
  isProcessing: boolean;
  currentAdminId: string;
}

const AdminOrderManagement: React.FC<AdminOrderManagementProps> = ({ orders, onApproveOrder, onRejectOrder, isProcessing, currentAdminId }) => {
  const [rejectReason, setRejectReason] = useState<string>("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // 注文を状態別にフィルタリング
  const pendingOrders = orders.filter((order) => order.status === 0);
  const approvedOrders = orders.filter((order) => order.status === 1);
  const rejectedOrders = orders.filter((order) => order.status === 2);
  const cancelledOrders = orders.filter((order) => order.status === 3);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            承認済み
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            拒否済み
          </span>
        );
      case 3:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">キャンセル済み</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ja-JP");
  };

  const handleApprove = (orderId: string) => {
    if (confirm("この注文を承認しますか？承認すると車両は販売済みとなります。")) {
      onApproveOrder(orderId, currentAdminId);
    }
  };

  const handleReject = (orderId: string) => {
    setShowRejectModal(orderId);
  };

  const confirmReject = () => {
    if (showRejectModal) {
      onRejectOrder(showRejectModal, currentAdminId, rejectReason.trim() || undefined);
      setShowRejectModal(null);
      setRejectReason("");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">注文管理（管理者用）</h3>
        <p className="text-gray-500 text-center py-8">この車両に対する注文はありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">注文管理（管理者用）</h3>

      {/* 承認待ち注文 */}
      {pendingOrders.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-orange-900 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            承認待ち ({pendingOrders.length}件)
          </h4>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{order.user_name || `ユーザーID: ${order.user_id}`}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      注文日: {formatDate(order.order_date)}
                    </div>
                    {order.notes && <p className="text-sm text-gray-600 mt-2">備考: {order.notes}</p>}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(order.id)}
                      disabled={isProcessing}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      承認
                    </button>
                    <button
                      onClick={() => handleReject(order.id)}
                      disabled={isProcessing}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      拒否
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* その他の注文履歴 */}
      {(approvedOrders.length > 0 || rejectedOrders.length > 0 || cancelledOrders.length > 0) && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">注文履歴</h4>
          <div className="space-y-2">
            {[...approvedOrders, ...rejectedOrders, ...cancelledOrders].map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">ユーザーID: {order.user_id}</span>
                    <span className="ml-2">{getStatusBadge(order.status)}</span>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(order.order_date)}</div>
                </div>
                {order.reject_reason && <p className="text-sm text-red-600 mt-1">拒否理由: {order.reject_reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 拒否理由入力モーダル */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">注文を拒否</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">拒否理由（任意）</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="拒否理由を入力してください..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                キャンセル
              </button>
              <button
                onClick={confirmReject}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                拒否する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
